export type Replies = Record<string, string>;

export interface ConsoleOptions {
  replies: Replies;
  /** Commands that navigate instead of (or after) printing a reply. */
  actions?: Record<string, () => void>;
}

/**
 * A tiny REPL-style easter egg. Each submitted command echoes as an input line
 * followed by its reply; `clear` removes the history.
 */
export function createConsole(form: HTMLFormElement, { replies, actions = {} }: ConsoleOptions): void {
  const input = form.querySelector('input');
  const log = form.parentElement?.querySelector<HTMLElement>('[data-console-log]');
  if (!input || !log) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const command = input.value.trim();
    input.value = '';
    if (!command) return;

    if (command === 'clear') {
      log.replaceChildren();
      return;
    }

    const line = document.createElement('div');
    line.className = 'console-in';
    line.textContent = command;

    const reply = document.createElement('div');
    reply.className = 'console-out';
    const known = Object.hasOwn(replies, command);
    reply.textContent = known ? replies[command] : `Uncaught ReferenceError: ${command} is not defined. Try "help".`;
    if (!known) reply.classList.add('is-error');

    log.append(line, reply);
    const action = Object.hasOwn(actions, command) ? actions[command] : undefined;
    if (typeof action === 'function') action();
  });
}
