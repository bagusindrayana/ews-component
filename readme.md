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
<ews-stripe-bar percent={75} status="active"></ews-stripe-bar>
```

## Documentation

For more detailed information on specific components, please refer to the documentation in each component's directory or the official [StencilJS documentation](https://stenciljs.com/docs/introduction).