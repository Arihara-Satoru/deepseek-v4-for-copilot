# MiMo for Copilot Chat

Use `mimo-v2.5-pro` and `mimo-v2.5` directly from the Copilot Chat model picker while keeping Copilot agent mode, tool calling, and UI intact.

## What this extension does

- Adds `MiMo V2.5 Pro` as a flagship reasoning model.
- Adds `MiMo V2.5` as a native multimodal model with direct image input.
- Keeps a fallback vision proxy only for text-only MiMo models such as `mimo-v2.5-pro`.
- Uses your own MiMo API key and the official OpenAI-compatible endpoint by default: `https://api.xiaomimimo.com/v1`.

## Models

- `MiMo V2.5 Pro`: best for complex coding, refactors, and long reasoning chains.
- `MiMo V2.5`: best when you want native multimodal input and strong general coding performance.

## Setup

1. Open the Command Palette.
2. Run `MiMo: Set API Key`.
3. Paste your MiMo API key.
4. Open Copilot Chat and pick `MiMo V2.5 Pro` or `MiMo V2.5`.
5. Open the selected model's configuration in the picker to choose a thinking mode:
   - `Off`: disable thinking for faster responses
   - `On`: enable thinking for reasoning-heavy coding and agent tasks

## Settings

- `mimo-copilot.baseUrl`: override the API base URL.
- `mimo-copilot.maxTokens`: cap output tokens.
- `mimo-copilot.modelIdOverrides`: remap model IDs for compatible gateways.
- `mimo-copilot.visionModel`: fallback Copilot vision model for text-only MiMo models.
- `mimo-copilot.visionPrompt`: prompt used by the fallback vision model.
- `mimo-copilot.debugMode`: `minimal`, `metadata`, or `verbose`.
- `mimo-copilot.experimental.stabilizeToolList`: experimental tool pre-activation.

## Isolation notes

- This extension uses its own `mimo-copilot.*` settings only.
- This extension uses its own `mimo-copilot.apiKey` secret only.
- It is designed to coexist independently with any installed DeepSeek extension.
