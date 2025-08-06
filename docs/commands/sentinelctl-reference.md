# SentinelCtl Command Reference

Panduan lengkap semua perintah `sentinelctl` untuk mengelola agen SentinelOne EDR di berbagai platform.

## Overview

`sentinelctl` adalah command-line interface (CLI) utama untuk mengelola agen SentinelOne EDR. Tool ini menyediakan kontrol penuh terhadap agent, mulai dari instalasi, konfigurasi, monitoring, hingga troubleshooting.

!!! info "Path Lokasi sentinelctl"
    - **Linux**: `/opt/sentinelone/bin/sentinelctl`
    - **Windows**: `"C:\Program Files\SentinelOne\Sentinel Agent\SentinelCtl.exe"`
    - **macOS**: `/Library/Sentinelone/sentinel/bin/sentinelctl`

!!! warning "Hak Akses"
    Sebagian besar perintah `sentinelctl` memerlukan hak administrator/root untuk dijalankan. Pastikan untuk menggunakan `sudo` pada Linux/macOS atau menjalankan Command Prompt sebagai Administrator pada Windows.

## Management Commands

Perintah untuk mengelola konfigurasi dan konektivitas agent dengan management console.

| Command | Description | Parameters | Example |
|---------|-------------|------------|---------|
| `sentinelctl management token set <TOKEN>` | Set site token untuk menghubungkan agent ke console | `<TOKEN>`: Site token dari console | `sentinelctl management token set AbCdEf123456` |
| `sentinelctl management token show` | Menampilkan site token yang aktif | - | `sentinelctl management token show` |
| `sentinelctl management token remove` | Menghapus site token yang tersimpan | - | `sentinelctl management token remove` |
| `sentinelctl management config show` | Menampilkan konfigurasi management agent | - | `sentinelctl management config show` |
| `sentinelctl management config export` | Export konfigurasi ke file | `[--output <file>]`: Output file path | `sentinelctl management config export --output config.json` |
| `sentinelctl management proxy set <URL>` | Mengatur proxy server untuk komunikasi | `<URL>`: Proxy URL | `sentinelctl management proxy set http://proxy:8080` |
| `sentinelctl management proxy show` | Menampilkan konfigurasi proxy | - | `sentinelctl management proxy show` |
| `sentinelctl management proxy remove` | Menghapus konfigurasi proxy | - | `sentinelctl management proxy remove` |
| `sentinelctl management device-control status` | Menampilkan status kontrol perangkat | - | `sentinelctl management device-control status` |
| `sentinelctl management device-control enable` | Mengaktifkan kontrol perangkat | - | `sentinelctl management device-control enable` |
| `sentinelctl management device-control disable` | Menonaktifkan kontrol perangkat | - | `sentinelctl management device-control disable` |

## Control Commands

Perintah untuk mengontrol layanan dan proteksi SentinelOne agent.

| Command | Description | Parameters | Example |
|---------|-------------|------------|---------|
| `sentinelctl control start` | Memulai layanan SentinelOne agent | - | `sentinelctl control start` |
| `sentinelctl control stop` | Menghentikan layanan SentinelOne agent | - | `sentinelctl control stop` |
| `sentinelctl control restart` | Restart layanan SentinelOne agent | - | `sentinelctl control restart` |
| `sentinelctl control status` | Menampilkan status lengkap agent | `[--verbose]`: Detail tambahan | `sentinelctl control status --verbose` |
| `sentinelctl control reload` | Reload konfigurasi tanpa restart | - | `sentinelctl control reload` |
| `sentinelctl control disable-protection` | Menonaktifkan proteksi (memerlukan passphrase) | `[--passphrase <pass>]`: Passphrase | `sentinelctl control disable-protection --passphrase mypass` |
| `sentinelctl control enable-protection` | Mengaktifkan kembali proteksi | - | `sentinelctl control enable-protection` |
| `sentinelctl control set-passphrase` | Mengatur passphrase untuk operasi sensitif | `<passphrase>`: New passphrase | `sentinelctl control set-passphrase newpassphrase` |
| `sentinelctl control remove-passphrase` | Menghapus passphrase | `<passphrase>`: Current passphrase | `sentinelctl control remove-passphrase currentpass` |

