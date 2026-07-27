# SIMABSEN Guru SMAN 1 Menyuke

Aplikasi absensi guru berbasis web yang modern, cepat, responsif, dan siap di-host di Netlify 100% tanpa VPS atau backend framework lain.

## Teknologi
- React 19 + Vite + TypeScript
- TailwindCSS 
- Framer Motion
- React Router DOM
- TanStack Query
- Supabase (PostgreSQL, Auth, RLS)
- Sonner (Toast Notification)
- DayJS (Timezone Handling)

## Instalasi dan Setup

1. **Clone dan Install Dependensi**
   ```bash
   npm install
   ```

2. **Setup Supabase**
   - Buat project baru di Supabase
   - Pergi ke `SQL Editor` di Dashboard Supabase, dan jalankan seluruh query yang ada di dalam file `supabase_schema.sql`
   - Buat user Admin di menu `Authentication` -> `Users` untuk login ke halaman Dashboard.

3. **Konfigurasi Environment Variable**
   - Buat file `.env` di root folder (sejajar dengan package.json)
   - Isi dengan credential dari Supabase (`Project Settings` -> `API`)
   ```env
   VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   ```

4. **Jalankan Aplikasi**
   ```bash
   npm run dev
   ```

## Struktur Aplikasi
- **Guru**: Langsung masuk halaman utama untuk melakukan absensi dengan NIP (tanpa login).
- **Admin**: Login melalui `/admin/login` menggunakan email/password Auth Supabase.

## Deployment ke Netlify
1. Hubungkan repo ke Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Tambahkan Environment Variable `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` di Netlify.
5. Konfigurasi `netlify.toml` sudah disertakan untuk menangani routing SPA.
