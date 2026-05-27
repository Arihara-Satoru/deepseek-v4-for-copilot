import { MIMO_TOOLS_LIMIT } from './provider/tools/consts';
import type { ModelDefinition } from './types';

/**
 * Compile-time constants shared across the extension.
 *
 * These do NOT depend on the VS Code runtime (no workspace configuration,
 * no secrets API). For run-time settings reads see `config.ts`.
 */

/** VS Code 配置命名空间。 */
export const CONFIG_SECTION = 'mimo-copilot';

export const EXTERNAL_URLS = {
	mimo: {
		apiKeys: 'https://platform.xiaomimimo.com/docs/console/api-keys',
		usage: 'https://platform.xiaomimimo.com/docs/en-US/price/pay-as-you-go',
		status: 'https://platform.xiaomimimo.com/',
	},
} as const;

/** URI path handled by this extension to reveal the output log. */
export const SHOW_LOGS_URI_PATH = '/showLogs';

/** URI path handled by this extension to open API key configuration. */
export const CONFIGURE_API_KEY_URI_PATH = '/setApiKey';

// VS Code's internal LanguageModelChatMessageRole.System is not exposed in @types/vscode.
export const LANGUAGE_MODEL_CHAT_SYSTEM_ROLE = 3;

// ---- Secret keys ----

/** SecretStorage key for the MiMo API key。 */
export const API_KEY_SECRET = 'mimo-copilot.apiKey';

/** memento key tracking whether the welcome walkthrough has been shown. */
export const WELCOME_SHOWN_KEY = 'mimo-copilot.welcomeShown';

// ---- Walkthrough ----

/** Walkthrough contribution ID. */
export const WALKTHROUGH_ID = 'Vizards.mimo-for-copilot#mimoGettingStarted';

// ---- Model registry ----

/** 暴露给 Copilot Chat 的 MiMo 模型列表。 */
export const MODELS: ModelDefinition[] = [
	{
		id: 'mimo-v2.5',
		name: 'MiMo V2.5',
		family: 'mimo',
		version: 'v2.5',
		detail: 'Native multimodal model',
		maxInputTokens: 1_000_000,
		maxOutputTokens: 131_072,
		capabilities: {
			toolCalling: MIMO_TOOLS_LIMIT,
			imageInput: true,
			thinking: true,
		},
		requiresThinkingParam: true,
	},
	{
		id: 'mimo-v2.5-pro',
		name: 'MiMo V2.5 Pro',
		family: 'mimo',
		version: 'v2.5',
		detail: 'Flagship reasoning model',
		maxInputTokens: 1_000_000,
		maxOutputTokens: 131_072,
		capabilities: {
			toolCalling: MIMO_TOOLS_LIMIT,
			imageInput: false,
			thinking: true,
		},
		requiresThinkingParam: true,
	},
];
