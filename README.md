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

| Setting | Default | Description |
|---|---|---|
| `mimo-copilot.baseUrl` | `https://api.xiaomimimo.com/v1` | API endpoint — change for self-hosted / proxied deployments |
| `mimo-copilot.maxTokens` | `0` | Max output tokens (`0` = no limit). Useful for cost control |
| `mimo-copilot.modelIdOverrides` | prefilled official ID map | API model IDs to send for MiMo V2.5 / V2.5 Pro. Change only for compatible third-party APIs with different model names |
| `mimo-copilot.debugMode` | `minimal` | Diagnostic mode: `minimal` for token usage only, `metadata` for privacy-preserving logs, or `verbose` for full request dumps and pipeline snapshots under extension global storage. Full dumps may include sensitive prompt text, tool schemas, file snippets, and image descriptions. Use `MiMo: Open Request Dumps Folder` to open the dump location |
| `mimo-copilot.visionModel` | *(auto)* | VS Code vision model used to proxy images. Configure from `MiMo: Configure Vision Proxy`; new saves use `vendor/id`, while legacy bare model IDs are still read |
| `mimo-copilot.visionPrompt` | *(built-in)* | Prompt used to describe image attachments |
| `mimo-copilot.experimental.stabilizeToolList` | `false` | Experimental. Tries to pre-activate VS Code/Copilot virtual tools so the MiMo API `tools` parameter is more complete and stable across turns. May improve context-cache hit rate when enabled tools change between turns. Can increase input tokens because more function definitions may be included; cache-hit input tokens are cheaper but still count toward usage. Usually leave it off with 64 or fewer enabled tools unless the tool list still changes across turns; do not enable it with more than 128 enabled tools |

## Isolation notes

- This extension uses its own `mimo-copilot.*` settings only.
- This extension uses its own `mimo-copilot.apiKey` secret only.
- It is designed to coexist independently with any installed DeepSeek extension.
