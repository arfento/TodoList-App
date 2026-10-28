# Requirements Document

## Introduction

Fitur "Tambah Catatan Baru" memungkinkan pengguna untuk menulis catatan baru beserta judulnya melalui sebuah formulir. Catatan yang disimpan akan ditambahkan ke daftar catatan yang dikelola oleh React Context. Fitur ini mencakup validasi input untuk judul dan isi catatan, penanganan kesalahan dengan pesan error berwarna merah, serta pengosongan kolom input setelah catatan berhasil disimpan. Aplikasi dibangun menggunakan React dengan TypeScript, React Context API untuk manajemen state, dan CSS Modules untuk styling.

## Glossary

- **Todo_App**: Aplikasi daftar tugas yang sedang dibangun menggunakan React dan TypeScript.
- **Note**: Catatan yang terdiri dari field Title dan Content.
- **Note_Form**: Komponen formulir yang menampilkan kolom input Title, kolom input Content, dan tombol Save untuk menambahkan catatan baru.
- **Note_Context**: React Context yang mengelola state daftar catatan, termasuk penambahan catatan baru.
- **Title**: Field judul dari sebuah Note, wajib diisi dengan panjang maksimal 50 karakter.
- **Content**: Field isi dari sebuah Note, minimal 10 karakter.
- **Save_Button**: Tombol pada Note_Form yang diklik pengguna untuk menyimpan catatan baru.
- **Error_Message**: Pesan kesalahan validasi berwarna merah yang ditampilkan di bawah kolom input yang gagal validasi.

## Requirements

### Requirement 1: Menampilkan Formulir Catatan Baru

**User Story:** Sebagai pengguna, saya ingin melihat formulir untuk menulis catatan baru beserta judulnya, agar saya dapat menambahkan catatan penting dengan mudah.

#### Acceptance Criteria

1. THE Note_Form SHALL menampilkan kolom input Title, kolom input Content, dan Save_Button.
2. WHEN pengguna memasukkan teks ke kolom input Title, THE Note_Form SHALL menampilkan teks tersebut pada kolom input Title.
3. WHEN pengguna memasukkan teks ke kolom input Content, THE Note_Form SHALL menampilkan teks tersebut pada kolom input Content.

### Requirement 2: Validasi Judul Catatan

**User Story:** Sebagai pengguna, saya ingin judul catatan divalidasi, agar setiap catatan memiliki judul yang bermakna dan tidak terlalu panjang.

#### Acceptance Criteria

1. WHEN Save_Button diklik dan kolom input Title kosong, THE Note_Form SHALL menampilkan Error_Message berwarna merah di bawah kolom input Title dan mencegah penyimpanan catatan.
2. WHEN Save_Button diklik dan panjang teks Title melebihi 50 karakter, THE Note_Form SHALL menampilkan Error_Message berwarna merah di bawah kolom input Title dan mencegah penyimpanan catatan.
3. WHEN pengguna mengubah kolom input Title sehingga berisi 1 hingga 50 karakter, THE Note_Form SHALL menghapus Error_Message di bawah kolom input Title.

### Requirement 3: Validasi Isi Catatan

**User Story:** Sebagai pengguna, saya ingin isi catatan divalidasi, agar setiap catatan memiliki konten yang cukup.

#### Acceptance Criteria

1. WHEN Save_Button diklik dan panjang teks Content kurang dari 10 karakter, THE Note_Form SHALL menampilkan Error_Message berwarna merah di bawah kolom input Content yang menunjukkan bahwa panjang teks Content belum mencapai batas minimum 10 karakter serta tidak menyimpan catatan.
2. WHEN pengguna mengubah kolom input Content sehingga panjang teks mencapai 10 karakter atau lebih, THE Note_Form SHALL menghapus Error_Message di bawah kolom input Content.
3. WHEN Save_Button diklik dan panjang teks Content mencapai 10 karakter atau lebih, THE Note_Form SHALL tidak menampilkan Error_Message di bawah kolom input Content.

### Requirement 4: Menyimpan Catatan Baru

**User Story:** Sebagai pengguna, saya ingin menyimpan catatan baru, agar catatan tersebut tersimpan untuk referensi di kemudian hari.

#### Acceptance Criteria

1. WHEN Save_Button diklik dan validasi Title dan Content lulus, THE Note_Context SHALL menambahkan Note baru yang berisi teks Title dan teks Content yang dimasukkan pengguna ke daftar catatan.
2. WHEN Note baru berhasil ditambahkan ke Note_Context, THE Note_Form SHALL mengosongkan kolom input Title dan kolom input Content serta menghapus Error_Message yang ditampilkan.

### Requirement 5: Mencegah Penyimpanan Catatan Tidak Valid

**User Story:** Sebagai pengguna, saya ingin catatan yang tidak valid tidak ikut tersimpan, agar daftar catatan tetap rapi dan bermakna.

#### Acceptance Criteria

1. WHEN Save_Button diklik dan validasi Title atau Content gagal, THE Note_Form SHALL menampilkan Error_Message di bawah setiap kolom input yang gagal validasi.
2. WHEN Save_Button diklik dan validasi Title atau Content gagal, THE Note_Form SHALL mencegah Note disimpan ke Note_Context.
