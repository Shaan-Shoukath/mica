'use client';

import type { TElement } from 'platejs';

import { CopilotPlugin } from '@platejs/ai/react';
import { serializeMd, stripMarkdown } from '@platejs/markdown';

import { GhostText } from '@/components/ui/ghost-text';
import { streamCliChat } from '@/lib/cli-chat';

let chatCounter = 0;

function isAutoSuggestEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem('editor-auto-suggest');
  console.debug('[CopilotKit] isAutoSuggestEnabled', { stored });
  if (stored === null) return true;
  return stored === 'true';
}

export const CopilotKit = [
  CopilotPlugin.configure(({ api }) => ({
    options: {
      completeOptions: {
        api: '/api/ai/copilot',
        body: {
          system: `You are an advanced AI writing assistant, similar to VSCode Copilot but for general text. Your task is to predict and generate the next part of the text based on the given context.
  
  Rules:
  - Continue the text naturally up to the next punctuation mark (., ,, ;, :, ?, or !).
  - Maintain style and tone. Don't repeat given text.
  - For unclear context, provide the most likely continuation.
  - Handle code snippets, lists, or structured text if needed.
  - Don't include """ in your response.
  - CRITICAL: Always end with a punctuation mark.
  - CRITICAL: Avoid starting a new block. Do not use block formatting like >, #, 1., 2., -, etc. The suggestion should continue in the same block as the context.
  - If no context is provided or you can't generate a continuation, return "0" without explanation.`,
        },
        onError: (error) => {
          console.error('[CopilotKit] completion onError', error);
        },
        onCompleted: (completion) => {
          console.debug('[CopilotKit] onCompleted', { completion, completionType: typeof completion });
        },
        onFinish: (_, completion) => {
          console.debug('[CopilotKit] onFinish called', { completion, completionType: typeof completion, completionLength: completion?.length });
          if (!completion || completion === '0') {
            console.debug('[CopilotKit] onFinish early return', { reason: !completion ? 'empty' : 'zero' });
            return;
          }

          const text = stripMarkdown(completion);
          console.debug('[CopilotKit] setBlockSuggestion', { text, textLength: text?.length });
          api.copilot.setBlockSuggestion({
            text,
          });
        },
        onResponse: async (response) => {
          console.debug('[CopilotKit] onResponse', { status: response.status, ok: response.ok });
          try {
            const cloned = response.clone();
            const jsonBody = await cloned.json();
            console.debug('[CopilotKit] onResponse body', { textLength: jsonBody?.text?.length, text: jsonBody?.text?.slice(0, 100) });
          } catch {
            console.debug('[CopilotKit] onResponse body parse failed');
          }
        },
        fetch: (async (input, init) => {
          const parsedBody = init?.body ? JSON.parse(init.body as string) : {};
          const prompt = parsedBody.prompt as string | undefined;
          const system = parsedBody.system as string | undefined;

          console.debug('[CopilotKit] fetch called', {
            hasPrompt: !!prompt,
            hasSystem: !!system,
            promptLength: prompt?.length,
          });

          const messages: Array<{ role: string; content: string }> = [];
          if (system) messages.push({ role: 'system', content: system });
          messages.push({ role: 'user', content: prompt ?? '' });

          const chatId = `copilot-${Date.now()}-${++chatCounter}`;

          const res = await fetch(input, { ...init });

          console.debug('[CopilotKit] fetch response status', { status: res.status, ok: res.ok });

          if (!res.ok) {
            console.debug('[CopilotKit] API unavailable, falling back to CLI stream', { chatId });
            let accumulated = '';

            const completion = new Promise<void>((resolve, reject) => {
              const onChunk = (event: Event) => {
                const payload = (event as CustomEvent).payload;
                console.debug('[CopilotKit] cli-chat-chunk event', { delta: payload?.delta, done: payload?.done, error: payload?.error });
                if (payload.error) {
                  cleanup();
                  reject(new Error(payload.error));
                  return;
                }
                if (payload.delta) accumulated += payload.delta;
                if (payload.done) {
                  cleanup();
                  resolve();
                }
              };

              const cleanup = () => {
                window.removeEventListener(`cli-chat-chunk:${chatId}`, onChunk);
              };

              window.addEventListener(`cli-chat-chunk:${chatId}`, onChunk);
            });

            await Promise.all([
              streamCliChat({
                chatId,
                messages,
                onDelta: () => {},
                providerId: 'opencode',
              }),
              completion,
            ]);

            console.debug('[CopilotKit] CLI stream finished', {
              accumulatedLength: accumulated.length,
            });

            const stream = new ReadableStream({
              start(controller) {
                const encoder = new TextEncoder();
                controller.enqueue(encoder.encode(JSON.stringify({ text: accumulated })));
                controller.close();
              },
            });

            return new Response(stream, {
              headers: { 'Content-Type': 'application/json' },
            });
          }

          return res;
        }) as typeof fetch,
      },
      debounceDelay: 500,
      triggerQuery: ({ editor }) => {
        const enabled = isAutoSuggestEnabled();
        if (!enabled) {
          console.debug('[CopilotKit] triggerQuery blocked: disabled');
          return false;
        }

        const selection = editor.selection;
        if (!selection) return false;

        const isExpanded = editor.api.isExpanded();
        if (isExpanded) return false;

        const hasSuggestion = editor.getOption(CopilotPlugin, 'suggestionText');
        if (hasSuggestion) {
          console.debug('[CopilotKit] triggerQuery skipped: existing suggestion');
          return false;
        }

        return true;
      },
      renderGhostText: GhostText,
      getPrompt: ({ editor }) => {
        const contextEntry = editor.api.block({ highest: true });

        if (!contextEntry) {
          console.debug('[CopilotKit] getPrompt: no context entry');
          return '';
        }

        const prompt = serializeMd(editor, {
          value: [contextEntry[0] as TElement],
        });

        console.debug('[CopilotKit] getPrompt', { promptLength: prompt.length, prompt: prompt.slice(0, 100) });

        return `Continue the text up to the next punctuation mark:
  """
  ${prompt}
  """`;
      },
    },
    shortcuts: {
      accept: {
        keys: 'tab',
      },
      acceptNextWord: {
        keys: 'mod+right',
      },
      reject: {
        keys: 'escape',
      },
      triggerSuggestion: {
        keys: 'ctrl+space',
      },
    },
  })),
];
