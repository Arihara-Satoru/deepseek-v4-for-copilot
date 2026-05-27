export interface ErrorActionUrls {
	configureApiKey?: string;
	showLogs?: string;
}

export interface ErrorActionLink {
	labelKey: string;
	url: string;
}

export interface HttpErrorLinkDefinition {
	labelKey: string;
	url: string;
}

export type ApiProviderId = 'mimo';
export type HttpErrorLinkStatusKey = 401 | 402 | '5xx';

export type MimoRequestErrorKind = 'http' | 'network' | 'unknown';
export type DeepSeekRequestErrorKind = MimoRequestErrorKind;

export type NetworkErrorCategory =
	| 'dns'
	| 'unreachable'
	| 'interrupted'
	| 'timeout'
	| 'tls'
	| 'aborted'
	| 'protocol'
	| 'configuration'
	| 'generic';
