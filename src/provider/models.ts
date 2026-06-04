import vscode from 'vscode';
import { t } from '../i18n';
import type { ModelDefinition } from '../types';

/**
 * NOTE: Non-public API surface.
 *
 * The fields below (`configurationSchema` on chat info, `modelConfiguration`
 * on response options, plus `isUserSelectable` / `statusIcon`) are not part
 * of the stable `vscode.LanguageModelChat*` typings yet. They are the same
 * shape currently consumed by GitHub Copilot Chat to render a per-model
 * config dropdown in the model picker.
 */

export type ThinkingEffort = 'none' | 'enabled';

export type ModelConfigurationOptions = vscode.ProvideLanguageModelChatResponseOptions & {
	readonly modelConfiguration?: Record<string, unknown>;
	readonly configuration?: Record<string, unknown>;
};

type ThinkingEffortConfigurationSchema = ReturnType<typeof buildThinkingToggleSchema>;

export type ModelPickerChatInformation = vscode.LanguageModelChatInformation & {
	readonly isUserSelectable: boolean;
	readonly statusIcon?: vscode.ThemeIcon;
	readonly configurationSchema?: ThinkingEffortConfigurationSchema;
};

/**
 * 将内部模型定义转换为 Copilot 模型选择器可识别的模型信息。
 * @param m MiMo 模型定义。
 * @param hasApiKey 当前是否已配置 API Key。
 * @returns 提供给 Copilot Chat 的模型信息对象。
 */
export function toChatInfo(m: ModelDefinition, hasApiKey: boolean): ModelPickerChatInformation {
	const detailKey = resolveDetailKey(m);
	const modelDetail = detailKey ? t(detailKey) : m.detail;
	return {
		id: m.id,
		name: m.name,
		family: m.family,
		version: m.version,
		detail: hasApiKey ? modelDetail : t('auth.apiKeyRequiredDetail'),
		tooltip: hasApiKey ? undefined : t('auth.apiKeyRequiredDetail'),
		statusIcon: hasApiKey ? undefined : new vscode.ThemeIcon('warning'),
		maxInputTokens: m.maxInputTokens,
		maxOutputTokens: m.maxOutputTokens,
		isUserSelectable: true,
		configurationSchema: resolveConfigurationSchema(m),
		capabilities: {
			toolCalling: m.capabilities.toolCalling,
			imageInput: m.capabilities.imageInput,
		},
	};
}

/**
 * 从 Copilot 传回的模型配置中解析思考开关状态。
 * @param options 当前请求携带的模型配置选项。
 * @returns 规范化后的思考开关状态。
 */
export function getConfiguredThinkingEffort(options: ModelConfigurationOptions): ThinkingEffort {
	const configuredEffort =
		options.modelConfiguration?.thinkingMode ??
		options.configuration?.thinkingMode ??
		options.modelConfiguration?.reasoningEffortLevel ??
		options.configuration?.reasoningEffortLevel ??
		options.modelConfiguration?.reasoningEffort ??
		options.configuration?.reasoningEffort;

	if (configuredEffort === 'none' || configuredEffort === 'disabled' || configuredEffort === 'off') {
		return 'none';
	}

	// 历史版本中的 low / medium / high / max 一律视为开启思考。
	return 'enabled';
}

/**
 * 为支持思考能力的模型构建模型选择器配置。
 * @param model 当前模型定义。
 * @returns 若模型支持思考，则返回思考强度配置；否则返回空。
 */
function resolveConfigurationSchema(
	model: ModelDefinition,
): ThinkingEffortConfigurationSchema | undefined {
	return model.capabilities.thinking ? buildThinkingToggleSchema() : undefined;
}

/**
 * 构建 Copilot 模型选择器中的思考开关配置结构。
 * @returns Copilot 可识别的配置 schema。
 */
function buildThinkingToggleSchema() {
	return {
		properties: {
			// 使用新字段名，避免沿用旧的强度枚举缓存。
			thinkingMode: {
				type: 'string',
				title: t('status.thinking'),
				enum: ['none', 'enabled'],
				enumItemLabels: [t('thinking.none'), t('thinking.enabled')],
				enumDescriptions: [
					t('thinking.none.desc'),
					t('thinking.enabled.desc'),
				],
				default: 'enabled',
				group: 'navigation',
			},
		},
	} as const;
}

/**
 * 根据模型 ID 解析本地化描述文案键。
 * @param m 模型定义。
 * @returns 可用的本地化键；若不存在翻译则返回空。
 */
function resolveDetailKey(m: ModelDefinition): string | undefined {
	const suffix =
		m.id === 'mimo-v2.5'
			? 'v2.5'
			: m.id.startsWith('mimo-v2.5-')
				? m.id.slice('mimo-v2.5-'.length)
				: m.id;
	const key = `model.${suffix}.detail`;
	const translated = t(key);
	return translated !== key ? key : undefined;
}
