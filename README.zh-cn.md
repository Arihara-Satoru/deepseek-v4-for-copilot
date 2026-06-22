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
5. 在模型选择器中打开对应模型的配置下拉，可将思考模式切换为：
   - `Off`：关闭思考，更快返回
   - `On`：开启思考，适合复杂推理、Agent 和编码任务

## 主要设置

- `mimo-copilot.baseUrl`：覆盖 API 基址。
- `mimo-copilot.maxTokens`：限制最大输出 tokens。
- `mimo-copilot.modelIdOverrides`：为兼容网关重映射模型 ID。
- `mimo-copilot.visionModel`：纯文本 MiMo 模型使用的视觉兜底 Copilot 模型。
- `mimo-copilot.visionPrompt`：视觉兜底模型使用的图片描述提示词。
- `mimo-copilot.debugMode`：`minimal`、`metadata`、`verbose`。
- `mimo-copilot.experimental.stabilizeToolList`：实验性的工具预激活能力。

## 隔离说明

## 隔离说明

- 本扩展只使用自己的 `mimo-copilot.*` 配置。
- 本扩展只使用自己的 `mimo-copilot.apiKey` 密钥。
- 设计目标就是与已安装的 DeepSeek 扩展完全独立并存。

此代理为兼容性桥接方案；如果 MiMo 后续支持原生视觉能力，本扩展将向更统一的视觉路径迁移。

<p align="center">
  <img src="resources/screenshots/03-vision.png" alt="将图片拖入 Copilot Chat，DeepSeek 通过视觉代理响应" width="800">
</p>

### 思考模式与推理深度控制
完整支持 DeepSeek V4 的 `reasoning_content`。通过 Copilot Chat 模型选择器的菜单选择 `停用`、`标准`（均衡，默认）或 `深度`（适用于复杂 Agent 任务）。

### 继承全部 Copilot 能力
由于本扩展接入的是 Copilot 的原生 provider API，你免费获得完整能力栈：
- **Agent 模式**——自主执行多步骤任务
- **工具调用**——文件编辑、终端操作、工作区搜索、Git、测试
- **Instructions & Skills**——你的 `.instructions.md`、`AGENTS.md` 和各项 Skills 开箱即用
- **Prompt 缓存统计**——在输出通道中记录 DeepSeek 缓存命中率，直观看到成本节省

<p align="center">
  <img src="resources/screenshots/04-agent.png" alt="DeepSeek V4 Pro 运行 Copilot 的 Agent 模式，执行工具调用" width="800">
</p>

### 安全优先
API Key 存储在 VS Code 的 `SecretStorage` 中（macOS 钥匙串 / Windows 凭据管理器 / Linux 密钥环）。绝不会出现在 `settings.json` 中，也不会被提交到 Git 历史。

### 零运行时依赖
纯 VS Code API + Node.js 内置模块。无需 Python、Docker 或本地代理进程。

## 快速开始

### 前置条件

- VS Code 1.116 及以上版本。本扩展依赖非公开的 Copilot Chat API，较新的 VS Code 版本可能存在兼容性问题——如遇到请[提交 Issue](https://github.com/Vizards/deepseek-v4-for-copilot/issues)。
- GitHub Copilot 订阅（Free / Pro / Enterprise——免费版即可使用）
- DeepSeek API Key，从 [platform.deepseek.com](https://platform.deepseek.com) 获取；使用自定义 `deepseek-copilot.baseUrl` 时也可使用兼容的 provider token

### 安装方式

根据你所使用的编辑器选择对应的注册表安装：

1. **Microsoft VS Code** — 从 [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Vizards.deepseek-v4-for-copilot) 安装。
2. **使用 Open VSX 的编辑器** — 从 [Open VSX](https://open-vsx.org/extension/Vizards/deepseek-v4-for-copilot) 安装。

### 使用步骤

1. 通过命令面板（`Cmd+Shift+P`）运行 **DeepSeek: 设置 API Key**
2. 粘贴你的 Key 或兼容的 provider token（官方 DeepSeek Key 通常以 `sk-` 开头）
3. 打开 Copilot Chat，点击模型选择器，选择 **DeepSeek V4 Pro** 或 **DeepSeek V4 Flash**
4. 搞定——开始聊天

## 模型

| 模型 | 适用场景 |
|---|---|
| **DeepSeek V4 Flash** | 日常快速编码、小改动、低成本迭代 |
| **DeepSeek V4 Pro** | 复杂重构、Agent 任务、深度推理 |

两者均支持可选的思考模式、工具调用和 1M Token 上下文。

## 设置项

| 设置项 | 默认值 | 说明 |
|---|---|---|
| `deepseek-copilot.baseUrl` | `https://api.deepseek.com` | API 端点——可改为自托管或代理部署地址 |
| `deepseek-copilot.maxTokens` | `0` | 最大输出 Token 数（`0` = 不限制）。可用于成本控制 |
| `deepseek-copilot.modelIdOverrides` | 预填官方 ID 映射 | DeepSeek V4 Flash / Pro 对应的 API 模型 ID。仅在使用模型名不同的兼容第三方 API 时修改 |
| `deepseek-copilot.debugMode` | `minimal` | 诊断模式：`minimal` 仅上报 token 用量，`metadata` 输出隐私安全日志，`verbose` 将完整请求 dump 和 pipeline snapshot 写入扩展 global storage。完整 dump 可能包含敏感提示词文本、工具定义、文件片段和图片描述。使用 `DeepSeek: 打开请求 Dump 目录` 打开 dump 位置 |
| `deepseek-copilot.visionModel` | *(自动)* | 用作图片代理的 VS Code 视觉模型。请通过 `DeepSeek: 配置视觉代理` 设置；新版保存为 `vendor/id`，旧版裸模型 ID 仍兼容读取 |
| `deepseek-copilot.visionPrompt` | *(内置)* | 用于描述图片附件的提示词 |
| `deepseek-copilot.experimental.stabilizeToolList` | `false` | 实验性设置。尝试预先激活 VS Code/Copilot 的虚拟工具，让传给 DeepSeek API 的 `tools` 参数在多轮对话中更完整、更稳定。当已启用工具跨轮次变化时，可能提高上下文缓存命中率。代价是 input tokens 可能增加；缓存命中的 input tokens 单价更低，但仍会计入用量。64 个或更少已启用工具时通常无需开启，除非工具列表仍在跨轮次变化；超过 128 个已启用工具时不建议开启 |

思考深度可通过 Copilot Chat 的模型选择器对每个 DeepSeek 模型单独设置。

兼容 API 代理的 `settings.json` 配置示例：

```json
{
  "deepseek-copilot.modelIdOverrides": {
    "deepseek-v4-flash": "your-flash-model-id",
    "deepseek-v4-pro": "your-pro-model-id"
  }
}
```

## 方案对比

| | 本扩展 | 本地代理（如 LiteLLM） | 独立 DeepSeek 扩展 |
|---|---|---|---|
| 在 Copilot Chat 内使用 | ✅ | ✅ | ❌ 独立界面 |
| Agent 模式、工具、Skills | ✅ | ✅ | ⚠️ 自行实现 |
| 视觉支持 | ✅ 代理模式 | ❌ | ❌ |
| 无需额外运行进程 | ✅ | ❌ | ✅ |
| 一键安装 | ✅ | ❌ | ✅ |
| API Key 存系统密钥链 | ✅ | ❌ | ⚠️ 各异 |

## 许可证

[MIT](LICENSE)
>>>>>>> origin/main
