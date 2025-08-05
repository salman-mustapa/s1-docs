# Konfigurasi File/Folder/App Exclusions

Panduan teknis untuk mengatur exclusion dan mencegah false positive pada SentinelOne EDR.

## Implementasi Exclusions

### 1. Akses Menu Exclusions
```
Console > Settings > Exclusions > Add New
```

### 2. Tipe Exclusions

#### File Path Exclusions
```bash
# Windows Example
C:\Program Files\YourApp\*.exe
C:\Temp\*

# Linux Example
/opt/yourapp/*
/tmp/*
```

#### Folder Exclusions
```bash
# Windows
C:\Program Files\Database\
C:\Logs\

# Linux
/var/log/
/opt/database/
```

#### Process Exclusions
```bash
# Process name
mysql.exe
postgres
java.exe
```

### 3. Hash-based Exclusions
```bash
# SHA1 hash untuk file tertentu
SHA1: a1b2c3d4e5f6...
```

## Common Exclusions List

### Database Applications
```bash
# MySQL
C:\Program Files\MySQL\*
/var/lib/mysql/*

# PostgreSQL
C:\Program Files\PostgreSQL\*
/var/lib/postgresql/*
```

### Development Tools
```bash
# Visual Studio
C:\Program Files\Microsoft Visual Studio\*

# Git
C:\Program Files\Git\*
/usr/bin/git
```

### Backup Solutions
```bash
# Veeam
C:\Program Files\Veeam\*

# CommVault
C:\Program Files\CommVault\*
```

## Error Troubleshooting

### Error: "Exclusion not applied"
**Penyebab:**
- Path salah
- Agent belum sync
- Policy conflict

**Solusi:**
```bash
# Verify agent connection
sentinelctl status

# Force policy update
sentinelctl management update-policy
```

### Error: "Performance impact detected"
**Penyebab:**
- Over-exclusion
- Wildcards terlalu luas

**Solusi:**
- Review exclusion list
- Gunakan path specific
- Hapus exclusion yang tidak perlu

### Error: "Hash mismatch"
**Penyebab:**
- File berubah setelah hash dibuat
- Hash calculation error

**Solusi:**
```bash
# Recalculate hash
# Windows
certutil -hashfile "C:\path\to\file.exe" SHA1

# Linux
sha1sum /path/to/file
```

## Validasi Exclusions

### Test Exclusion Effectiveness
```bash
# Check if file is excluded
sentinelctl exclusions test "C:\path\to\file.exe"

# List active exclusions
sentinelctl exclusions list
```

### Monitor Impact
```bash
# Check scanning activity
sentinelctl logs scan | tail -100

# Monitor CPU usage
sentinelctl stats cpu
```

---

*Untuk bantuan lebih lanjut, silakan hubungi tim keamanan Anda.*

*Last updated: {{ git_revision_date_localized }}*