## Information Commands

Perintah untuk mendapatkan informasi tentang agent dan sistem.

| Command | Description | Parameters | Example |
|---------|-------------|------------|---------|
| `sentinelctl version` | Menampilkan versi agent yang terinstal | `[--json]`: Output format JSON | `sentinelctl version --json` |
| `sentinelctl status` | Menampilkan status ringkas agent | `[--json]`: Output format JSON | `sentinelctl status --json` |
| `sentinelctl info` | Menampilkan informasi detail sistem | `[--system]`: Info sistem saja | `sentinelctl info --system` |
| `sentinelctl agent-uuid` | Menampilkan UUID unik agent | - | `sentinelctl agent-uuid` |
| `sentinelctl site-token` | Menampilkan site token (alias untuk management token show) | - | `sentinelctl site-token` |
| `sentinelctl console-url` | Menampilkan URL management console | - | `sentinelctl console-url` |
| `sentinelctl hardware-id` | Menampilkan hardware ID sistem | - | `sentinelctl hardware-id` |

## Log Commands

Perintah untuk mengakses dan mengelola log agent.

| Command | Description | Parameters | Example |
|---------|-------------|------------|---------|
| `sentinelctl logs` | Menampilkan log agent | `[--tail <n>]`: Tampilkan n baris terakhir | `sentinelctl logs --tail 100` |
| `sentinelctl logs export` | Export log ke file | `[--output <path>]`: Output path | `sentinelctl logs export --output /tmp/logs.zip` |
| `sentinelctl logs level` | Menampilkan/mengatur level logging | `[--set <level>]`: Set level (debug/info/warn/error) | `sentinelctl logs level --set debug` |
| `sentinelctl logs clear` | Menghapus log lama | `[--older-than <days>]`: Hapus log lebih lama dari n hari | `sentinelctl logs clear --older-than 30` |

## Policy Commands

Perintah untuk mengelola kebijakan keamanan agent.

| Command | Description | Parameters | Example |
|---------|-------------|------------|---------|
| `sentinelctl policy show` | Menampilkan kebijakan yang aktif | `[--json]`: Output format JSON | `sentinelctl policy show --json` |
| `sentinelctl policy refresh` | Refresh kebijakan dari console | - | `sentinelctl policy refresh` |
| `sentinelctl policy exclusions list` | Menampilkan daftar exclusions | `[--type <type>]`: Filter by type | `sentinelctl policy exclusions list --type path` |
| `sentinelctl policy exclusions add` | Menambah exclusion | `--type <type> --value <value>`: Type dan value | `sentinelctl policy exclusions add --type path --value /tmp` |
| `sentinelctl policy exclusions remove` | Menghapus exclusion | `--id <id>`: ID exclusion | `sentinelctl policy exclusions remove --id 123` |

## Network Commands

Perintah untuk mengelola koneksi jaringan agent.

| Command | Description | Parameters | Example |
|---------|-------------|------------|---------|
| `sentinelctl network test` | Test koneksi ke management console | `[--verbose]`: Detail hasil test | `sentinelctl network test --verbose` |
| `sentinelctl network status` | Status koneksi jaringan | - | `sentinelctl network status` |
| `sentinelctl network proxy test` | Test koneksi melalui proxy | - | `sentinelctl network proxy test` |
| `sentinelctl network dns-test` | Test resolusi DNS | `[--domain <domain>]`: Test domain spesifik | `sentinelctl network dns-test --domain example.com` |
| `sentinelctl network firewall-test` | Test komunikasi firewall | - | `sentinelctl network firewall-test` |

## Update Commands

Perintah untuk mengelola update agent.

