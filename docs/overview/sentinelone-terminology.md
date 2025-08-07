# 📖 SentinelOne Terminology

Glossary istilah-istilah penting dalam SentinelOne EDR dan keamanan siber yang relevan.

---

## 🛡️ SentinelOne Core Terms

| Istilah | Definisi |
|---------|----------|
| **Agent** | Software client SentinelOne yang diinstal pada endpoint untuk monitoring dan deteksi ancaman |
| **Console** | Management portal berbasis web untuk mengonfigurasi kebijakan dan mengelola deployment |
| **Deep Visibility** | Fitur monitoring mendalam untuk visibilitas aktivitas sistem secara detail |
| **Decom** | Proses decommissioning atau menghapus agent dari console management secara permanen |
| **Exclusion** | Konfigurasi untuk mengecualikan file, folder, atau process dari scanning EDR |
| **Policy** | Set konfigurasi dan aturan keamanan yang diterapkan pada agent |
| **Quarantine** | Proses isolasi file atau process berbahaya ke lokasi aman yang tidak dapat dieksekusi |
| **Rollback** | Kemampuan mengembalikan sistem ke kondisi sebelum serangan terjadi |
| **Sentinel** | Istilah umum yang merujuk pada SentinelOne platform atau agent |
| **Site Token** | Unique identifier yang menghubungkan agent dengan console management |
| **Watchlist** | Daftar IOC atau pattern yang dimonitor secara khusus oleh agent |

---

## 🔍 Threat Detection Terms

| Istilah | Definisi |
|---------|----------|
| **APT** | Advanced Persistent Threat - serangan sophisticated dan berkelanjutan |
| **Behavioral Analysis** | Teknik deteksi berdasarkan analisis pola perilaku program |
| **EDR** | Endpoint Detection and Response - solusi keamanan endpoint kontinyu |
| **False Positive** | Alert yang keliru mengidentifikasi aktivitas legitimate sebagai ancaman |
| **Heuristic Detection** | Metode deteksi menggunakan algoritma berdasarkan karakteristik mencurigakan |
| **IOC** | Indicator of Compromise - bukti digital yang mengindikasikan intrusi |
| **MITRE ATT&CK** | Knowledge base tactics, techniques, dan procedures threat actor |
| **Sandboxing** | Teknologi menjalankan file dalam lingkungan terisolasi untuk analisis |
| **Signature-based Detection** | Metode deteksi berdasarkan pattern atau signature yang dikenal |
| **Static Analysis** | Analisis file tanpa mengeksekusinya untuk mendeteksi karakteristik malicious |
| **Dynamic Analysis** | Analisis perilaku file saat dieksekusi dalam environment terkontrol |

---

## 🌐 Network Security Terms

| Istilah | Definisi |
|---------|----------|
| **C2** | Command and Control - server untuk mengendalikan malware secara remote |
| **DGA** | Domain Generation Algorithm - teknik generate domain names secara dinamis |
| **DNS Tunneling** | Teknik menyalahgunakan protokol DNS untuk exfiltration data atau komunikasi C2 |
| **Lateral Movement** | Teknik penyerang berpindah dari satu sistem ke sistem lain dalam network |
| **MitM** | Man-in-the-Middle - serangan mencegat komunikasi antara dua pihak |
| **Network Segmentation** | Praktik membagi network menjadi segment terpisah untuk security |
| **Pivoting** | Teknik menggunakan sistem compromised sebagai stepping stone |
| **Beacon** | Komunikasi reguler antara malware dengan C2 server |
| **Exfiltration** | Proses pencurian data dari sistem target ke lokasi eksternal |

---

## 💾 Malware Terms

| Istilah | Definisi |
|---------|----------|
| **Fileless Malware** | Malware yang beroperasi dalam memory tanpa menulis file ke disk |
| **Living off the Land** | Teknik serangan menggunakan legitimate tools yang sudah ada di sistem |
| **Packer/Crypter** | Tools untuk compress, encrypt, atau obfuscate malware |
| **Payload** | Bagian malware yang berisi kode berbahaya sebenarnya |
| **Persistence** | Teknik malware mempertahankan akses setelah reboot atau pembersihan |
| **Process Injection** | Teknik menyuntikkan malicious code ke legitimate process |
| **Rootkit** | Malware untuk menyembunyikan kehadiran dan memberikan akses root |
| **Trojan** | Malware yang menyamar sebagai software legitimate |
| **Worm** | Malware yang dapat mereplikasi diri dan menyebar secara otomatis |
| **Ransomware** | Malware yang mengenkripsi data dan meminta tebusan |

