# MASTER PROMPT – SIMABSEN GURU SMAN 1 MENYUKE (Production Ready)

## PERAN AI

Anda adalah seorang **Senior Full Stack Software Engineer**, **UI/UX Designer**, **System Analyst**, dan **Database Architect**.

Bangun aplikasi web **production-ready** bernama **SIMABSEN Guru SMAN 1 Menyuke**, yaitu sistem absensi guru berbasis web yang modern, cepat, responsif, aman, dan mudah digunakan.

Aplikasi ini **WAJIB** menggunakan teknologi yang dapat di-host **100% di Netlify** tanpa memerlukan VPS atau server Laravel.

Gunakan praktik terbaik dalam pengembangan aplikasi modern.

---

# TEKNOLOGI YANG WAJIB DIGUNAKAN

Frontend

* React 19
* Vite
* TailwindCSS
* shadcn/ui
* React Router DOM
* React Hook Form
* Zod Validation
* TanStack Query
* Lucide React
* Framer Motion

Backend

* Supabase

  * PostgreSQL
  * Authentication
  * Storage
  * Row Level Security
  * Realtime

Deployment

* Frontend → Netlify
* Backend → Supabase

Export

* ExcelJS
* jsPDF
* jspdf-autotable

Chart

* Recharts

Date

* dayjs

Notification

* Sonner Toast

Icons

* Lucide

Theme

* next-themes

---

# TUJUAN APLIKASI

Membuat sistem absensi guru yang mudah digunakan.

Guru hanya memasukkan NIP.

Sistem langsung:

* mencari data guru
* mencatat waktu
* menentukan terlambat atau tidak
* menyimpan ke database
* menampilkan notifikasi berhasil

Seluruh data dapat direkap menjadi laporan.

---

# ROLE

## Guru

Tidak perlu login.

Hanya memasukkan NIP.

## Admin

Login menggunakan email dan password Supabase.

---

# FLOW GURU

Saat membuka website.

Langsung tampil halaman absensi.

Di tengah layar terdapat Card besar.

Isi card:

Logo Sekolah

Judul

SIMABSEN GURU

SMAN 1 MENYUKE

Tanggal Hari Ini

Jam Digital Live

Input NIP

Placeholder

Masukkan NIP Guru

Tombol

Cari Data

---

Setelah NIP dimasukkan.

Sistem mencari data guru.

Jika ditemukan tampilkan Card.

Isi:

Foto Guru

Nama

NIP

Mata Pelajaran

Status

Aktif

Tombol besar

ABSEN SEKARANG

---

Saat tombol diklik.

Sistem otomatis menyimpan

Tanggal

Hari

Jam

Status Hadir

Status Terlambat

IP Address (opsional)

Browser (opsional)

Kemudian muncul popup.

---

## Popup Berhasil

Icon hijau

ABSENSI BERHASIL

Nama Guru

NIP

Tanggal

Jam

Status

Jika tepat waktu

"Tepat Waktu"

Jika terlambat

"Terlambat"

Popup otomatis hilang setelah 5 detik.

---

Jika NIP tidak ditemukan.

Popup merah.

"NIP Tidak Terdaftar"

---

# JAM MASUK

Jam Masuk

07.00 WIB

Batas Terlambat

07.15 WIB

Jika

Jam <= 07.15

Status

TEPAT WAKTU

Jika

Jam > 07.15

Status

TERLAMBAT

Semua dihitung otomatis menggunakan zona waktu Asia/Jakarta.

---

# ANTI DOUBLE ABSEN

Guru hanya boleh melakukan absensi datang.

1 kali.

Dalam satu hari.

Jika mencoba lagi.

Popup.

"Anda sudah melakukan absensi hari ini."

Tidak boleh tersimpan.

---

# LOGIN ADMIN

Gunakan Supabase Auth.

Field

Email

Password

Remember Me

Lupa Password

---

# DASHBOARD ADMIN

Sidebar kiri.

Menu

Dashboard

Guru

Absensi

Laporan

Import Guru

Pengaturan

Logout

---

Dashboard memiliki Card Statistik.

Total Guru

Guru Hadir Hari Ini

Guru Terlambat

Belum Hadir

Persentase Kehadiran

---

Grafik

Line Chart

Kehadiran Mingguan

Bar Chart

Bulanan

Pie Chart

Persentase Hadir

---

Recent Activity

10 Guru terakhir melakukan absensi.

---

# CRUD GURU

Halaman Data Guru.

Fitur

Tambah

Edit

Hapus

Detail

Cari

Filter

Pagination

Import Excel

Export Excel

---

Field

NIP

Nama

Jenis Kelamin

Alamat

Nomor HP

Email

Mata Pelajaran

Status

Foto

Tanggal Bergabung

---

Foto disimpan di Supabase Storage.

---

# IMPORT EXCEL

