import { Component, Host, h, Prop, State, Listen } from '@stencil/core';

@Component({
  tag: 'ews-rib-layout',
  styleUrl: 'ews-rib-layout.css',
  shadow: true,
})
export class EwsRibLayout {
  /**
   * Array of items to be displayed in the rib cage layout.
   */
  @Prop() items: any[] = [];

  /**
   * Function to get the href for a node. If provided, nodes will be rendered as <a> tags.
   */
  @Prop() getHref?: (item: any) => string;

  /**
   * Optional renderer function for the node content.
   */
  @Prop() nodeRenderer?: (item: any, props: { side: 'left' | 'right'; branchIndex: number; index: number; delay: number }) => any;

  /**
   * Optional renderer function for the connector content.
   */
  @Prop() connectorRenderer?: (item: any, props: { side: 'left' | 'right'; branchIndex: number; index: number; delay: number }) => any;

  /**
   * Maximum number of branches to display. If not provided, it defaults to 5 (responsive).
   */
  @Prop() maxBranches?: number;

  @State() branchCount: number = 5;
  @State() windowWidth: number = 0;

  componentWillLoad() {
    this.handleResize();
  }

  @Listen('resize', { target: 'window' })
  handleResize() {
    this.windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
    this.branchCount = this.getBranchCount(this.windowWidth);
  }

  private getBranchCount(width: number): number {
    let count = 5;
    if (width < 768) count = 1;
    else if (width < 1024) count = 2;
    else if (width < 1300) count = 4;
    
    if (this.maxBranches && this.maxBranches > 0) {
      return Math.min(count, this.maxBranches);
    }
    return count;
  }

  private get chunkedItems() {
    if (!this.items || this.items.length === 0) return [];
    const count = Math.max(1, this.branchCount);
    const result = [];
    const itemsPerBranch = Math.ceil(this.items.length / count);

    for (let i = 0; i < this.items.length; i += itemsPerBranch) {
      result.push(this.items.slice(i, i + itemsPerBranch));
    }
    return result;
  }

  private renderNodeContent(item: any, props: { side: 'left' | 'right'; branchIndex: number; index: number; delay: number }) {
    if (this.nodeRenderer) {
      const content = this.nodeRenderer(item, props);
      
      // Handle HTMLElement return (common in plain JS)
      if (content instanceof HTMLElement) {
        return <div class="node-content-wrapper" ref={el => {
          if (el) {
            el.innerHTML = '';
            el.appendChild(content);
          }
        }}></div>;
      }
      
      // Handle string return (simple HTML)
      if (typeof content === 'string') {
        return <div class="node-content-wrapper" innerHTML={content}></div>;
      }

      return content;
    }

    // Default rendering if no renderer is provided
    const isDanger = item.type === 'danger';
    return (
      <div class={`ews-rib-node ${props.side === 'right' ? 'flip' : ''} ${isDanger ? 'danger' : ''}`}>
        <span>{item.label || item.name || item.value || 'Node'}</span>
      </div>
    );
  }

  private renderConnectorContent(item: any, props: { side: 'left' | 'right'; branchIndex: number; index: number; delay: number }) {
    if (this.connectorRenderer) {
      const content = this.connectorRenderer(item, props);
      
      const renderWrapper = (inner) => (
        <div class={`ews-rib-layout__connector-text ews-rib-layout__connector-text--${props.side} fade-in animation-delay-5`}>
          {inner}
        </div>
      );

      if (content instanceof HTMLElement) {
        return renderWrapper(<div ref={el => {
          if (el) {
            el.innerHTML = '';
            el.appendChild(content);
          }
        }}></div>);
      }

      if (typeof content === 'string') {
        return renderWrapper(<div innerHTML={content}></div>);
      }

      return renderWrapper(content);
    }
    return null;
  }

  render() {
    const chunked = this.chunkedItems;

    return (
      <Host>
        <div class="ews-rib-layout">
          {chunked.map((branchItems, branchIndex) => (
            <div class="ews-rib-layout__branch" key={branchIndex}>
              {/* Central Spine */}
              <div
                class="ews-rib-layout__spine line-central"
                style={{ animationDelay: `${branchIndex * 200}ms` }}
              ></div>

              <div class="ews-rib-layout__grid">
                {branchItems.map((item, index) => {
                  const side = index % 2 === 0 ? 'left' : 'right';
                  const delay = (branchIndex + 1) * (index + 1) * 10;
                  const href = this.getHref?.(item);
                  const Tag = href ? 'a' : 'div';

                  return (
                    <Tag
                      href={href}
                      class={`ews-rib-layout__node ${side === 'left' ? 'ews-rib-layout__node--left node' : 'ews-rib-layout__node--right node-flip'}`}
                      key={index}
                    >
                      {side === 'left' ? (
                        [
                          <div class="ews-rib-layout__node-content parent-node">
                            {this.renderNodeContent(item, { side, branchIndex, index, delay })}
                          </div>,
                          <div class="ews-rib-layout__connector-wrapper ews-rib-layout__connector-wrapper--left line">
                            <div class="ews-rib-layout__connector-line line-node" style={{ animationDelay: `${delay}ms` }}></div>
                            {this.renderConnectorContent(item, { side, branchIndex, index, delay })}
                          </div>,
                        ]
                      ) : (
                        [
                          <div class="ews-rib-layout__connector-wrapper ews-rib-layout__connector-wrapper--right">
                            <div class="ews-rib-layout__connector-line line-node" style={{ animationDelay: `${delay}ms` }}></div>
                            {this.renderConnectorContent(item, { side, branchIndex, index, delay })}
                          </div>,
                          <div class="parent-node flip ews-rib-layout__node-content ews-rib-layout__node-content--right">
                            {this.renderNodeContent(item, { side, branchIndex, index, delay })}
                          </div>,
                        ]
                      )}
                    </Tag>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Host>
    );
  }
}
