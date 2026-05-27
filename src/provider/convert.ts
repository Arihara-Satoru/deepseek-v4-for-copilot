import vscode from 'vscode';
import { safeStringify } from '../json';
import type {
	MimoContentPart,
	MimoMessage,
	MimoTool,
	MimoToolCall,
} from '../types';
import { parseFirstReplayMarker } from './replay';

/**
 * 将 VS Code 对话消息转换为 MiMo OpenAI 兼容格式。
 * 当模型支持原生图片输入时，用户消息会保留文本与图片数组内容。
 */
export function convertMessages(
	messages: readonly vscode.LanguageModelChatRequestMessage[],
	isThinkingModel: boolean,
	allowImageInput: boolean,
): MimoMessage[] {
	const result: MimoMessage[] = [];

	for (const message of messages) {
		const role = mapRole(message.role);

		let content = '';
		let thinkingContent = '';
		const toolCalls: MimoToolCall[] = [];
		const contentParts: MimoContentPart[] = [];
		const toolResults: Array<{ callId: string; content: string }> = [];

		for (const part of message.content) {
			if (part instanceof vscode.LanguageModelTextPart) {
				content += part.value;
				if (allowImageInput && role === 'user') {
					contentParts.push({
						type: 'text',
						text: part.value,
					});
				}
			} else if (allowImageInput && role === 'user' && isImageDataPart(part)) {
				contentParts.push(createImageContentPart(part));
			} else if (isLanguageModelThinkingPart(part)) {
				thinkingContent += normalizeThinkingPartText(part.value);
			} else if (part instanceof vscode.LanguageModelToolCallPart) {
				toolCalls.push({
					id: part.callId,
					type: 'function',
					function: {
						name: part.name,
						arguments: safeStringify(part.input),
					},
				});
			} else if (part instanceof vscode.LanguageModelToolResultPart) {
				let toolContent = '';
				for (const item of part.content) {
					if (item instanceof vscode.LanguageModelTextPart) {
						toolContent += item.value;
					}
				}
				toolResults.push({
					callId: part.callId,
					content: toolContent || safeStringify(part.content),
				});
			}
		}

		if (role === 'assistant') {
			if (content || toolCalls.length > 0) {
				const replayMarker = isThinkingModel ? parseFirstReplayMarker(message) : undefined;
				const msg: MimoMessage = {
					role: 'assistant' as const,
					content: content || '',
				};

				if (toolCalls.length > 0) {
					msg.tool_calls = toolCalls;
				}

				if (isThinkingModel) {
					msg.reasoning_content = getReasoningContent(replayMarker, thinkingContent);
				}

				result.push(msg);
			}
		} else {
			const normalizedContent = normalizeUserOrSystemContent(content, contentParts, allowImageInput);
			if (normalizedContent) {
				result.push({
					role: role as 'user' | 'assistant',
					content: normalizedContent,
				});
			}
		}

		// Tool result messages follow their associated assistant message
		for (const tr of toolResults) {
			result.push({
				role: 'tool',
				content: tr.content,
				tool_call_id: tr.callId,
			});
		}
	}

	return result;
}

function getReasoningContent(
	replayMarker: ReturnType<typeof parseFirstReplayMarker>,
	thinkingContent: string,
): string {
	if (replayMarker?.valid && replayMarker.reasoningText) {
		return replayMarker.reasoningText;
	}
	return thinkingContent;
}

function isLanguageModelThinkingPart(part: unknown): part is vscode.LanguageModelThinkingPart {
	return (
		typeof vscode.LanguageModelThinkingPart === 'function' &&
		part instanceof vscode.LanguageModelThinkingPart
	);
}

function normalizeThinkingPartText(value: string | string[]): string {
	return Array.isArray(value) ? value.join('') : value;
}

function mapRole(role: vscode.LanguageModelChatMessageRole): 'user' | 'assistant' {
	switch (role) {
		case vscode.LanguageModelChatMessageRole.User:
			return 'user';
		case vscode.LanguageModelChatMessageRole.Assistant:
			return 'assistant';
		default:
			return 'user';
	}
}

/**
 * 将 VS Code 工具定义转换为 MiMo/OpenAI 兼容 function schema。
 */
export function convertTools(
	tools: readonly vscode.LanguageModelChatTool[] | undefined,
): MimoTool[] | undefined {
	if (!tools || tools.length === 0) {
		return undefined;
	}

	return tools.map((tool) => ({
		type: 'function' as const,
		function: {
			name: tool.name,
			description: tool.description,
			parameters: tool.inputSchema as Record<string, unknown> | undefined,
		},
	}));
}

/**
 * 统计请求字符量，用于动态估算 token 比例。
 */
export function countMessageChars(messages: MimoMessage[]): number {
	let total = 0;
	for (const msg of messages) {
		total += getContentChars(msg.content);
		total += msg.reasoning_content?.length ?? 0;
		if (msg.tool_calls) {
			for (const tc of msg.tool_calls) {
				total += tc.function?.name?.length ?? 0;
				total += tc.function?.arguments?.length ?? 0;
			}
		}
	}
	return total;
}

/**
 * 仅当模型支持原生图片输入时，才返回多模态数组内容。
 */
function normalizeUserOrSystemContent(
	textContent: string,
	contentParts: readonly MimoContentPart[],
	allowImageInput: boolean,
): string | MimoContentPart[] | undefined {
	if (allowImageInput && contentParts.length > 0) {
		return [...contentParts];
	}

	return textContent || undefined;
}

/**
 * 将本地图片数据转换为 MiMo 文档要求的 data URL。
 */
function createImageContentPart(part: vscode.LanguageModelDataPart): MimoContentPart {
	const encoded = Buffer.from(part.data).toString('base64');
	return {
		type: 'image_url',
		image_url: {
			url: `data:${part.mimeType};base64,${encoded}`,
		},
	};
}

function getContentChars(content: string | readonly MimoContentPart[]): number {
	if (typeof content === 'string') {
		return content.length;
	}

	let total = 0;
	for (const part of content) {
		if (part.type === 'text') {
			total += part.text.length;
		} else if (part.type === 'image_url') {
			total += part.image_url.url.length;
		}
	}
	return total;
}

function isImageDataPart(part: unknown): part is vscode.LanguageModelDataPart {
	return part instanceof vscode.LanguageModelDataPart && part.mimeType.startsWith('image/');
}
