import { Component, h, Prop, State, Element, Watch } from '@stencil/core';

@Component({
  tag: 'ews-infinite-scroll',
  styleUrl: 'ews-infinite-scroll.css',
  shadow: false, // Tetap false agar style luar masuk
})
export class EwsInfiniteScroll {
  @Element() el: HTMLElement;

  @Prop() gap: number = 24;
  @Prop() speed: number = 80;
  @Prop() direction: 'left' | 'right' = 'left';
  @Prop() pauseOnHover: boolean = false;
  @Prop() customClass: string = '';

  @State() paused: boolean = false;

  private containerEl: HTMLDivElement;
  private trackEl: HTMLDivElement;
  private contentEl: HTMLDivElement;
  private animFrame: number;
  private offset: number = 0;
  private singleWidth: number = 0;
  private lastTime: number | null = null;
  private resizeObserver: ResizeObserver;

  @Watch('gap')
  handleGapChange() {
    this.initialSetup();
  }

  componentDidLoad() {
    // Tunggu konten slot siap
    setTimeout(() => {
      this.initialSetup();
      this.startAnimation();
    }, 50);

    this.setupObservers();
  }

  disconnectedCallback() {
    this.stopAnimation();
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  private setupObservers() {
    this.resizeObserver = new ResizeObserver(() => {
      this.initialSetup();
    });
    this.resizeObserver.observe(this.containerEl);
  }

  private initialSetup() {
    if (!this.containerEl || !this.contentEl || !this.trackEl) return;

    // 1. Bersihkan klon lama jika ada (agar tidak double saat resize)
    const existingClones = this.trackEl.querySelectorAll('.ews-scroll-clone');
    existingClones.forEach(c => c.remove());

    // 2. Hitung lebar konten asli
    const rectW = this.contentEl.offsetWidth;
    if (rectW === 0) return;
    this.singleWidth = rectW + this.gap;

    // 3. Hitung berapa klon yang dibutuhkan agar layar penuh
    const containerW = this.containerEl.offsetWidth;
    const clonesNeeded = Math.ceil(containerW / this.singleWidth) + 1;

    // 4. Lakukan klon secara manual
    // Kita menggunakan .cloneNode(true) agar semua element & style ikut terbawa
    for (let i = 0; i < clonesNeeded; i++) {
      const clone = this.contentEl.cloneNode(true) as HTMLElement;
      clone.classList.add('ews-scroll-clone');
      clone.setAttribute('aria-hidden', 'true');
      this.trackEl.appendChild(clone);
    }
  }

  private startAnimation() {
    const tick = (ts: number) => {
      if (!this.paused) {
        if (this.lastTime !== null) {
          const dt = (ts - this.lastTime) / 1000;
          this.offset += this.speed * dt;

          if (this.offset >= this.singleWidth) {
            this.offset %= this.singleWidth;
          }
        }
        this.lastTime = ts;

        if (this.trackEl) {
          const sign = this.direction === 'right' ? 1 : -1;
          // Gunakan translate3d untuk akselerasi GPU agar tidak lag
          this.trackEl.style.transform = `translate3d(${sign * this.offset}px, 0, 0)`;
        }
      } else {
        this.lastTime = ts;
      }
      this.animFrame = requestAnimationFrame(tick);
    };
    this.animFrame = requestAnimationFrame(tick);
  }

  private stopAnimation() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }

  render() {
    return (
      <div
        class={`ews-infinite-scroll-container ${this.customClass}`.trim()}
        ref={el => this.containerEl = el}
        onMouseEnter={() => this.pauseOnHover && (this.paused = true)}
        onMouseLeave={() => this.pauseOnHover && (this.paused = false)}
        style={{
          overflow: 'hidden',
          width: '100%',
          display: 'block'
        }}
      >
        <div
          class="ews-infinite-scroll-track"
          ref={el => this.trackEl = el}
          style={{
            display: 'flex',
            gap: `${this.gap}px`,
            width: 'max-content',
            willChange: 'transform'
          }}
        >
          {/* Konten Sumber (Original) */}
          <div class="ews-scroll-set" ref={el => this.contentEl = el}>
            <slot />
          </div>

          {/* Klon akan dimasukkan ke sini via initialSetup() */}
        </div>
      </div>
    );
  }
}