import { Component, Host, h, Prop, Element, Watch, State } from '@stencil/core';

@Component({
  tag: 'ews-hex-grid',
  styleUrl: 'ews-hex-grid.css',
  shadow: true,
})
export class EwsHexGrid {
  /**
   * Additional CSS class for the container.
   */
  @Prop() customClass: string = '';

  /**
   * Hex orientation variant: 'pointy' or 'flat'.
   */
  @Prop() variant: 'pointy' | 'flat' = 'pointy';

  /**
   * Width of each hex cell in pixels.
   */
  @Prop() hexWidth: number;

  /**
   * Height of each hex cell in pixels.
   */
  @Prop() hexHeight: number;

  /**
   * Gap between hex cells in pixels.
   */
  @Prop() gap: number = 4;

  @Element() el: HTMLElement;

  @State() containerHeight: string = 'auto';

  private ro: ResizeObserver;
  private mo: MutationObserver;

  componentDidLoad() {
    this.setupLayout();
  }

  disconnectedCallback() {
    if (this.ro) this.ro.disconnect();
    if (this.mo) this.mo.disconnect();
  }

  @Watch('variant')
  @Watch('hexWidth')
  @Watch('hexHeight')
  @Watch('gap')
  onPropChange() {
    this.layout();
  }

  private setupLayout() {
    // Delay initial layout to next tick to ensure styles are computed
    setTimeout(() => this.layout(), 0);

    this.ro = new ResizeObserver(() => this.layout());
    this.ro.observe(this.el);

    const slot = this.el.shadowRoot.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', () => this.layout());
    }

    this.mo = new MutationObserver(() => this.layout());
    this.mo.observe(this.el, { childList: true });
  }

  private layout() {
    const container = this.el.shadowRoot.querySelector('.ews-hex-honeycomb') as HTMLElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    if (!containerWidth) return;

    const slot = container.querySelector('slot') as HTMLSlotElement;
    if (!slot) return;

    const childElements = slot.assignedElements() as HTMLElement[];
    if (childElements.length === 0) return;

    const isFlat = this.variant === 'flat';
    const w = this.hexWidth ?? (isFlat ? 83 : 72);
    const h = this.hexHeight ?? (isFlat ? 72 : 83);
    const gap = this.gap;

    if (!isFlat) {
      // Pointy (Variant 1)
      const rowOffsetTop = gap + -20;
      const itemFullWidth = w + gap;

      let maxCols = Math.floor((containerWidth + gap) / itemFullWidth);
      if (maxCols < 1) maxCols = 1;

      let isOffset = false;
      let currentCol = 0;
      let currentRow = 0;

      for (let i = 0; i < childElements.length; i++) {
        const child = childElements[i];
        const colsInThisRow = isOffset ? Math.max(1, maxCols - 1) : maxCols;

        let x = currentCol * itemFullWidth;
        if (isOffset) {
          x += w / 2 + gap / 2;
        }

        const y = currentRow * (h + rowOffsetTop);

        child.style.position = 'absolute';
        child.style.left = `${x}px`;
        child.style.top = `${y}px`;
        child.style.margin = '0';
        child.style.width = `${w}px`;
        child.style.height = `${h}px`;

        currentCol++;
        if (currentCol >= colsInThisRow) {
          currentCol = 0;
          isOffset = !isOffset;
          currentRow++;
        }
      }

      let totalHeight = 0;
      if (currentCol > 0) {
        totalHeight = currentRow * (h + rowOffsetTop) + h;
      } else {
        totalHeight = (currentRow - 1) * (h + rowOffsetTop) + h;
      }
      this.containerHeight = `${totalHeight}px`;
    } else {
      // Flat (Variant 2)
      const colAdvanceX = w * 0.75 + gap;
      const rowAdvanceY = h + gap;

      let maxCols = Math.floor((containerWidth - w) / colAdvanceX) + 1;
      if (containerWidth < w) maxCols = 1;

      let currentCol = 0;
      let currentRow = 0;
      let maxBottom = 0;

      for (let i = 0; i < childElements.length; i++) {
        const child = childElements[i];

        let x = currentCol * colAdvanceX;
        let y = currentRow * rowAdvanceY;

        // Offset odd columns down
        if (currentCol % 2 === 1) {
          y += rowAdvanceY / 2;
        }

        child.style.position = 'absolute';
        child.style.left = `${x}px`;
        child.style.top = `${y}px`;
        child.style.margin = '0';
        child.style.width = `${w}px`;
        child.style.height = `${h}px`;

        const bottom = y + h;
        if (bottom > maxBottom) maxBottom = bottom;

        currentCol++;
        if (currentCol >= maxCols) {
          currentCol = 0;
          currentRow++;
        }
      }

      this.containerHeight = `${maxBottom}px`;
    }
  }

  render() {
    return (
      <Host>
        <div
          class={`ews-hex-honeycomb ${this.customClass}`.trim()}
          style={{ position: 'relative', display: 'block', height: this.containerHeight }}
        >
          <slot />
        </div>
      </Host>
    );
  }
}
