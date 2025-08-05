# Uninstall SentinelOne EDR

Bagaimana cara menghapus agen SentinelOne EDR dari endpoint atau server.

## Langkah Uninstall

1. **Command-line Uninstallation**
   - Windows: 
     ```cmd
     "C:\Program Files\SentinelOne\Sentinel Agent\SentinelCtl.exe" uninstall_agent
     ```
   - Linux:
     ```bash
     sudo /opt/sentinelone/bin/sentinelctl uninstall
     ```

2. **Verifikasi Penghapusan**
   - Pastikan agen sudah tidak terdaftar pada Management Console.

## Troubleshooting

- **Error Saat Uninstall**
  - Pastikan Anda memiliki hak admin/root.
  - Cek log error jika ada kesalahan spesifik.

## Best Practices

- **Catat Endpoint**
  - Simpan daftar endpoint yang telah diuninstall untuk referensi.

---

*Hubungi tim support jika mengalami kesulitan.*

*Last updated: {{ git_revision_date_localized }}*
