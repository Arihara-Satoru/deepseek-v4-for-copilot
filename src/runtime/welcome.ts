import vscode from 'vscode';
import { WALKTHROUGH_ID, WELCOME_SHOWN_KEY } from '../consts';
import { MimoChatProvider } from '../provider';
import { t } from '../i18n';

interface WelcomeAction {
	label: string;
	run: () => Thenable<unknown> | Promise<unknown>;
}

export async function showWelcomeIfNeeded(
	context: vscode.ExtensionContext,
	provider: MimoChatProvider,
): Promise<void> {
	if (context.globalState.get<boolean>(WELCOME_SHOWN_KEY)) {
		return;
	}
	if (await provider.hasApiKey()) {
		await context.globalState.update(WELCOME_SHOWN_KEY, true);
		return;
	}

	await showWelcome();

	await context.globalState.update(WELCOME_SHOWN_KEY, true);
}

/**
 * 手动显示欢迎页，用于命令面板重新打开引导。
 */
export async function showWelcome(): Promise<void> {
	const actions = createWelcomeActions();
	const picked = await vscode.window.showInformationMessage(
		t('welcome.message'),
		...actions.map((action) => action.label),
	);

	const selected = actions.find((action) => action.label === picked);
	if (selected) {
		await selected.run();
		return;
	}

	await vscode.commands.executeCommand('workbench.action.openWalkthrough', WALKTHROUGH_ID, false);
}

/**
 * 构建首次欢迎动作列表。
 * 这里优先提供最常用的 API Key 配置入口，同时保留引导页和设置页。
 */
function createWelcomeActions(): WelcomeAction[] {
	return [
		{
			label: t('welcome.action.setApiKey'),
			run: () => vscode.commands.executeCommand('mimo-copilot.setApiKey'),
		},
		{
			label: t('welcome.action.openGuide'),
			run: () => vscode.commands.executeCommand('workbench.action.openWalkthrough', WALKTHROUGH_ID, false),
		},
		{
			label: t('welcome.action.openSettings'),
			run: () => vscode.commands.executeCommand('mimo-copilot.openSettings'),
		},
		{
			label: t('welcome.action.later'),
			run: async () => undefined,
		},
	];
}
