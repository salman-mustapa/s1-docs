# 🛡️ Dokumentasi SentinelOne EDR

[![MkDocs](https://img.shields.io/badge/docs-mkdocs-blue.svg)](https://www.mkdocs.org/)
[![Material](https://img.shields.io/badge/theme-material-green.svg)](https://squidfunk.github.io/mkdocs-material/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen.svg)](https://salman-mustapa.github.io/s1-docs/)

Dokumentasi lengkap untuk implementasi dan pengelolaan SentinelOne Endpoint Detection and Response (EDR). Panduan ini dibuat dengan fokus pada implementasi teknis dan troubleshooting praktis.

## 🌐 Dokumentasi Online

**📖 Baca dokumentasi lengkap di:** [https://salman-mustapa.github.io/s1-docs/](https://salman-mustapa.github.io/s1-docs/)

> Dokumentasi selalu up-to-date dan dapat diakses dari mana saja tanpa perlu install dependencies lokal.

## 🎯 Cakupan Dokumentasi

Dokumentasi ini mencakup panduan teknis lengkap untuk:

- ✅ **Instalasi EDR Agent** pada Windows, Linux, dan macOS
- ✅ **Konfigurasi Exclusions** untuk mencegah false positive
- ✅ **Update Sensor/Patch** dengan berbagai metode deployment
- ✅ **Monitoring Resource** dan optimasi penggunaan system
- ✅ **Monitoring Bandwidth** dan pengelolaan traffic network
- ✅ **Management Operations** termasuk uninstall dan maintenance
- ✅ **Third-party Integration** dengan SIEM dan security tools
- ✅ **Real-time Telemetry** setup dan konfigurasi
- ✅ **Threat Detection** dan tuning detection rules
- ✅ **Threat Hunting** metodologi dan teknik proaktif
- ✅ **Offline Detection/Response** strategi untuk kondisi terputus

## 🚀 Quick Start

### Untuk Membaca Dokumentasi

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/salman-mustapa/s1-docs.git
   cd sentinelone-docs
   ```

2. **Install dependencies:**
   ```bash
   pip install mkdocs mkdocs-material mkdocs-git-revision-date-localized-plugin
   ```

3. **Jalankan development server:**
   ```bash
   mkdocs serve
   ```

4. **Buka browser:** `http://127.0.0.1:8000`

### Untuk Implementasi Langsung

Jika Anda sudah familiar dan ingin langsung implement:

```bash
# 1. Download agent installer dari console
Console > Sentinels > Install New Sentinel

# 2. Install agent (contoh Linux)
sudo rpm -i SentinelAgent_linux.rpm
sudo /opt/sentinelone/bin/sentinelctl management token set SITE_TOKEN
sudo /opt/sentinelone/bin/sentinelctl control start

# 3. Verify installation
sudo /opt/sentinelone/bin/sentinelctl status
```

> ⚠️ **Penting**: Pastikan Anda memiliki Site Token dari Management Console!

## 📖 Struktur Dokumentasi

```
docs/
├── index.md                           # Halaman beranda
├── installation/                      # Instalasi & Konfigurasi
│   ├── edr-install.md                # Install EDR Agent
│   ├── edr-exclusion.md              # Konfigurasi Exclusions
│   └── sensor-update.md              # Update Sensor/Patch
├── monitoring/                        # System Monitoring
│   ├── resource-utilization.md      # Resource Monitoring
│   └── bandwidth-utilization.md     # Bandwidth Monitoring
├── management/                        # Management Operations
│   └── uninstall-edr.md             # Uninstall Procedures
├── integration/                       # Integration
│   └── third-party-integration.md   # Third-party Systems
└── security/                         # Security Operations
    ├── real-time-telemetry.md       # Telemetry Configuration
    ├── threat-detection.md          # Detection Rules
    ├── threat-hunting.md            # Hunting Techniques
    └── offline-detection-response.md # Offline Operations
```

## 🛠️ Teknologi yang Digunakan

- **[MkDocs](https://www.mkdocs.org/)** - Static site generator
- **[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)** - Material Design theme
- **[Git Revision Date Plugin](https://github.com/timvink/mkdocs-git-revision-date-localized-plugin)** - Show last update dates

## 🎨 Fitur Dokumentasi

- 🌙 **Dark/Light Mode** - Toggle tema sesuai preferensi
- 🔍 **Search** - Pencarian dalam dokumentasi
- 📱 **Responsive** - Optimal di desktop dan mobile
- 🎯 **Navigation** - Navigasi yang mudah dan terstruktur
- 📋 **Code Copy** - Copy code block dengan satu klik
- 🏷️ **Syntax Highlighting** - Highlighting untuk berbagai bahasa
- 🛠️ **Technical Focus** - Fokus pada implementasi dan troubleshooting

## 📦 Instalasi Dependencies

### Ubuntu/Debian
```bash
# Install Python dan pip
sudo apt update
sudo apt install python3 python3-pip -y

# Install MkDocs dan dependencies
pip3 install mkdocs mkdocs-material mkdocs-git-revision-date-localized-plugin
```

### CentOS/RHEL/Fedora
```bash
# Install Python dan pip
sudo dnf install python3 python3-pip -y

# Install MkDocs dan dependencies
pip3 install mkdocs mkdocs-material mkdocs-git-revision-date-localized-plugin
```

### Arch Linux
```bash
# Install Python dan pip
sudo pacman -S python python-pip

# Install MkDocs dan dependencies
pip install mkdocs mkdocs-material mkdocs-git-revision-date-localized-plugin
```

## 🔧 Development

### Local Development

```bash
# Clone repository
git clone https://github.com/salman-mustapa/sentinelone-docs.git
cd sentinelone-docs

# Install dependencies
pip install -r requirements.txt

# Start development server
mkdocs serve

# Build untuk production
mkdocs build
```

### Deploy ke GitHub Pages

```bash
# Deploy otomatis ke gh-pages branch
mkdocs gh-deploy

# Atau manual build dan push
mkdocs build
# Upload folder site/ ke hosting
```

## 🤝 Kontribusi

Kontribusi sangat diterima! Berikut cara berkontribusi:

1. **Fork** repository ini
2. **Buat branch** untuk fitur baru: `git checkout -b feature/awesome-feature`
3. **Commit** perubahan: `git commit -m 'Add awesome feature'`
4. **Push** ke branch: `git push origin feature/awesome-feature`
5. **Buat Pull Request**

### Pedoman Kontribusi

- Pastikan dokumentasi menggunakan bahasa Indonesia yang baik dan benar
- Fokus pada implementasi teknis dan troubleshooting praktis
- Tambahkan contoh command dan script yang berfungsi
- Update daftar isi jika menambah halaman baru
- Test dokumentasi dengan `mkdocs serve` sebelum commit

## 📝 License

Dokumentasi ini dilisensikan di bawah [MIT License](LICENSE).

## 👨‍💻 Author

**Salman Mustapa**
- GitHub: [@salman-mustapa](https://github.com/salman-mustapa)
- Email: salman.mustapa@dikstrasolusi.com
- Organization: PT Dikstra Solusi

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

1. Baca dokumentasi lengkap di [https://salman-mustapa.github.io/s1-docs/](https://salman-mustapa.github.io/s1-docs/)
2. Buat [Issue](https://github.com/salman-mustapa/sentinelone-docs/issues) di GitHub
3. Kirim email ke: salman.mustapa@dikstrasolusi.com

## 🎯 Target Audience

Dokumentasi ini ditujukan untuk:

- **Security Engineers** yang mengimplementasikan SentinelOne EDR
- **System Administrators** yang mengelola deployment EDR
- **IT Operations** yang melakukan maintenance dan troubleshooting
- **SOC Analysts** yang menggunakan EDR untuk threat hunting

## 📊 Status

- ✅ Dokumentasi instalasi dan konfigurasi
- ✅ Panduan monitoring dan management
- ✅ Troubleshooting dan error handling
- ✅ Integration dengan third-party systems
- ✅ Security operations dan threat hunting
- 🔄 Advanced automation scripts (in progress)
- 🔄 API integration examples (planned)

## 🙏 Acknowledgments

Terima kasih kepada:

- Tim [MkDocs](https://www.mkdocs.org/) untuk static site generator yang luar biasa
- Tim [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) untuk tema yang indah
- SentinelOne community untuk knowledge sharing
- Security professionals yang memberikan feedback

---

⭐ **Jika dokumentasi ini membantu, jangan lupa beri star!** ⭐

[![GitHub stars](https://img.shields.io/github/stars/salman-mustapa/s1-docs.svg?style=social&label=Star)](https://github.com/salman-mustapa/s1-docs)
