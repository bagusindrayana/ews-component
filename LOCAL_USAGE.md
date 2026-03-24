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

## 3. Cara Penggunaan di Proyek Tujuan

### Registrasi Komponen (Svelte/Vite/JS)
Tambahkan loader di file entri utama (seperti `src/routes/+layout.svelte` atau `main.ts`):

```javascript
import { defineCustomElements } from 'ews-component/loader';

if (typeof window !== 'undefined') {
  defineCustomElements();
}
```

### Contoh Penggunaan HTML
```html
<!-- Kartu -->
<ews-card>
  <div slot="header">Judul Kartu</div>
  <p>Konten kartu di sini.</p>
</ews-card>

<!-- Hexagon Shape -->
<ews-hex-shape color="#3498db" size="120"></ews-hex-shape>
```

## Alternatif: Install Langsung
Jika tidak ingin menggunakan `link`, Anda bisa menginstall langsung dari path folder:
```bash
npm install ../path/to/ews-component
```