---

## 🔐 Authentication & Access Terms

| Istilah | Definisi |
|---------|----------|
| **Credential Stuffing** | Serangan menggunakan credentials yang dicuri dari breach sebelumnya |
| **Golden Ticket** | Advanced attack mengeksploitasi Kerberos untuk persistent AD access |
| **Pass-the-Hash** | Teknik serangan menggunakan hashed credentials untuk authenticate |
| **Privilege Escalation** | Proses meningkatkan level akses dari user biasa ke administrator |
| **Token Impersonation** | Teknik menggunakan security token user lain untuk akses |
| **Kerberoasting** | Attack technique untuk extract dan crack service account passwords |
| **Silver Ticket** | Forged Kerberos ticket untuk specific service access |

---

## 📊 Monitoring & Analytics Terms

| Istilah | Definisi |
|---------|----------|
| **Baseline** | Profile normal aktivitas sistem sebagai referensi deteksi anomali |
| **SIEM** | Security Information and Event Management - platform analisis log |
| **SOAR** | Security Orchestration, Automation and Response - platform otomasi respons |
| **Telemetry** | Data yang dikumpulkan otomatis dari sistem untuk monitoring |
| **Threat Intelligence** | Informasi tentang ancaman keamanan current dan emerging |
| **UEBA** | User and Entity Behavior Analytics - analisis pola perilaku |
| **Log Aggregation** | Proses pengumpulan dan konsolidasi log dari berbagai sumber |
| **Correlation** | Proses menghubungkan event atau data dari berbagai sumber |

---

## ⚡ Incident Response Terms

| Istilah | Definisi |
|---------|----------|
| **Containment** | Tahap isolasi ancaman untuk mencegah penyebaran lebih lanjut |
| **Digital Forensics** | Investigasi scientific untuk analisis bukti digital dari incident |
| **Eradication** | Proses menghapus ancaman dan komponen terkait dari sistem |
| **Recovery** | Tahap mengembalikan sistem ke operasi normal setelah incident |
| **Tabletop Exercise** | Simulasi incident keamanan dalam format diskusi |
| **War Room** | Ruang atau platform terpusat untuk koordinasi incident response |
| **IOA** | Indicator of Attack - tanda-tanda serangan yang sedang berlangsung |
| **Threat Hunting** | Proactive search untuk ancaman yang belum terdeteksi |

---

## 🏢 Compliance & Risk Terms

| Istilah | Definisi |
|---------|----------|
| **Compliance** | Kepatuhan terhadap regulasi atau standar keamanan yang ditetapkan |
| **Risk Assessment** | Evaluasi sistematis risiko keamanan yang dihadapi organisasi |
| **Vulnerability Assessment** | Evaluasi untuk mengidentifikasi kerentanan keamanan dalam sistem |
| **Zero Trust** | Model keamanan yang tidak memberikan trust otomatis kepada siapapun |
| **Attack Surface** | Total area atau points dimana penyerang dapat mencoba masuk sistem |
| **Security Posture** | Overall cybersecurity strength dan readiness organisasi |

---

## 🔧 Technical Terms

| Istilah | Definisi |
|---------|----------|
| **API** | Application Programming Interface - protokol untuk integrasi aplikasi |
| **CLI** | Command Line Interface - interface text-based untuk interaksi program |
| **JSON** | JavaScript Object Notation - format pertukaran data lightweight |
| **REST API** | Architectural style untuk web services menggunakan HTTP methods |
| **SSL/TLS** | Security protocols untuk mengamankan komunikasi internet |
| **Hash** | Fixed-length string hasil dari fungsi cryptographic hash |
| **Certificate** | Digital document untuk memverifikasi identitas entity |

---

*Last updated: {{ git_revision_date_localized }}*
