# ews-hex-grid



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute          | Description                                                                                                                                                                                                                    | Type                            | Default     |
| ---------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- | ----------- |
| `align`          | `align`            | Alignment of hex items within the container: 'left', 'center', or 'right'.                                                                                                                                                     | `"center" \| "left" \| "right"` | `'left'`    |
| `customClass`    | `custom-class`     | Additional CSS class for the container.                                                                                                                                                                                        | `string`                        | `''`        |
| `gap`            | `gap`              | Gap between hex cells in pixels.                                                                                                                                                                                               | `number`                        | `4`         |
| `hexHeight`      | `hex-height`       | Height of each hex cell in pixels.                                                                                                                                                                                             | `number`                        | `undefined` |
| `hexWidth`       | `hex-width`        | Width of each hex cell in pixels.                                                                                                                                                                                              | `number`                        | `undefined` |
| `revealDuration` | `reveal-duration`  | Duration for reveal animation in milliseconds.                                                                                                                                                                                 | `number`                        | `300`       |
| `revealMaxDelay` | `reveal-max-delay` | Maximum delay spread for reveal animation across items in milliseconds.                                                                                                                                                        | `number`                        | `800`       |
| `revealStagger`  | `reveal-stagger`   | Stagger multiplier per distance unit. If specified, overrides revealMaxDelay.                                                                                                                                                  | `number`                        | `undefined` |
| `revealVariant`  | `reveal-variant`   | Reveal animation variant pattern: 'diagonal', 'diagonal-top-left', 'diagonal-top-right', 'diagonal-bottom-left', 'diagonal-bottom-right', 'left', 'right', 'top', 'bottom', 'center' / 'tengah', 'random' / 'acak', or 'none'. | `string`                        | `'none'`    |
| `reverse`        | `reverse`          | If true, runs exit/reverse animation so items collapse in reverse order.                                                                                                                                                       | `boolean`                       | `false`     |
| `variant`        | `variant`          | Hex orientation variant: 'pointy' or 'flat'.                                                                                                                                                                                   | `"flat" \| "pointy"`            | `'pointy'`  |


## Methods

### `replay() => Promise<void>`

Alias for triggerReveal to replay current animation.

#### Returns

Type: `Promise<void>`



### `triggerReveal(variant?: string, reverse?: boolean) => Promise<void>`

Programmatically triggers/replays reveal animation with optional variant and reverse direction.

#### Parameters

| Name      | Type      | Description |
| --------- | --------- | ----------- |
| `variant` | `string`  |             |
| `reverse` | `boolean` |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