| Command | Description | Parameters | Example |
|---------|-------------|------------|---------|
| `sentinelctl update check` | Cek ketersediaan update | `[--json]`: Output format JSON | `sentinelctl update check --json` |
| `sentinelctl update download` | Download update terbaru | `[--version <ver>]`: Download version spesifik | `sentinelctl update download --version 21.7.5` |
| `sentinelctl update install` | Install update yang sudah didownload | `[--reboot]`: Auto reboot jika diperlukan | `sentinelctl update install --reboot` |
| `sentinelctl update status` | Status proses update | - | `sentinelctl update status` |
| `sentinelctl update rollback` | Rollback ke versi sebelumnya | - | `sentinelctl update rollback` |

## Scan Commands

Perintah untuk menjalankan pemindaian keamanan.

| Command | Description | Parameters | Example |
|---------|-------------|------------|---------|
| `sentinelctl scan full` | Menjalankan full system scan | `[--background]`: Jalankan di background | `sentinelctl scan full --background` |
| `sentinelctl scan quick` | Menjalankan quick scan | - | `sentinelctl scan quick` |
| `sentinelctl scan custom` | Menjalankan custom scan | `--path <path>`: Path yang akan discan | `sentinelctl scan custom --path /home/user` |
| `sentinelctl scan status` | Status pemindaian yang berjalan | - | `sentinelctl scan status` |
| `sentinelctl scan stop` | Menghentikan pemindaian | - | `sentinelctl scan stop` |
| `sentinelctl scan results` | Menampilkan hasil pemindaian | `[--last]`: Hasil scan terakhir | `sentinelctl scan results --last` |

## Threat Commands

Perintah untuk mengelola deteksi dan respons ancaman.

| Command | Description | Parameters | Example |
|---------|-------------|------------|---------|
| `sentinelctl threats list` | Menampilkan daftar ancaman | `[--limit <n>]`: Batasi jumlah hasil | `sentinelctl threats list --limit 50` |
| `sentinelctl threats show` | Detail ancaman spesifik | `--id <threat-id>`: ID ancaman | `sentinelctl threats show --id abc123` |
| `sentinelctl threats resolve` | Resolve ancaman | `--id <threat-id>`: ID ancaman | `sentinelctl threats resolve --id abc123` |
| `sentinelctl threats quarantine` | Quarantine file yang terinfeksi | `--file <path>`: Path file | `sentinelctl threats quarantine --file /path/to/file` |
| `sentinelctl threats restore` | Restore file dari quarantine | `--id <quarantine-id>`: ID quarantine | `sentinelctl threats restore --id xyz789` |

## Advanced Commands

Perintah lanjutan untuk troubleshooting dan maintenance.

| Command | Description | Parameters | Example |
|---------|-------------|------------|---------|
| `sentinelctl troubleshoot` | Mengumpulkan data troubleshooting | `[--output <path>]`: Output path | `sentinelctl troubleshoot --output /tmp/debug.zip` |
| `sentinelctl deep-scan` | Melakukan pemindaian mendalam | `[--path <path>]`: Path spesifik | `sentinelctl deep-scan --path /suspicious/path` |
| `sentinelctl repair` | Repair instalasi agent | `[--force]`: Force repair | `sentinelctl repair --force` |
| `sentinelctl reset` | Reset konfigurasi ke default | `[--keep-token]`: Pertahankan site token | `sentinelctl reset --keep-token` |
| `sentinelctl uninstall` | Menghapus agent (memerlukan passphrase) | `[--passphrase <pass>]`: Passphrase | `sentinelctl uninstall --passphrase mypass` |
| `sentinelctl config validate` | Validasi konfigurasi agent | - | `sentinelctl config validate` |
| `sentinelctl config backup` | Backup konfigurasi | `[--output <path>]`: Backup path | `sentinelctl config backup --output /backup/config.json` |
| `sentinelctl config restore` | Restore konfigurasi dari backup | `--input <path>`: Backup file path | `sentinelctl config restore --input /backup/config.json` |

## Service Commands

Perintah untuk mengelola layanan sistem agent.

