# EWS Component Library

> A collection of StencilJS web components for the EWS project.

This library contains reusable web components such as layout managers, charts, and UI elements designed for high-performance and framework-agnostic usage.

## Installation

To use `ews-component` in your project, install it via npm:

```bash
npm install ews-component
```

## Available Components

-   `ews-card`: A versatile card component for displaying content.
-   `ews-hex-grid`: A grid layout with hexagonal cells.
-   `ews-hex-shape`: Individual hexagonal shape component.
-   `ews-infinite-scroll`: A continuous, configurable scrolling ticker.
-   `ews-rib-layout`: A responsive "ribcage" layout for hierarchical data.
-   `ews-stripe-bar`: A striped status or progress bar.

## Local Development (StencilJS)

To start developing components locally, clone this repository and follow these steps:

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start development server**:
    ```bash
    npm start
    ```
    This will start a local dev server with hot-reloading.

3.  **Build for production**:
    ```bash
    npm run build
    ```

4.  **Run tests**:
    ```bash
    npm test
    ```

## Usage

### Framework Integration

Since these are standard Web Components, they work in any framework (React, Vue, Angular, Svelte) or with no framework at all.

### Usage Examples

Load the component bundle once in a plain HTML page, then use the custom elements:

```html
<script type="module" src="./node_modules/ews-component/dist/ews-component/ews-component.esm.js"></script>
```

#### `ews-card`

Use named slots for the header, content, and footer. Clicking the header toggles the card and emits a `toggle` event.

```html
<ews-card color="orange">
    <div slot="header">Weather alert</div>
    <div slot="content">Heavy rain expected in the northern district.</div>
    <div slot="footer">Updated just now</div>
</ews-card>

<script>
    document.querySelector('ews-card').addEventListener('toggle', () => {
        console.log('Card open state changed');
    });
</script>
```

#### `ews-hex-shape`

Set `flat-top="false"` for a pointy-top shape. `clip-content` clips slotted content to the hexagon.

```html
<ews-hex-shape color="red" flat-top="false" clip-content="true" padding-content="16"
    style="width: 160px;">
    <strong>CRITICAL</strong>
</ews-hex-shape>
```

Supported built-in colors are `orange` and `red`; other styling can be applied with CSS.

#### `ews-stripe-bar`

Use `orientation="vertical"` for a vertical bar. The supported animation durations are 5, 10, and 20 seconds.

```html
<ews-stripe-bar color="red" loop="true" reverse="true" duration="5" size="18px"
    style="width: 320px;"></ews-stripe-bar>

<ews-stripe-bar orientation="vertical" loop="true" style="height: 180px;"></ews-stripe-bar>
```

#### `ews-hex-grid`

Wrap each cell in `.ews-hex-hive`. The grid can be configured with attributes or controlled through its methods.

```html
<ews-hex-grid id="status-grid" variant="pointy" align="center" gap="6"
    reveal-variant="diagonal" reveal-duration="250">
    <div class="ews-hex-hive"><ews-hex-shape color="orange">01</ews-hex-shape></div>
    <div class="ews-hex-hive"><ews-hex-shape color="red">02</ews-hex-shape></div>
</ews-hex-grid>

<script>
    const grid = document.querySelector('#status-grid');
    grid.triggerReveal('center');
    // Other reveal patterns include left, right, top, bottom, random, and none.
</script>
```

#### `ews-rib-layout`

Assign `items` and callback properties in JavaScript. These function-valued properties cannot be set as HTML attributes.

```html
<ews-rib-layout id="network" max-branches="4"></ews-rib-layout>

<script>
    const layout = document.querySelector('#network');
    layout.items = [
        { id: 1, name: 'North station', status: 'normal' },
        { id: 2, name: 'River station', status: 'danger' }
    ];
    layout.getHref = item => `/stations/${item.id}`;
    layout.nodeRenderer = item => {
        const node = document.createElement('span');
        node.textContent = item.name;
        return node;
    };
    layout.connectorRenderer = item => item.status.toUpperCase();
</script>
```

#### `ews-infinite-scroll`

The slotted content is repeated to fill the track. `speed` is measured in pixels per second.

```html
<ews-infinite-scroll speed="45" gap="32" direction="right" pause-on-hover="true">
    <div style="display: flex; gap: 32px;">
        <span>SYSTEM ONLINE</span>
        <span>TELEMETRY CONNECTED</span>
        <span>ALL STATIONS NORMAL</span>
    </div>
</ews-infinite-scroll>
```

### Lazy Loading (Universal)

Include the loader script in your HTML:

```html
<script type="module" src="https://unpkg.com/ews-component/dist/ews-component/ews-component.esm.js"></script>
<ews-rib-layout max-branches="4">
  <!-- Your content here -->
</ews-rib-layout>
```

### Direct Import (React/Vite/NextJS)

```tsx
import { defineCustomElements } from 'ews-component/loader';

defineCustomElements();

// Use in your component
<ews-stripe-bar color="red" loop={true} duration={5}></ews-stripe-bar>
```

## Documentation

For more detailed information on specific components, please refer to the documentation in each component's directory or the official [StencilJS documentation](https://stenciljs.com/docs/introduction).


## Contributing & Adding New Components

To maintain consistency, please follow these steps when adding a new component:

1.  **Generate Component**:
    Use the Stencil CLI to scaffold your component:
    ```bash
    npm run generate
    ```
    *Input the name with `ews-` prefix (e.g., `ews-new-button`).*

2.  **Naming & Directory**:
    -   **Folder**: `src/components/ews-[name]/`
    -   **Tag Name**: `ews-[name]`
    -   **Class Name**: `Ews[Name]` (PascalCase)

3.  **Code Style Guidelines**:
    -   **TypeScript & TSX**: Always use TypeScript/TSX for component logic.
    -   **Styling**: Use a dedicated CSS file (`[name].css`). Prefix all classes with `ews-` (e.g., `.ews-card`) to avoid global style collisions.
    -   **Reactivity**: Use `@Prop()`, `@State()`, and `@Event()` decorators for state management and communication.
    -   **Documentation**: Write clear JSDoc comments for props and events; Stencil will automatically update the component's `readme.md`.


## Support Me!
[![Support me on Sociabuzz](https://img.shields.io/badge/Support%20Me-Sociabuzz-orange?style=for-the-badge&logo=buymeacoffee&logoColor=white)](https://sociabuzz.com/bagusindrayana/tribe)