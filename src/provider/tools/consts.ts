// MiMo OpenAI 兼容 API 当前支持 function calling，这里延续 128 的保护上限。
export const MIMO_TOOLS_LIMIT = 128;
export const DEEPSEEK_TOOLS_LIMIT = MIMO_TOOLS_LIMIT;

export const ACTIVATE_TOOL_PREFIX = 'activate_';
export const PREFLIGHT_ACTIVATE_CALL_ID_PREFIX = 'mimo_preflight_activate_';
export const MAX_PREFLIGHT_ROUNDS_PER_USER_REQUEST = 3;

export const TOOL_DRIFT_NOTICE_START = '[mimo-copilot-tool-drift-notice-start]: #';
export const TOOL_DRIFT_NOTICE_END = '[mimo-copilot-tool-drift-notice-end]: #';
