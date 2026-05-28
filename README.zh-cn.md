# MiMo for Copilot Chat

把 `mimo-v2.5-pro` 和 `mimo-v2.5` 直接接入 Copilot Chat 模型选择器，同时保留 Copilot 的 Agent 模式、工具调用和现有交互体验。

## 功能说明

- 提供 `MiMo V2.5 Pro` 作为旗舰推理模型。
- 提供 `MiMo V2.5` 作为原生多模态模型，支持直接图片输入。
- 仅对纯文本 MiMo 模型保留视觉兜底代理，例如 `mimo-v2.5-pro`。
- 默认使用官方 OpenAI 兼容端点：`https://api.xiaomimimo.com/v1`。

## 模型选择建议

- `MiMo V2.5 Pro`：适合复杂编码、重构、长链推理和 Agent 任务。
- `MiMo V2.5`：适合需要原生多模态输入，同时保持较强通用编码能力的场景。

## 使用步骤

1. 打开命令面板。
2. 运行 `MiMo: 设置 API Key`。
3. 粘贴你的 MiMo API Key。
4. 打开 Copilot Chat，选择 `MiMo V2.5 Pro` 或 `MiMo V2.5`。
5. 在模型选择器中打开对应模型的配置下拉，可将思考强度切换为：
   - `None`：关闭思考，更快返回
   - `Low`：轻量思考，适合简单任务
   - `Medium`：默认强度，适合大多数任务
   - `High`：更深推理，适合复杂 Agent 与编码任务

## 主要设置

- `mimo-copilot.baseUrl`：覆盖 API 基址。
- `mimo-copilot.maxTokens`：限制最大输出 tokens。
- `mimo-copilot.modelIdOverrides`：为兼容网关重映射模型 ID。
- `mimo-copilot.visionModel`：纯文本 MiMo 模型使用的视觉兜底 Copilot 模型。
- `mimo-copilot.visionPrompt`：视觉兜底模型使用的图片描述提示词。
- `mimo-copilot.debugMode`：`minimal`、`metadata`、`verbose`。
- `mimo-copilot.experimental.stabilizeToolList`：实验性的工具预激活能力。

## 隔离说明

- 本扩展只使用自己的 `mimo-copilot.*` 配置。
- 本扩展只使用自己的 `mimo-copilot.apiKey` 密钥。
- 设计目标就是与已安装的 DeepSeek 扩展完全独立并存。
