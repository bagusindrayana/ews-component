import { Component, Host, h, Prop, State, Element, Watch } from '@stencil/core';

@Component({
  tag: 'ews-infinite-scroll',
  styleUrl: 'ews-infinite-scroll.css',
  shadow: true,
})
export class EwsInfiniteScroll {
  @Element() el: HTMLElement;

  /** Gap between items in pixels */
  @Prop() gap: number = 24;

  /** Scroll speed in pixels per second */
  @Prop() speed: number = 80;

  /** Scroll direction: 'left' or 'right' */
  @Prop() direction: 'left' | 'right' = 'left';

  /** Pause animation on hover */
  @Prop() pauseOnHover: boolean = false;

  /** Additional CSS classes for the container */
  @Prop() customClass: string = '';

  @State() cloneCount: number = 1;
  @State() paused: boolean = false;

  private containerEl: HTMLDivElement;
  private trackEl: HTMLDivElement;
  private animFrame: number;
  private offset: number = 0;
  private singleWidth: number = 0;
  private lastTime: number | null = null;
  private resizeObserver: ResizeObserver;
  private contentMutationObserver: MutationObserver;

  @Watch('gap')
  handleGapChange() {
    this.calcClones();
  }

  componentDidLoad() {
    this.setupClones();
    this.startAnimation();
    this.setupObservers();
  }

  disconnectedCallback() {
    this.stopAnimation();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.contentMutationObserver) {
      this.contentMutationObserver.disconnect();
    }
  }

  private setupClones() {
    this.calcClones();
    // Wait for a frame to ensure dimensions are stable
    requestAnimationFrame(() => {
      this.calcClones();
    });
  }

  private setupObservers() {
    this.resizeObserver = new ResizeObserver(() => {
      this.calcClones();
      this.offset = 0;
      this.lastTime = null;
    });
    this.resizeObserver.observe(this.containerEl);

    // Observe slot changes to update clones if content changes
    const slot = this.el.shadowRoot.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', () => {
        this.updateClonesContent();
        this.calcClones();
      });
    }
  }

  private updateClonesContent() {
    const slot = this.el.shadowRoot.querySelector('slot');
    if (!slot) return;

    const assignedNodes = slot.assignedNodes({ flatten: true });
    const cloneContainers = this.el.shadowRoot.querySelectorAll('.scroll-set-clone');
    
    cloneContainers.forEach(container => {
      container.innerHTML = '';
      assignedNodes.forEach(node => {
        container.appendChild(node.cloneNode(true));
      });
    });
  }

  private calcClones = () => {
    if (!this.containerEl || !this.trackEl) return;
    const containerW = this.containerEl.getBoundingClientRect().width;
    const firstSet = this.trackEl.querySelector('.scroll-set') as HTMLElement;
    if (!firstSet) return;

    const rect = firstSet.getBoundingClientRect();
    if (rect.width === 0) return;

    this.singleWidth = rect.width + this.gap;
    
    const needed = Math.ceil((containerW * 2) / this.singleWidth) + 1;
    const newCloneCount = Math.max(needed, 2);

    if (newCloneCount !== this.cloneCount) {
      this.cloneCount = newCloneCount;
    }
  }

  private startAnimation() {
    this.animFrame = requestAnimationFrame(this.tick);
  }

  private stopAnimation() {
    if (this.animFrame) {
      cancelAnimationFrame(this.animFrame);
    }
  }

  private tick = (ts: number) => {
    if (!this.paused) {
      if (this.lastTime !== null) {
        const dt = (ts - this.lastTime) / 1000;
        this.offset += this.speed * dt;
        if (this.singleWidth > 0 && this.offset >= this.singleWidth) {
          this.offset -= this.singleWidth;
        }
      }
      this.lastTime = ts;
    } else {
      this.lastTime = ts; // reset to avoid jump
    }

    if (this.trackEl) {
      const sign = this.direction === 'right' ? 1 : -1;
      this.trackEl.style.transform = `translateX(${sign * this.offset}px)`;
    }
    this.animFrame = requestAnimationFrame(this.tick);
  }

  private handleMouseEnter = () => {
    if (this.pauseOnHover) this.paused = true;
  }

  private handleMouseLeave = () => {
    if (this.pauseOnHover) this.paused = false;
  }

  componentDidRender() {
    // After render, we need to ensure clones have content if cloneCount changed
    this.updateClonesContent();
  }

  render() {
    const cloneSets = [];
    for (let i = 0; i < this.cloneCount; i++) {
      cloneSets.push(
        <div class="scroll-set scroll-set-clone" aria-hidden="true"></div>
      );
    }

    return (
      <Host>
        <div
          class={`infinite-scroll-container ${this.customClass}`}
          ref={el => this.containerEl = el}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          <div
            class="infinite-scroll-track"
            ref={el => this.trackEl = el}
            style={{ gap: `${this.gap}px` }}
          >
            {/* The original content slot */}
            <div class="scroll-set">
              <slot />
            </div>

            {/* The clones */}
            {cloneSets}
          </div>
        </div>
      </Host>
    );
  }
}
