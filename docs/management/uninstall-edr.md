# Uninstall SentinelOne EDR

Panduan lengkap untuk menghapus agen SentinelOne EDR dari endpoint atau server dengan berbagai metode dan sistem operasi.

!!! info "Dokumentasi Lengkap"
    Panduan uninstall yang komprehensif dengan berbagai metode untuk setiap platform telah dipindahkan ke halaman instalasi untuk memudahkan referensi.

    **➡️ [Lihat Panduan Uninstall Lengkap di Halaman Instalasi](../installation/edr-install.md#uninstall-sentinelone-edr-agent)**

## Quick Reference

Berikut adalah perintah uninstall cepat untuk setiap platform:

### Windows
```cmd
"C:\Program Files\SentinelOne\Sentinel Agent\SentinelCtl.exe" uninstall
```

### Linux
```bash
sudo /opt/sentinelone/bin/sentinelctl uninstall
```

### macOS
```bash
sudo /Library/Sentinelone/sentinel/bin/sentinelctl uninstall
```

!!! warning "Penting Sebelum Uninstall"
    - **Pastikan backup konfigurasi** jika diperlukan
    - **Siapkan alternatif keamanan** untuk menggantikan SentinelOne
    - **Dapatkan passphrase** dari administrator jika diperlukan
    - **Dokumentasikan endpoint** yang akan di-uninstall

## Kapan Perlu Uninstall

- **Migrasi ke solusi keamanan lain**
- **Troubleshooting agent yang bermasalah**
- **Decommissioning endpoint**
- **Upgrade major version** (dalam beberapa kasus)
- **Compliance requirement** khusus

## Post-Uninstall Checklist

- [ ] Verifikasi agent sudah tidak muncul di Management Console
- [ ] Pastikan semua service SentinelOne telah berhenti
- [ ] Periksa tidak ada file sisa di sistem
- [ ] Update dokumentasi inventory endpoint
- [ ] Implementasikan solusi keamanan alternatif

---

**Untuk panduan lengkap dengan berbagai metode uninstall, troubleshooting, dan verification steps, silakan kunjungi:**

**📋 [Panduan Uninstall Lengkap](../installation/edr-install.md#uninstall-sentinelone-edr-agent)**

---

*Hubungi Security Team jika mengalami kesulitan dalam proses uninstall.*

*Last updated: {{ git_revision_date_localized }}*
