# Tool List Drift

MiMo for Copilot Chat detected that the tool list in the current conversation may be unstable across turns.

This matters because the `tools` array is part of the request prefix. If the list changes frequently, context-cache hit rate can drop and prompt size can grow.

## What to do

1. Open VS Code's tool configuration and disable tools you rarely use.
2. Turn off `mimo-copilot.experimental.stabilizeToolList` if the preflight behavior is causing noise.
3. Prefer keeping the enabled tool set small and stable inside the same chat.
