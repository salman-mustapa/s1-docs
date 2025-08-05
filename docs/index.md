# 🛡️ Dokumentasi SentinelOne EDR

Selamat datang di dokumentasi lengkap SentinelOne EDR. Panduan ini dirancang khusus untuk tim keamanan agar dapat dengan cepat memahami dan mengimplementasikan solusi SentinelOne EDR dengan efektif.

## 🎯 Quick Navigation

<div class="grid cards" markdown>

-   :material-download:{ .lg .middle } **Installation & Configuration**

    ---

    Panduan lengkap instalasi EDR agent, konfigurasi exclusion, dan update sensor

    [:octicons-arrow-right-24: Mulai Instalasi](installation/edr-install.md)

-   :material-monitor:{ .lg .middle } **System Monitoring**

    ---

    Monitor resource sistem dan bandwidth untuk performa optimal EDR

    [:octicons-arrow-right-24: Monitor Sistem](monitoring/resource-utilization.md)

-   :material-cog:{ .lg .middle } **Management**

    ---

    Kelola deployment dan maintenance SentinelOne EDR

    [:octicons-arrow-right-24: Management](management/uninstall-edr.md)

-   :material-link-variant:{ .lg .middle } **Integration**

    ---

    Integrasi dengan sistem keamanan dan monitoring pihak ketiga

    [:octicons-arrow-right-24: Integration](integration/third-party-integration.md)

-   :material-security:{ .lg .middle } **Security Operations**

    ---

    Deteksi ancaman, hunting, dan respons untuk operasi keamanan efektif

    [:octicons-arrow-right-24: Security Operations](security/threat-detection.md)

</div>

## 📋 Documentation Scope

Dokumentasi ini mencakup seluruh aspek pengelolaan SentinelOne EDR:

| Topic | Description | Status |
|-------|-------------|--------|
| **Install EDR to Server/Endpoint** | Panduan lengkap instalasi agen EDR pada server dan endpoint dengan berbagai sistem operasi | ✅ Ready |
| **File/Folder/App Exclusion from EDR** | Konfigurasi eksklusi file, folder, dan aplikasi untuk menghindari false positive | ✅ Ready |
| **Update EDR Patch to Endpoint (Sensor Update)** | Prosedur update patch dan sensor secara manual maupun otomatis | ✅ Ready |
| **Resource Utilization** | Monitoring dan analisis penggunaan resource sistem oleh agen EDR | ✅ Ready |
| **Bandwidth Utilization** | Pengelolaan dan optimisasi penggunaan bandwidth untuk komunikasi EDR | ✅ Ready |
| **Uninstall EDR** | Prosedur penghapusan agen EDR yang aman dan bersih | ✅ Ready |
| **Integration to 3rd Party** | Integrasi dengan sistem keamanan dan monitoring pihak ketiga | ✅ Ready |
| **Real-time Telemetry** | Setup dan konfigurasi telemetri real-time untuk monitoring kontinyu | ✅ Ready |
| **Threat Detection** | Konfigurasi dan tuning aturan deteksi ancaman otomatis | ✅ Ready |
| **Threat Hunting** | Teknik dan metodologi untuk investigasi ancaman secara proaktif | ✅ Ready |
| **Offline Detection/Response** | Strategi deteksi dan respons dalam kondisi offline atau terputus | ✅ Ready |

## 🚀 Getting Started

Jika Anda baru dalam menggunakan SentinelOne EDR, ikuti urutan rekomendasi berikut:

1. **[Install EDR to Server/Endpoint](installation/edr-install.md)** - Mulai dengan instalasi agen pada endpoint target
2. **[File/Folder/App Exclusion from EDR](installation/edr-exclusion.md)** - Konfigurasikan eksklusi yang diperlukan
3. **[Real-time Telemetry](security/real-time-telemetry.md)** - Aktifkan monitoring real-time
4. **[Threat Detection](security/threat-detection.md)** - Setup aturan deteksi sesuai kebutuhan organisasi

## 💡 Best Practices

!!! tip "Tips untuk Implementasi Sukses"
    - **Testing Environment**: Selalu uji semua konfigurasi di lingkungan lab sebelum produksi
    - **Regular Updates**: Jaga agar versi sensor selalu terupdate untuk mendapatkan proteksi terbaru
    - **Performance Monitoring**: Monitor utilisasi resource secara berkala setelah deployment
    - **Proper Exclusions**: Implementasikan eksklusi yang tepat untuk menghindari impact pada performa sistem
    - **Proactive Hunting**: Lakukan aktivitas threat hunting secara rutin untuk meningkatkan security posture

## 📞 Support & Contact

Untuk dukungan teknis dan pertanyaan lebih lanjut:

- **Security Team**: salman-mustapa@dikstrasolusi.com
- **Internal Documentation**: https://salman-mustapa.github.io/s1-docs
- **SentinelOne Official Support**: https://dikstrasolusi.com

---

*Last updated: {{ git_revision_date_localized }}*
