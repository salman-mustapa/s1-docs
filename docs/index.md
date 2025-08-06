# 🛡️ Dokumentasi SentinelOne EDR

Selamat datang di dokumentasi lengkap SentinelOne EDR. Panduan ini dirancang khusus untuk tim keamanan agar dapat dengan cepat memahami dan mengimplementasikan solusi SentinelOne EDR dengan efektif.

## 🎯 Quick Navigation

<div class="grid cards" markdown>

-   :material-terminal:{ .lg .middle } **Command Reference**

    ---

    Referensi lengkap semua perintah sentinelctl untuk mengelola EDR agent

    [:octicons-arrow-right-24: Command Reference](commands/sentinelctl-reference.md)

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

## 🔧 SentinelCtl Command Line Interface

`sentinelctl` adalah command-line interface (CLI) utama untuk mengelola agen SentinelOne EDR. Tool ini menyediakan kontrol penuh terhadap agent, mulai dari instalasi, konfigurasi, monitoring, hingga troubleshooting.

### Quick Command Examples

```bash
# Basic operations
sudo sentinelctl status                    # Cek status agent
sudo sentinelctl management token set      # Set site token
sudo sentinelctl control start             # Start agent service
sudo sentinelctl logs --tail 50            # Lihat log terakhir

# Advanced operations  
sudo sentinelctl scan full --background    # Full system scan
sudo sentinelctl troubleshoot              # Collect debug info
sudo sentinelctl update check              # Check for updates
```

!!! info "📖 Dokumentasi Command Lengkap"
    Untuk referensi lengkap semua perintah `sentinelctl` dengan parameter dan contoh penggunaan, silakan kunjungi:
    
    **➡️ [SentinelCtl Command Reference](commands/sentinelctl-reference.md)**
    
    Halaman tersebut mencakup:
    - ✅ **150+ commands** dengan kategorisasi lengkap
    - ✅ **Parameter dan opsi** untuk setiap perintah
    - ✅ **Contoh penggunaan** praktis
    - ✅ **Best practices** dan troubleshooting tips

## 📋 Documentation Scope

Dokumentasi ini mencakup seluruh aspek pengelolaan SentinelOne EDR:

| Topic | Description | Status |
|-------|-------------|--------|
| **[Install EDR to Server/Endpoint](installation/edr-install.md)** | Panduan lengkap instalasi agen EDR pada server dan endpoint dengan berbagai sistem operasi | ✅ Ready |
| **[File/Folder/App Exclusion from EDR](installation/edr-exclusion.md)** | Konfigurasi eksklusi file, folder, dan aplikasi untuk menghindari false positive | ✅ Ready |
| **[Update EDR Patch to Endpoint (Sensor Update)](installation/sensor-update.md)** | Prosedur update patch dan sensor secara manual maupun otomatis | ✅ Ready |
| **[Resource Utilization](monitoring/resource-utilization.md)** | Monitoring dan analisis penggunaan resource sistem oleh agen EDR | ✅ Ready |
| **[Bandwidth Utilization](monitoring/bandwidth-utilization.md)** | Pengelolaan dan optimisasi penggunaan bandwidth untuk komunikasi EDR | ✅ Ready |
| **[Uninstall EDR](management/uninstall-edr.md)** | Prosedur penghapusan agen EDR yang aman dan bersih | ✅ Ready |
| **[Integration to 3rd Party](integration/third-party-integration.md)** | Integrasi dengan sistem keamanan dan monitoring pihak ketiga | ✅ Ready |
| **[Real-time Telemetry](security/real-time-telemetry.md)** | Setup dan konfigurasi telemetri real-time untuk monitoring kontinyu | ✅ Ready |
| **[Threat Detection](security/threat-detection.md)** | Konfigurasi dan tuning aturan deteksi ancaman otomatis | ✅ Ready |
| **[Threat Hunting](security/threat-hunting.md)** | Teknik dan metodologi untuk investigasi ancaman secara proaktif | ✅ Ready |
| **[Offline Detection/Response](security/offline-detection-response.md)** | Strategi deteksi dan respons dalam kondisi offline atau terputus | ✅ Ready |

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

## 📞 Support & Contact

Untuk dukungan teknis dan pertanyaan lebih lanjut:

- **Security Team**: [salman-mustapa@dikstrasolusi.com](mailto:salman-mustapa@dikstrasolusi.com)
- **Internal Documentation**: [Internal Docs](https://salman-mustapa.github.io/s1-docs/)
- **SentinelOne Official Support**: [SentinelOne Support](https://dikstrasolusi.com)

---

*Last updated: {{ git_revision_date_localized }}*
