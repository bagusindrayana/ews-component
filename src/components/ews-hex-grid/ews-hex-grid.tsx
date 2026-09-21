import { Component, Host, h, Prop, Element, Watch, State, Method } from '@stencil/core';

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
  @Prop({ mutable: true }) variant: 'pointy' | 'flat' = 'pointy';

  /**
   * Alignment of hex items within the container: 'left', 'center', or 'right'.
   */
  @Prop({ mutable: true }) align: 'left' | 'center' | 'right' = 'left';

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

  /**
   * Reveal animation variant pattern: 'diagonal', 'diagonal-top-left', 'diagonal-top-right',
   * 'diagonal-bottom-left', 'diagonal-bottom-right', 'left', 'right', 'top', 'bottom',
   * 'center' / 'tengah', 'random' / 'acak', or 'none'.
   */
  @Prop({ mutable: true }) revealVariant: string = 'none';

  /**
   * Duration for reveal animation in milliseconds.
   */
  @Prop() revealDuration: number = 300;

  /**
   * Maximum delay spread for reveal animation across items in milliseconds.
   */
  @Prop() revealMaxDelay: number = 800;

  /**
   * Stagger multiplier per distance unit. If specified, overrides revealMaxDelay.
   */
  @Prop() revealStagger?: number;

  /**
   * If true, runs exit/reverse animation so items collapse in reverse order.
   */
  @Prop({ mutable: true }) reverse: boolean = false;

  @Element() el: HTMLElement;

  @State() containerHeight: string = 'auto';

  private ro: ResizeObserver;
  private mo: MutationObserver;
  private lastVariant?: string;
  private lastReverse?: boolean;

  /**
   * Programmatically triggers/replays reveal animation with optional variant and reverse direction.
   */
  @Method()
  async triggerReveal(variant?: string, reverse?: boolean) {
    if (variant !== undefined) this.revealVariant = variant;
    if (reverse !== undefined) this.reverse = reverse;
    this.layout(true);
  }

  /**
   * Alias for triggerReveal to replay current animation.
   */
  @Method()
  async replay() {
    this.layout(true);
  }

  componentDidLoad() {
    this.injectKeyframesIfNeeded();
    this.setupLayout();
  }

  disconnectedCallback() {
    if (this.ro) this.ro.disconnect();
    if (this.mo) this.mo.disconnect();
  }

  @Watch('variant')
  @Watch('align')
  @Watch('hexWidth')
  @Watch('hexHeight')
  @Watch('gap')
  onLayoutPropChange() {
    this.layout(false);
  }

  @Watch('revealVariant')
  @Watch('revealDuration')
  @Watch('revealMaxDelay')
  @Watch('revealStagger')
  @Watch('reverse')
  onAnimationPropChange() {
    this.layout(true);
  }

  private injectKeyframesIfNeeded() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('ews-hex-reveal-keyframes')) return;

    const styleEl = document.createElement('style');
    styleEl.id = 'ews-hex-reveal-keyframes';
    styleEl.textContent = `
      @keyframes showPopUp {
        0% {
          opacity: 0;
          transform: scale(0.5);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
      @keyframes closePopUp {
        0% {
          opacity: 1;
          transform: scale(1);
        }
        100% {
          opacity: 0;
          transform: scale(0.5);
        }
      }
      .ews-hex-reveal-in {
        opacity: 0;
        animation: showPopUp var(--hex-reveal-duration, 0.3s) cubic-bezier(0.34, 1.56, 0.64, 1) both !important;
        animation-delay: var(--hex-reveal-delay, 0ms) !important;
      }
      .ews-hex-reveal-out {
        opacity: 1;
        animation: closePopUp var(--hex-reveal-duration, 0.3s) cubic-bezier(0.25, 1, 0.5, 1) both !important;
        animation-delay: var(--hex-reveal-delay, 0ms) !important;
      }
    `;
    document.head.appendChild(styleEl);
  }

  private setupLayout() {
    // Delay initial layout to next tick to ensure styles are computed
    setTimeout(() => this.layout(true), 0);

    this.ro = new ResizeObserver(() => this.layout(false));
    this.ro.observe(this.el);

    const slot = this.el.shadowRoot?.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', () => this.layout(false));
    }

    this.mo = new MutationObserver(() => this.layout(false));
    this.mo.observe(this.el, { childList: true });
  }

  private layout(forceReplay = false) {
    const container = this.el.shadowRoot?.querySelector('.ews-hex-honeycomb') as HTMLElement;
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

    const childPositions: { child: HTMLElement; x: number; y: number }[] = [];

    if (!isFlat) {
      // Pointy (Variant 1)
      const rowOffsetTop = gap - 20;
      const itemFullWidth = w + gap;
      const halfOffset = w / 2 + gap / 2;

      let maxCols = Math.floor((containerWidth + gap) / itemFullWidth);
      if (maxCols < 1) maxCols = 1;

      // Group into rows based on alternating capacity
      interface HexRow {
        items: HTMLElement[];
        isOffset: boolean;
        capacity: number;
      }

      const rows: HexRow[] = [];
      let isOffset = false;
      let itemIdx = 0;

      while (itemIdx < childElements.length) {
        const capacity = isOffset ? Math.max(1, maxCols - 1) : maxCols;
        const rowSlice = childElements.slice(itemIdx, itemIdx + capacity);
        rows.push({
          items: rowSlice,
          isOffset,
          capacity,
        });
        itemIdx += rowSlice.length;
        isOffset = !isOffset;
      }

      let totalHeight = 0;

      for (let r = 0; r < rows.length; r++) {
        const row = rows[r];
        const count = row.items.length;
        if (count === 0) continue;

        const y = r * (h + rowOffsetTop);
        const actualRowWidth = (count - 1) * itemFullWidth + w;

        let startX = 0;

        if (this.align === 'center') {
          // Centered around container center
          startX = Math.max(0, (containerWidth - actualRowWidth) / 2);
        } else if (this.align === 'right') {
          // Right aligned: offset row indents by halfOffset from the right
          const rightIndent = row.isOffset ? halfOffset : 0;
          startX = Math.max(0, containerWidth - rightIndent - actualRowWidth);
        } else {
          // Left aligned: offset row indents by halfOffset from the left
          const leftIndent = row.isOffset ? halfOffset : 0;
          startX = leftIndent;
        }

        for (let c = 0; c < count; c++) {
          const child = row.items[c];
          const x = startX + c * itemFullWidth;

          child.style.position = 'absolute';
          child.style.left = `${x}px`;
          child.style.top = `${y}px`;
          child.style.margin = '0';
          child.style.width = `${w}px`;
          child.style.height = `${h}px`;

          childPositions.push({ child, x, y });
        }

        totalHeight = y + h;
      }

      this.containerHeight = `${totalHeight}px`;
    } else {
      // Flat (Variant 2)
      const colAdvanceX = w * 0.75 + gap;
      const rowAdvanceY = h + gap;

      let maxCols = Math.floor((containerWidth - w) / colAdvanceX) + 1;
      if (containerWidth < w) maxCols = 1;

      // Group into rows of maxCols
      const rows: HTMLElement[][] = [];
      let itemIdx = 0;
      while (itemIdx < childElements.length) {
        const rowSlice = childElements.slice(itemIdx, itemIdx + maxCols);
        rows.push(rowSlice);
        itemIdx += rowSlice.length;
      }

      let maxBottom = 0;

      for (let r = 0; r < rows.length; r++) {
        const rowItems = rows[r];
        const count = rowItems.length;
        if (count === 0) continue;

        const actualRowWidth = (count - 1) * colAdvanceX + w;

        let startX = 0;
        if (this.align === 'center') {
          startX = Math.max(0, (containerWidth - actualRowWidth) / 2);
        } else if (this.align === 'right') {
          startX = Math.max(0, containerWidth - actualRowWidth);
        } else {
          startX = 0;
        }

        for (let c = 0; c < count; c++) {
          const child = rowItems[c];
          const x = startX + c * colAdvanceX;
          let y = r * rowAdvanceY;

          // Offset odd columns down
          if (c % 2 === 1) {
            y += rowAdvanceY / 2;
          }

          child.style.position = 'absolute';
          child.style.left = `${x}px`;
          child.style.top = `${y}px`;
          child.style.margin = '0';
          child.style.width = `${w}px`;
          child.style.height = `${h}px`;

          childPositions.push({ child, x, y });

          const bottom = y + h;
          if (bottom > maxBottom) maxBottom = bottom;
        }
      }

      this.containerHeight = `${maxBottom}px`;
    }


    this.applyRevealAnimations(childPositions, forceReplay);
  }

  private applyRevealAnimations(childPositions: { child: HTMLElement; x: number; y: number }[], forceReplay = false) {
    const variantType = this.revealVariant?.toLowerCase().trim();
    if (!variantType || variantType === 'none') {
      for (const { child } of childPositions) {
        child.classList.remove('ews-hex-reveal-in', 'ews-hex-reveal-out');
        child.style.removeProperty('--hex-reveal-delay');
        child.style.removeProperty('--hex-reveal-duration');
        child.style.removeProperty('animation');
      }
      this.lastVariant = undefined;
      this.lastReverse = undefined;
      return;
    }

    const isStateChanged = variantType !== this.lastVariant || this.reverse !== this.lastReverse;
    this.lastVariant = variantType;
    this.lastReverse = this.reverse;

    const minX = Math.min(...childPositions.map(p => p.x));
    const maxX = Math.max(...childPositions.map(p => p.x));
    const minY = Math.min(...childPositions.map(p => p.y));
    const maxY = Math.max(...childPositions.map(p => p.y));
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const getDistance = (x: number, y: number, index: number): number => {
      switch (variantType) {
        // Diagonal Top-Left (default diagonal)
        case 'diagonal':
        case 'diagonal-top-left':
        case 'diagonal-tl':
        case 'top-left':
        case 'kiri-atas':
        case 'atas-kiri':
        case 'diagonal-kiri-atas':
          return (x - minX) + (y - minY);

        // Diagonal Top-Right
        case 'diagonal-top-right':
        case 'diagonal-tr':
        case 'top-right':
        case 'kanan-atas':
        case 'atas-kanan':
        case 'diagonal-kanan-atas':
          return (maxX - x) + (y - minY);

        // Diagonal Bottom-Left
        case 'diagonal-bottom-left':
        case 'diagonal-bl':
        case 'bottom-left':
        case 'kiri-bawah':
        case 'bawah-kiri':
        case 'diagonal-kiri-bawah':
          return (x - minX) + (maxY - y);

        // Diagonal Bottom-Right
        case 'diagonal-bottom-right':
        case 'diagonal-br':
        case 'bottom-right':
        case 'kanan-bawah':
        case 'bawah-kanan':
        case 'diagonal-kanan-bawah':
          return (maxX - x) + (maxY - y);

        // Center / Tengah / Radial
        case 'center':
        case 'centre':
        case 'tengah':
        case 'radial':
          return Math.hypot(x - centerX, y - centerY);

        // Directional
        case 'left':
        case 'kiri':
          return x - minX;

        case 'right':
        case 'kanan':
          return maxX - x;

        case 'top':
        case 'atas':
          return y - minY;

        case 'bottom':
        case 'bawah':
          return maxY - y;

        // Random / Acak (Deterministic pseudo-random based on index to prevent flicker on resize)
        case 'random':
        case 'acak':
          return Math.abs(Math.sin((index + 1) * 9301 + 49297) * 233280) % 1;

        default:
          return (x - minX) + (y - minY);
      }
    };

    const distances = childPositions.map((p, i) => getDistance(p.x, p.y, i));
    const dMin = Math.min(...distances);
    const dMax = Math.max(...distances);
    const dSpan = dMax - dMin || 1;

    const maxDelay = this.revealStagger
      ? dSpan * this.revealStagger
      : (this.revealMaxDelay ?? 800);

    const targetClass = this.reverse ? 'ews-hex-reveal-out' : 'ews-hex-reveal-in';

    for (let i = 0; i < childPositions.length; i++) {
      const { child } = childPositions[i];
      const isAlreadyInTargetState = child.classList.contains(targetClass);

      if (!forceReplay && !isStateChanged && isAlreadyInTargetState) {
        continue;
      }

      let norm = (distances[i] - dMin) / dSpan;

      if (this.reverse) {
        norm = 1 - norm;
      }

      const delay = Math.round(norm * maxDelay);

      child.style.setProperty('--hex-reveal-delay', `${delay}ms`);
      child.style.setProperty('--hex-reveal-duration', `${this.revealDuration ?? 300}ms`);

      child.classList.remove('opacity-0', 'show-pop-up', 'close-pop-up');
      if (child.style.animationDelay) {
        child.style.animationDelay = '';
      }

      child.style.animation = 'none';
      child.classList.remove('ews-hex-reveal-in', 'ews-hex-reveal-out');
      void child.offsetWidth;
      child.style.animation = '';
      child.classList.add(targetClass);
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
