// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createConsole } from '../src/scripts/console';

function setup(actions = {}) {
  document.body.innerHTML = `
    <div>
      <div data-console-log><div class="console-in">intro</div></div>
      <form><input /></form>
    </div>`;
  const form = document.querySelector('form')!;
  const input = form.querySelector('input')!;
  const log = document.querySelector<HTMLElement>('[data-console-log]')!;
  createConsole(form, { replies: { help: 'commands…', 'hire()': 'opening mail' }, actions });
  const run = (command: string) => {
    input.value = command;
    form.dispatchEvent(new Event('submit', { cancelable: true }));
  };
  const lines = () => [...log.children].map((el) => el.textContent);
  return { run, lines, input };
}

describe('console easter egg', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('echoes the command and prints its reply', () => {
    const { run, lines, input } = setup();
    run('  help ');
    expect(lines()).toEqual(['intro', 'help', 'commands…']);
    expect(input.value).toBe('');
  });

  it('reports unknown commands as errors', () => {
    const { run, lines } = setup();
    run('sudo');
    expect(lines().at(-1)).toContain('sudo is not defined');
  });

  it('ignores empty input and clears history on "clear"', () => {
    const { run, lines } = setup();
    run('   ');
    expect(lines()).toEqual(['intro']);
    run('clear');
    expect(lines()).toEqual([]);
  });

  it('runs the action bound to a command', () => {
    const hire = vi.fn();
    const { run } = setup({ 'hire()': hire });
    run('hire()');
    expect(hire).toHaveBeenCalledOnce();
  });
});
