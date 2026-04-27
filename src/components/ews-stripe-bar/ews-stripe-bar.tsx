import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'ews-stripe-bar',
  styleUrl: 'ews-stripe-bar.css',
  shadow: true,
})
export class EwsStripeBar {
  /**
     * Additional CSS classes to apply to the card wrapper
     */
  @Prop() customClass: string = '';


  @Prop() color: string = '';
  @Prop() orientation: string = '';
  @Prop() loop: boolean = false;
  @Prop() reverse: boolean = false;
  @Prop() duration: number = 10;
  @Prop() size: string = '30px';

  private getStripeClasses() {
    const loopStr = this.loop ? 'loop-stripe' : '';
    const orientationStr = this.orientation ? `-${this.orientation}` : '';
    const combinedStr = loopStr + orientationStr;

    return [
      'ews-stripe-bar',
      this.color,
      this.orientation,
      combinedStr,
      this.reverse ? 'reverse' : '',
      `anim-duration-${this.duration}`
    ].filter(c => c.trim() !== '').join(' ');
  }

  render() {
    return (
      <Host>
        <div style={{ overflow: 'hidden', height: '100%', width: '100%' }} class={`host-wrapper ${this.customClass}`}>
          <div
            class={`ews-stripe-wrapper ${this.orientation}`}
            style={{ [this.orientation === 'vertical' ? 'width' : 'height']: this.size }}
          >
            <div class={this.getStripeClasses()}></div>
            <div class={this.getStripeClasses()}></div>
          </div>
          <slot></slot>
        </div>
      </Host>
    );
  }
}
