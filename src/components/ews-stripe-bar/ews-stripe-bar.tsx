import { Component, Host, h, Prop } from '@stencil/core';
import { parseColor } from '../../utils/color';

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


  /**
   * Preset color ('red', 'orange') or custom HEX / RGB / RGBA code
   */
  @Prop() color: string = '';
  @Prop({ reflect: true }) orientation: string = '';
  @Prop() loop: boolean = false;
  @Prop() reverse: boolean = false;
  @Prop() duration: number = 10;
  @Prop() size: string = '30px';

  private getStripeClasses(preset?: string) {
    const loopStr = this.loop ? 'loop-stripe' : '';
    const orientationStr = this.orientation ? `-${this.orientation}` : '';
    const combinedStr = loopStr + orientationStr;

    return [
      'ews-stripe-bar',
      preset || '',
      this.orientation,
      combinedStr,
      this.reverse ? 'reverse' : '',
      `anim-duration-${this.duration}`
    ].filter(c => c.trim() !== '').join(' ');
  }

  render() {
    const isVertical = this.orientation === 'vertical';
    const colorInfo = parseColor(this.color);

    const stripeStyle: Record<string, string> = {};
    if (colorInfo.isCustom && colorInfo.color) {
      stripeStyle['--ews-stripe-color'] = colorInfo.color;
      if (colorInfo.glowColor) {
        stripeStyle['--ews-glow-color'] = colorInfo.glowColor;
      }
    }

    return (
      <Host>
        <div
          style={{
            overflow: 'hidden',
            width: isVertical ? (this.size || '30px') : '100%',
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
            <div class={this.getStripeClasses(colorInfo.preset)} style={stripeStyle}></div>
            {!isVertical && <div class={this.getStripeClasses(colorInfo.preset)} style={stripeStyle}></div>}
          </div>
          <slot></slot>
        </div>
      </Host>
    );
  }
}

