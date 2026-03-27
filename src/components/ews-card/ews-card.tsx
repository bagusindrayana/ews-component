import { Component, Prop, State, Event, EventEmitter, Element, h } from '@stencil/core';

@Component({
  tag: 'ews-card',
  styleUrl: 'ews-card.css',
  shadow: false,
})
export class EwsCard {
  @Element() el: HTMLElement;

  /**
   * Additional CSS classes to apply to the card wrapper
   */
  @Prop() customClass: string = '';


  /**
   * Custom color for border and content (red or orange)
   */
  @Prop() color?: string;

  /**
   * Inline style
   */
  @Prop() customStyle?: string;

  /**
   * Tracks whether the card content is toggled open
   */
  @State() open: boolean = false;

  @State() hasHeader: boolean = false;
  @State() hasFooter: boolean = false;

  /**
   * Emitted when the card toggles open/close state
   */
  @Event() toggle: EventEmitter<void>;

  componentWillLoad() {
    this.checkSlots();
  }

  componentDidLoad() {
    this.checkSlots();
  }

  componentDidUpdate() {
    this.checkSlots();
  }

  private checkSlots() {
    if (!this.el) return;
    const headerSlot = !!this.el.querySelector('[slot="header"]');
    const footerSlot = !!this.el.querySelector('[slot="footer"]');

    if (this.hasHeader !== headerSlot) {
      this.hasHeader = headerSlot;
    }
    if (this.hasFooter !== footerSlot) {
      this.hasFooter = footerSlot;
    }
  }

  private handleToggle = () => {
    this.open = !this.open;
    this.toggle.emit();
  };

  render() {
    return (
      <div
        class={`ews-card ${this.customClass} ews-card-${this.color} ${this.open ? 'open' : ''}`.trim()}
        style={this.customStyle ? { style: this.customStyle } : {}}
      >
        {this.hasHeader && (
          <div
            class="ews-card-header"
            onClick={this.handleToggle}
          >
            <slot name="header" />
          </div>
        )}

        <div class="ews-card-content">
          <slot />
          <slot name="content" />
        </div>

        {this.hasFooter && (
          <div class="ews-card-footer">
            <slot name="footer" />
          </div>
        )}
      </div>
    );
  }
}
