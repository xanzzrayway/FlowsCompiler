# Flows Compiler — Tutorial Lengkap

Website ini **beneran** meng-compile link atau file HTML/Zip jadi APK Android asli,
lewat GitHub Actions. Frontend-nya di-host gratis di Cloudflare Pages.

## Arsitektur (cara kerjanya)

```
Browser (index.html)
   │  1. Isi form, klik "Build Aplikasi"
   ▼
Cloudflare Pages Function  (/api/build)
   │  2. Commit file html/zip/icon ke repo GitHub (kalau ada)
   │  3. Trigger workflow_dispatch di GitHub Actions
   ▼
GitHub Actions (.github/workflows/build-apk.yml)
   │  4. Setup JDK + Android SDK + Gradle
   │  5. Terapkan nama app, package, versi, ikon, permission
   │  6. gradle assembleRelease  -> hasil: app-release.apk
   │  7. Upload APK ke GitHub Release (tag: build-<id>)
   ▼
Cloudflare Pages Function  (/api/status)
   │  8. Browser polling tiap 4 detik ke sini
   │  9. Kalau sukses -> kasih link download APK (public, tanpa login)
   ▼
Browser menampilkan tombol "Download APK"
```

Token GitHub **tidak pernah** dikirim ke browser — dia hanya hidup di environment
variable Cloudflare Pages Function (server-side), jadi aman.

## Struktur folder yang perlu di-push ke GitHub

```
flows-compiler/
├── .github/workflows/build-apk.yml   <- workflow build APK
├── android-template/                  <- project Android WebView template
├── functions/api/build.js             <- trigger build
├── functions/api/status.js            <- cek status + link download
└── public/index.html                  <- frontend (yang dilihat user)
```

---

## LANGKAH 1 — Buat Repo GitHub

1. Buka https://github.com/new
2. Nama repo bebas, misal `flows-compiler`. **Set Public** (biar link download APK
   dari GitHub Release bisa diakses browser tanpa login — kalau mau Private,
   nanti proses download APK harus lewat proxy tambahan).
3. Setelah repo dibuat, upload semua folder di atas ke repo ini (lewat `git push`
   biasa, atau drag-drop lewat web GitHub kalau belum familiar `git`):

```bash
git init
git remote add origin https://github.com/USERNAME/flows-compiler.git
git add .
git commit -m "init flows compiler"
git branch -M main
git push -u origin main
```

---

## LANGKAH 2 — Buat Personal Access Token (PAT)

Token ini dipakai Cloudflare Function untuk commit file & memicu Actions.

1. Buka https://github.com/settings/personal-access-tokens/new (Fine-grained token)
2. **Repository access** → pilih "Only select repositories" → pilih repo `flows-compiler`
3. **Permissions** → set:
   - `Contents`: Read and write (untuk commit payload + buat Release)
   - `Actions`: Read and write (untuk trigger & cek status workflow)
   - `Metadata`: Read-only (otomatis wajib)
4. Klik **Generate token**, copy tokennya (formatnya `github_pat_xxxxx...`).
   **Simpan baik-baik, tidak akan muncul lagi.**

---

## LANGKAH 3 — Deploy Frontend ke Cloudflare Pages

1. Buka https://dash.cloudflare.com/ → **Workers & Pages** → **Create** → **Pages**
   → **Connect to Git**
2. Pilih repo `flows-compiler` yang tadi dibuat
3. Isi build settings:
   - **Build command**: kosongkan saja (tidak perlu build, ini static file)
   - **Build output directory**: `public`
4. Klik **Save and Deploy**

Cloudflare otomatis mendeteksi folder `functions/` di root repo dan menjalankannya
sebagai serverless function — tidak perlu setting tambahan untuk itu.

---

## LANGKAH 4 — Set Environment Variables di Cloudflare Pages

1. Di project Pages kamu → **Settings** → **Environment variables**
2. Tambahkan (untuk **Production**, dan ulangi juga untuk **Preview** kalau perlu):

