import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('env config', () => {
  beforeEach(() => {
    // Limpiamos cualquier cache del módulo
    vi.resetModules();
  });

  it('isWeb3FormsConfigured returns false when key is empty string', async () => {
    process.env.PUBLIC_WEB3FORMS_KEY = '';
    const { isWeb3FormsConfigured } = await import('../../src/config/env');
    expect(isWeb3FormsConfigured()).toBe(false);
  });

  it('isWeb3FormsConfigured returns true when key is set', async () => {
    process.env.PUBLIC_WEB3FORMS_KEY = 'test-key-123';
    const { isWeb3FormsConfigured, getWeb3FormsKey } = await import('../../src/config/env');
    expect(isWeb3FormsConfigured()).toBe(true);
    expect(getWeb3FormsKey()).toBe('test-key-123');
  });

  it('getWeb3FormsKey returns undefined when unset', async () => {
    delete process.env.PUBLIC_WEB3FORMS_KEY;
    const { getWeb3FormsKey } = await import('../../src/config/env');
    expect(getWeb3FormsKey()).toBeUndefined();
  });
});
