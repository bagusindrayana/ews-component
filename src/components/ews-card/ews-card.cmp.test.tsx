import { render, h, describe, it, expect } from '@stencil/vitest';

describe('ews-card', () => {
  it('renders', async () => {
    const { root } = await render(<ews-card></ews-card>);
    await expect(root).toBeDefined();
    await expect(root.querySelector('.ews-card')).not.toBeNull();
  });
});
