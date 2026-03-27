import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'ews-hex-shape',
  styleUrl: 'ews-hex-shape.css',
  shadow: true,
})
export class EwsHexShape {
  /**
   * Additional CSS classes for the component.
   */
  @Prop() customClass: string = '';

  /**
   * The color variant of the hex shape.
   */
  @Prop() color: string = 'orange';

  /**
   * Whether the hex shape has a flat top.
   */
  @Prop() flatTop: boolean = true;

  /**
   * Whether to clip content within the hex shape.
   */
  @Prop() clipContent: boolean = false;

  /**
   * The padding inside the hex shape for content.
   */
  @Prop() paddingContent: number = 10;

  render() {
    const classes = {
      'ews-hex-shape': true,
      'flat-top': this.flatTop,
      'clip-content': this.clipContent,
      [this.color]: !!this.color,
      [this.customClass]: !!this.customClass,
    };

    return (
      <Host>
        <div class={classes}>
          <div
            class="inner-content"
            style={{ '--ews-hex-padding': `${this.paddingContent}px` }}
          >
            <slot />
          </div>
        </div>
      </Host>
    );
  }
}
