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
    const isVertical = this.orientation === 'vertical';

    return (
      <Host style={isVertical ? { height: '100%' } : {}}>
        <div
          style={{
            overflow: 'hidden',
            width: '100%',
            height: isVertical ? '100%' : 'auto'
          }}
          class={`host-wrapper ${this.customClass}`}
        >
          <div
            class={`ews-stripe-wrapper ${this.orientation}`}
            style={{
              [isVertical ? 'width' : 'height']: this.size,
              ...(isVertical ? { height: '100%' } : {})
            }}
          >
            <div class={this.getStripeClasses()}></div>
            {!isVertical && <div class={this.getStripeClasses()}></div>}
          </div>
          <slot></slot>
        </div>
      </Host>
    );
  }
}

