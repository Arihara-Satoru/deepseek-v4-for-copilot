import vscode from 'vscode';
import { logger } from '../logger';
import { MimoChatProvider } from '../provider';

export async function registerProvider(
	context: vscode.ExtensionContext,
): Promise<MimoChatProvider> {
	console.info('[mimo-for-copilot] registerProvider:start');
	const provider = new MimoChatProvider(context);

	context.subscriptions.push(
		vscode.commands.registerCommand('mimo-copilot.setApiKey', () => provider.configureApiKey()),
		vscode.commands.registerCommand('mimo-copilot.clearApiKey', () => provider.clearApiKey()),
		vscode.commands.registerCommand('mimo-copilot.setVisionModel', () =>
			provider.setVisionModel(),
		),
		vscode.lm.registerLanguageModelChatProvider('mimo', provider),
	);

	// Copilot Chat can serve cached model info without configurationSchema.
	// Activate it first so this refresh reaches a live listener and re-queries the provider.
	await activateCopilotChat();
	provider.refreshModelPicker();
	console.info('[mimo-for-copilot] registerProvider:done');

	return provider;
}

async function activateCopilotChat(): Promise<void> {
	try {
		await vscode.extensions.getExtension('github.copilot-chat')?.activate();
	} catch (error) {
		logger.warn('Copilot Chat activation unavailable; model picker refresh may be delayed', error);
	}
}
