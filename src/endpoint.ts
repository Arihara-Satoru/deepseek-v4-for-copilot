export const OFFICIAL_DEEPSEEK_API_HOST = 'api.deepseek.com';
export const OFFICIAL_MIMO_API_HOST = 'api.xiaomimimo.com';

export function isOfficialDeepSeekBaseUrl(baseUrl: string): boolean {
	try {
		return new URL(baseUrl).hostname.toLowerCase() === OFFICIAL_DEEPSEEK_API_HOST;
	} catch {
		return false;
	}
}

export function isOfficialMimoBaseUrl(baseUrl: string): boolean {
	try {
		return new URL(baseUrl).hostname.toLowerCase() === OFFICIAL_MIMO_API_HOST;
	} catch {
		return false;
	}
}

export function normalizeBaseUrl(baseUrl: string): string {
	return baseUrl.trim().replace(/\/+$/u, '');
}