| Command | Description | Parameters | Example |
|---------|-------------|------------|---------|
| `sentinelctl service install` | Install service sistem | - | `sentinelctl service install` |
| `sentinelctl service uninstall` | Uninstall service sistem | - | `sentinelctl service uninstall` |
| `sentinelctl service enable` | Enable service auto-start | - | `sentinelctl service enable` |
| `sentinelctl service disable` | Disable service auto-start | - | `sentinelctl service disable` |

## Performance Commands

Perintah untuk monitoring performa agent.

| Command | Description | Parameters | Example |
|---------|-------------|------------|---------|
| `sentinelctl performance stats` | Statistik performa agent | `[--duration <sec>]`: Durasi monitoring | `sentinelctl performance stats --duration 60` |
| `sentinelctl performance memory` | Penggunaan memory agent | - | `sentinelctl performance memory` |
| `sentinelctl performance cpu` | Penggunaan CPU agent | - | `sentinelctl performance cpu` |
| `sentinelctl performance disk` | Penggunaan disk agent | - | `sentinelctl performance disk` |
| `sentinelctl performance network` | Statistik network agent | - | `sentinelctl performance network` |

## Examples & Common Usage Patterns

### Initial Setup
```bash
# Set site token dan start agent
sudo sentinelctl management token set YOUR_SITE_TOKEN
sudo sentinelctl control start
sudo sentinelctl status
```

### Daily Operations
```bash
# Cek status dan update
sudo sentinelctl status
sudo sentinelctl update check
sudo sentinelctl logs --tail 50
```

### Troubleshooting
```bash
# Comprehensive troubleshooting
sudo sentinelctl troubleshoot --output /tmp/debug.zip
sudo sentinelctl network test --verbose
sudo sentinelctl logs level --set debug
```

### Security Operations
```bash
# Manual scan dan threat management
sudo sentinelctl scan full --background
sudo sentinelctl threats list --limit 20
sudo sentinelctl policy refresh
```

## Global Options

Opsi yang dapat digunakan dengan sebagian besar perintah:

| Option | Description | Example |
|--------|-------------|---------|
| `--help` | Menampilkan bantuan untuk perintah | `sentinelctl status --help` |
| `--version` | Menampilkan versi sentinelctl | `sentinelctl --version` |
| `--verbose` | Output detail tambahan | `sentinelctl status --verbose` |
| `--json` | Output dalam format JSON | `sentinelctl status --json` |
| `--quiet` | Suppress output normal | `sentinelctl control start --quiet` |
| `--config <path>` | Gunakan file konfigurasi khusus | `sentinelctl --config /etc/custom.conf status` |

## Exit Codes

`sentinelctl` menggunakan exit codes standar:

| Code | Meaning | Description |
|------|---------|-------------|
| 0 | Success | Perintah berhasil dieksekusi |
| 1 | General Error | Error umum dalam eksekusi |
| 2 | Misuse | Perintah atau parameter salah |
| 126 | Cannot Execute | Tidak bisa mengeksekusi perintah |
| 127 | Command Not Found | Perintah tidak ditemukan |
| 130 | Script Terminated | Script dihentikan dengan Ctrl+C |

## Best Practices

!!! tip "Rekomendasi Penggunaan"
    - **Selalu gunakan `--json` output** untuk script automation
    - **Monitor logs secara berkala** dengan `sentinelctl logs`
    - **Test network connectivity** setelah perubahan konfigurasi
    - **Backup konfigurasi** sebelum perubahan major
    - **Gunakan verbose mode** untuk troubleshooting
    - **Regular update checks** untuk keamanan optimal

!!! warning "Peringatan Penting"
    - **Jangan disable protection** tanpa alasan yang jelas
    - **Simpan passphrase dengan aman** untuk operasi uninstall
    - **Test di environment non-production** sebelum deployment
    - **Monitor performance impact** setelah perubahan konfigurasi

---

*Untuk bantuan lebih lanjut dengan perintah spesifik, gunakan `sentinelctl <command> --help` atau hubungi Security Team.*

*Last updated: {{ git_revision_date_localized }}*
