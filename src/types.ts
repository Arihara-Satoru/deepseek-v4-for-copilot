/**
 * MiMo Copilot 扩展共用类型定义。
 */

export interface MimoTextContentPart {
	type: 'text';
	text: string;
}

export interface MimoImageContentPart {
	type: 'image_url';
	image_url: {
		url: string;
	};
}

export type MimoContentPart = MimoTextContentPart | MimoImageContentPart;

// ---- API request/response types ----

export interface MimoMessage {
	role: 'system' | 'user' | 'assistant' | 'tool';
	content: string | MimoContentPart[];
	tool_call_id?: string;
	tool_calls?: MimoToolCall[];
	reasoning_content?: string;
}

export interface MimoToolCall {
	id: string;
	type: 'function';
	function: {
		name: string;
		arguments: string;
	};
}

export interface MimoTool {
	type: 'function';
	function: {
		name: string;
		description?: string;
		parameters?: Record<string, unknown>;
	};
}

export interface MimoUsage {
	prompt_tokens: number;
	completion_tokens: number;
	total_tokens: number;
	prompt_cache_hit_tokens?: number;
	prompt_cache_miss_tokens?: number;
	prompt_tokens_details?: {
		cached_tokens?: number;
	};
	completion_tokens_details?: {
		reasoning_tokens?: number;
	};
}

export interface MimoRequest {
	model: string;
	messages: MimoMessage[];
	stream: boolean;
	temperature?: number;
	top_p?: number;
	max_completion_tokens?: number;
	tools?: MimoTool[];
	tool_choice?: 'none' | 'auto' | 'required';
	thinking?: { type: 'enabled' | 'disabled' };
	reasoning_effort?: 'low' | 'medium' | 'high';
	stream_options?: {
		include_usage: boolean;
	};
}

export interface MimoStreamChunk {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: Array<{
		index: number;
		delta: {
			role?: string;
			content?: string;
			reasoning_content?: string;
			tool_calls?: Array<{
				index: number;
				id?: string;
				type?: string;
				function?: {
					name?: string;
					arguments?: string;
				};
			}>;
		};
		finish_reason: string | null;
	}>;
	usage?: MimoUsage;
}

// ---- Stream callbacks ----

export interface StreamCallbacks {
	onContent: (content: string) => void;
	onThinking: (text: string) => void;
	onToolCall: (toolCall: MimoToolCall) => void;
	onError: (error: Error) => void;
	onDone: () => void;
	onUsage?: (usage: MimoUsage) => void;
}

// ---- Model definitions ----

export type PricingCurrency = 'USD' | 'CNY';

export type PriceCategory = 'low' | 'medium' | 'high' | 'very_high';

export interface ModelPricing {
	cacheHitInput: number;
	cacheMissInput: number;
	output: number;
}

export interface ModelDefinition {
	id: string;
	name: string;
	family: string;
	version: string;
	detail: string;
	maxInputTokens: number;
	maxOutputTokens: number;
	capabilities: {
		toolCalling: boolean | number;
		imageInput: boolean;
		thinking: boolean;
	};
	requiresThinkingParam: boolean;
	pricing?: Readonly<Record<PricingCurrency, ModelPricing>>;
	priceCategory?: PriceCategory;
}

/**
 * 兼容旧实现中的 DeepSeek 命名，避免一次性改动过大。
 */
export type DeepSeekMessage = MimoMessage;
export type DeepSeekToolCall = MimoToolCall;
export type DeepSeekTool = MimoTool;
export type DeepSeekUsage = MimoUsage;
export type DeepSeekRequest = MimoRequest;
export type DeepSeekStreamChunk = MimoStreamChunk;
