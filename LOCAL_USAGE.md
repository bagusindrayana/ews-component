# Cara Menggunakan Komponen Secara Lokal

Ikuti langkah-langkah berikut untuk menggunakan `ews-card` dan `ews-hex-shape` di proyek lokal lain.

## 1. Build Library
Pastikan library sudah di-build di direktori ini (`ews-component`):
```bash
npm run build
```

## 2. Link Library (Development)
Gunakan `npm link` agar perubahan di library ini langsung terlihat di proyek tujuan.

**Di direktori ini (`ews-component`):**
```bash
npm link
```

**Di direktori proyek tujuan (misal: `ews-concept-new`):**
```bash
npm link ews-component
```

---

### Framework: Svelte / Vite / Vanilla JS
Tambahkan loader di file entri utama (seperti `src/routes/+layout.svelte` atau `main.ts`):

```javascript
import { defineCustomElements } from 'ews-component/loader';

if (typeof window !== 'undefined') {
  defineCustomElements();
}
```

### Framework: React
Untuk React, panggil `defineCustomElements()` di file entri utama (`index.js` atau `App.js`):

```tsx
import { useEffect } from 'react';
import { defineCustomElements } from 'ews-component/loader';

function App() {
  useEffect(() => {
    defineCustomElements();
  }, []);

  return (
    <div>
      <ews-card>
        <div slot="header">React Card</div>
        <p>Konten di React</p>
      </ews-card>
    </div>
  );
}
```

### Framework: Vue (Vite)
Untuk Vue 3 dengan Vite, cara paling stabil adalah mengimport komponen secara langsung (menghindari error "Constructor not found"):

1. Konfigurasi `vite.config.ts`:
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('ews-')
        }
      }
    })
  ]
})
```

2. Register komponen di `main.ts` atau di component yang membutuhkan:
```typescript
// Mengimport dan register secara eksplisit (lebih stabil untuk development/npm link)
import 'ews-component/components/ews-card';
import 'ews-component/components/ews-hex-shape';
```

Atau jika ingin loader otomatis (namun kadang terkendala `npm link`):
```typescript
import { defineCustomElements } from 'ews-component/loader';
defineCustomElements();
```

### Plain HTML (Tanpa Bundler)
Jika ingin menggunakan langsung di file HTML tanpa build tool:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EWS Component Demo</title>
  <!-- Load component bundle (sesuaikan path ke node_modules jika lokal) -->
  <script type="module" src="./node_modules/ews-component/dist/ews-component/ews-component.esm.js"></script>
</head>
<body>

  <ews-card>
    <div slot="header">Vanilla HTML</div>
    <p>Berjalan langsung di browser.</p>
  </ews-card>

  <ews-hex-shape color="#3498db" size="120"></ews-hex-shape>

</body>
</html>
```

## Alternatif: Install Langsung
Jika tidak ingin menggunakan `link`, Anda bisa menginstall langsung dari path folder:
```bash
npm install ../path/to/ews-component
```