| Nama | Nilai | Catatan |
|---|---|---|
| `GITHUB_TOKEN` | `github_pat_xxxxx...` | Encrypt / tandai sebagai **Secret** |
| `GITHUB_OWNER` | `USERNAME` kamu | Username/organisasi GitHub |
| `GITHUB_REPO` | `flows-compiler` | Nama repo |
| `GITHUB_BRANCH` | `main` | Branch default |

3. Klik **Save**, lalu **Redeploy** project (Deployments → ⋯ → Retry deployment)
   supaya environment variable ke-load.

---

## LANGKAH 5 — Coba Build

1. Buka URL Cloudflare Pages kamu (contoh: `https://flows-compiler.pages.dev`)
2. Login (Google/Tamu/Email — ini masih simulasi tampilan, bebas isi apa saja)
3. Pilih plan, lanjut ke halaman compiler
4. Isi:
   - **Nama Aplikasi**: contoh "Aplikasi Keren Gue"
   - **Nama Package**: contoh `com.namakamu.appkeren` (format wajib `a.b.c`)
   - **Versi**: `1.0.0`
   - **Sumber Konten**: pilih tab **Link** lalu isi URL (contoh: `https://example.com`)
   - Centang izin yang dibutuhkan
5. Klik **Build Aplikasi**. Log akan menampilkan progres asli dari GitHub Actions
   (nama step yang lagi jalan), biasanya makan waktu **3–6 menit**.
6. Setelah selesai, tombol **Download APK** muncul — klik untuk unduh file APK asli
   yang sudah ditandatangani dan siap di-install (perlu izin "Install dari sumber
   tidak dikenal" di HP Android).

---

## Mode "File Html" & "Zip"

- **File Html**: upload satu file `index.html` — semua CSS/JS harus inline atau
  pakai CDN (karena cuma 1 file yang dikirim).
- **Zip**: upload folder website (HTML+CSS+JS+gambar) dalam bentuk `.zip`, dengan
  syarat **file `index.html` harus ada persis di root zip** (bukan di dalam subfolder).

Kedua mode ini akan membuat APK yang menampilkan website secara offline (dibundle
ke dalam APK), tidak butuh internet untuk load kontennya sendiri (tapi tetap butuh
internet kalau website-nya manggil API eksternal).

---

## Troubleshooting

**"Format package name tidak valid"**
Package name wajib format `com.namakamu.aplikasi` (minimal 2 segmen, huruf/angka/underscore).

**Build gagal di step SDK licenses**
Biasanya sudah dihandle otomatis oleh step `yes | sdkmanager --licenses`. Kalau masih
gagal, cek log run di GitHub → Actions → klik run yang gagal untuk detail lengkap
(link `runUrl` juga muncul di log-output web kalau build gagal).

**Build gagal karena "index.html tidak ditemukan di root zip"**
Pastikan saat mengompres, kamu masuk dulu ke dalam folder website-nya baru di-zip
(supaya `index.html` ada di root archive, bukan `namafolder/index.html`).

**Limit GitHub Actions**
Akun GitHub gratis dapat ± 2000 menit/bulan untuk Actions di repo publik (bahkan
lebih longgar untuk repo publik — cek kuota di Settings → Billing kalau ragu).

**Mau signature keystore konsisten antar build (bukan sekali pakai)?**
Saat ini tiap build generate keystore baru (supaya tutorial sesimpel mungkin, tanpa
perlu setup secret keystore). Kalau mau APK bisa saling update (signature sama),
generate 1 keystore manual dengan `keytool`, encode ke base64, simpan sebagai
GitHub Actions secret (`RELEASE_KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, dst), lalu
ganti step "Buat keystore sekali pakai" di workflow supaya decode dari secret itu
alih-alih generate baru.

---

## Catatan Penting

- APK yang dihasilkan adalah APK **release** yang sudah ditandatangani (signed),
  tapi dengan keystore sekali pakai per build — cukup untuk instal & dipakai sendiri,
  bukan untuk upload ke Google Play (Play Store butuh App Signing key konsisten dari
  Google Play Console).
- Pastikan kamu hanya meng-compile link/konten yang memang milik kamu atau yang
  kamu punya izin untuk dibungkus jadi APK.
- File payload (`payload/<id>/...`) di repo otomatis dihapus workflow setelah build
  selesai, supaya repo tidak penuh sampah.
