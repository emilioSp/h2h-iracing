// Requires the dashboard mount element before a browser entrypoint starts React.
export function assertRootElement(value: HTMLElement | null): asserts value is HTMLElement {
  if (!value) throw new Error('No #root element');
}