Admin dapat mengunggah file Excel.

Kolom

NIP

Nama

Mata Pelajaran

Nomor HP

Alamat

Email

Status

Jika ada NIP yang sama.

Update data.

Jika belum ada.

Tambah data.

---

# DATA ABSENSI

Tabel

No

Nama

NIP

Hari

Tanggal

Jam Masuk

Status

Keterangan

---

Filter

Nama

NIP

Tanggal

Bulan

Tahun

Status

---

Sorting

Ascending

Descending

---

Search realtime.

---

# LAPORAN

Admin dapat membuat laporan.

Per Hari

Per Minggu

Per Bulan

Per Semester

Per Tahun

---

Export

PDF

Excel

CSV

---

Laporan PDF

Header

Logo Sekolah

SMAN 1 MENYUKE

LAPORAN ABSENSI GURU

Alamat Sekolah

Periode

---

Isi

No

Nama

NIP

Tanggal

Jam

Status

Keterangan

---

Footer

Tanggal Cetak

Nama Kepala Sekolah

NIP Kepala Sekolah

Tanda Tangan

Nomor Halaman

---

# PENGATURAN

Admin dapat mengubah.

Nama Sekolah

Alamat

Logo

Jam Masuk

Jam Terlambat

Nama Kepala Sekolah

NIP Kepala Sekolah

Tanda Tangan Digital

Tema

Dark Mode

Light Mode

---

# DATABASE

## teachers

id

nip

nama

email

mata_pelajaran

jenis_kelamin

alamat

nomor_hp

foto

status

created_at

updated_at

---

## attendance

id

teacher_id

tanggal

hari

jam_masuk

status_hadir

status_keterlambatan

ip_address

browser

created_at

updated_at

---

## settings

id

school_name

school_logo

address

principal_name

principal_nip

signature

work_start

late_limit

theme

---

# VALIDASI

Gunakan Zod.

Semua field wajib divalidasi.

NIP unik.

Email valid.

Nomor HP valid.

Tidak boleh input kosong.

---

# UI

Gunakan desain premium.

Dominan

Putih

Biru

Abu muda

Gunakan

Rounded XL

Glass Effect

Soft Shadow

Hover Animation

Loading Skeleton

Empty State

Error State

Responsive

Dark Mode

Motion Animation

Smooth Transition

---

# RESPONSIVE

Desktop

Laptop

Tablet

Mobile

Semua halaman harus responsive.

---

# AKSES

Guru

Hanya halaman absensi.

Admin

Semua halaman.

---

# KEAMANAN

Gunakan Row Level Security Supabase.

Gunakan Environment Variable.

Jangan hardcode API Key.

Gunakan Protected Route.

Sanitasi input.

Validasi semua form.

---

# STRUKTUR FOLDER

```
src/

components/

pages/

layouts/

hooks/

services/

supabase/

utils/

lib/

types/

contexts/

assets/

styles/

```

---

# FITUR TAMBAHAN

✅ Live Digital Clock

✅ Live Date

✅ Search Realtime

✅ Pagination

✅ Import Excel

✅ Export Excel

✅ Export PDF

✅ Export CSV

✅ Upload Foto Guru

✅ Dashboard Statistik

✅ Pie Chart

✅ Line Chart

✅ Bar Chart

✅ Toast Notification

✅ Skeleton Loading

✅ Dark Mode

✅ Responsive

✅ Empty State

✅ Error State

✅ Loading Spinner

✅ Auto Refresh Dashboard

✅ Realtime Supabase

---

# FITUR MASA DEPAN

Buat struktur kode modular sehingga mudah menambahkan fitur berikut:

* QR Code Attendance
* GPS Location
* Geofencing Area Sekolah
* Face Recognition
* Selfie Saat Absen
* Absensi Pulang
* Scan RFID
* Fingerprint Integration
* WhatsApp Notification
* Telegram Notification
* Email Notification
* Rekap Semester
* Rekap Tahunan
* Multi Sekolah
* Multi Admin
* Multi Operator
* Audit Log
* Backup Database
* Restore Database
* API Mobile Android
* API Mobile iOS
* Progressive Web App (PWA)
* Offline Mode dengan sinkronisasi saat koneksi kembali tersedia.

---

# HASIL YANG DIHARAPKAN

Bangun aplikasi dengan kualitas **production-ready** yang memiliki kode bersih, komponen React yang reusable, arsitektur yang modular, performa tinggi, keamanan yang baik, dan pengalaman pengguna yang modern. Sertakan struktur database Supabase, migrasi SQL, konfigurasi autentikasi, integrasi penyimpanan file, dokumentasi instalasi, konfigurasi deployment ke Netlify, serta seluruh source code agar aplikasi dapat langsung dijalankan setelah hanya mengisi variabel environment Supabase (`VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`) tanpa memerlukan perubahan besar pada kode.
