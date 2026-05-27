import vscode from 'vscode';
import { t } from '../i18n';
import { logger } from '../logger';
import { MimoChatProvider } from '../provider';
import { registerActionUrls } from './actions';
import { registerCommands } from './commands';
import { initializeDiagnostics } from './diagnostics';
import { registerProvider } from './provider';
import { showWelcomeIfNeeded } from './welcome';

let activeProvider: MimoChatProvider | undefined;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
	console.info('[mimo-for-copilot] activate:start');
	await initializeDiagnostics(context);
	registerCommands(context);
	registerActionUrls(context);

	try {
		const provider = await registerProvider(context);
		activeProvider = provider;

		void showWelcomeIfNeeded(context, provider).catch((error) => {
			logger.warn(t('extension.welcomeFailed'), error);
		});

		logger.info(`Extension activated version=${context.extension.packageJSON.version}`);
		console.info(
			`[mimo-for-copilot] activate:success version=${context.extension.packageJSON.version}`,
		);
	} catch (error) {
		activeProvider = undefined;
		logger.error('Failed to activate MiMo extension', error);
		console.error('[mimo-for-copilot] activate:failed', error);
		void vscode.window.showErrorMessage(t('extension.activateFailed'));
		throw error;
	}
}

export async function deactivate(): Promise<void> {
	console.info('[mimo-for-copilot] deactivate:start');
	try {
		await activeProvider?.prepareForDeactivate();
	} catch (error) {
		logger.warn(t('extension.deactivateFailed'), error);
		console.warn('[mimo-for-copilot] deactivate:warning', error);
	} finally {
		activeProvider = undefined;
		logger.info('Extension deactivated');
		console.info('[mimo-for-copilot] deactivate:done');
		logger.dispose();
	}
}
