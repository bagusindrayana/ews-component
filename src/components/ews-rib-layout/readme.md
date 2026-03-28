# ews-rib-layout



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute      | Description                                                                            | Type                                                                                                         | Default     |
| ------------------- | -------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------- |
| `connectorRenderer` | --             | Optional renderer function for the connector content.                                  | `(item: any, props: { side: "left" \| "right"; branchIndex: number; index: number; delay: number; }) => any` | `undefined` |
| `getHref`           | --             | Function to get the href for a node. If provided, nodes will be rendered as <a> tags.  | `(item: any) => string`                                                                                      | `undefined` |
| `items`             | --             | Array of items to be displayed in the rib cage layout.                                 | `any[]`                                                                                                      | `[]`        |
| `maxBranches`       | `max-branches` | Maximum number of branches to display. If not provided, it defaults to 5 (responsive). | `number`                                                                                                     | `undefined` |
| `nodeRenderer`      | --             | Optional renderer function for the node content.                                       | `(item: any, props: { side: "left" \| "right"; branchIndex: number; index: number; delay: number; }) => any` | `undefined` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
