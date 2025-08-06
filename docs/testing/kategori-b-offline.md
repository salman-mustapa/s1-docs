# Kategori B: Skenario Offline Testing

## Overview
Testing komprehensif kemampuan SentinelOne EDR dalam kondisi **offline/disconnected** dari management console. Ini adalah skenario kritis untuk server yang mungkin mengalami network interruption atau berada di isolated environment.

---

## 🌐 B1: Offline Malware Detection

### Tujuan Testing
Memvalidasi bahwa SentinelOne tetap mampu mendeteksi dan memblokir ancaman ketika tidak terhubung ke management console atau internet.

### Pre-Requisites
- [ ] SentinelOne Agent terinstall dan fully functional
- [ ] Policy sudah di-cache di endpoint
- [ ] Baseline behavior sudah ter-establish
- [ ] Network isolation tools siap digunakan

### Test Scenarios

#### B1.1: Complete Network Isolation Testing

**Setup Environment:**
```bash
# Windows Server - Disable network adapters
Get-NetAdapter | Disable-NetAdapter -Confirm:$false

# Linux Server - Disable network interfaces
sudo ip link set eth0 down
sudo ip link set wlan0 down

# Verify isolation
ping 8.8.8.8  # Should fail
nslookup google.com  # Should fail
```

**Malware Detection Test:**
```powershell
# Windows Server - Offline EICAR test
echo X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H* > C:\temp\offline_eicar.txt

# Expected Results:
# - File masih terdeteksi dan diblokir
# - Local quarantine berfungsi
# - Event logging tetap aktif
# - Agent status menunjukkan "Offline" tapi "Protected"
```

```bash
# Linux Server - Offline EICAR test
echo 'X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*' > /tmp/offline_eicar.txt

# Expected Results:
# - File masih terdeteksi dan diblokir
# - Local quarantine berfungsi
# - Syslog entries tetap tercatat
# - Agent tetap melindungi sistem
```

#### B1.2: Executable Malware in Offline Mode

**Windows Server:**
```powershell
# Test dengan executable malware sample
# CATATAN: Gunakan safe test samples
Copy-Item "\\secure-share\test-samples\eicar.exe" -Destination "C:\temp\test_malware.exe"
& "C:\temp\test_malware.exe"

# Validation Points:
# - Execution harus diblokir
# - Process termination logged locally
# - Quarantine action berhasil
# - System integrity terjaga
```

**Linux Server:**
```bash
# Test dengan executable malware sample
cp /secure-share/test-samples/eicar.elf /tmp/test_malware
chmod +x /tmp/test_malware
/tmp/test_malware

# Validation Points:
# - Execution harus diblokir
# - Process killed immediately
# - File quarantined locally
# - Security posture maintained
```

#### B1.3: Script-based Threats Offline

**Windows Server:**
```powershell
# PowerShell script threat simulation
$maliciousScript = @"
# Simulate credential harvesting
Get-Process lsass
rundll32.exe C:\windows\system32\comsvcs.dll, MiniDump 644 C:\temp\lsass.dmp full
"@

$maliciousScript | Out-File -FilePath "C:\temp\malicious.ps1"
powershell.exe -ExecutionPolicy Bypass -File "C:\temp\malicious.ps1"

# Expected Results:
# - Script execution blocked
# - Behavioral analysis tetap aktif
# - Local threat intelligence digunakan
```

**Linux Server:**
```bash
# Bash script threat simulation
cat << 'EOF' > /tmp/malicious.sh
#!/bin/bash
# Simulate suspicious activity
cat /etc/shadow
find / -name "*.ssh" -type d
nc -l 1234 &
EOF

chmod +x /tmp/malicious.sh
/tmp/malicious.sh

# Expected Results:
# - Script execution monitored/blocked
# - Suspicious file access detected
# - Network activity controlled
```

---

## 🔒 B2: Offline Uninstall Attempts

### Tujuan Testing
**Skenario Kritis**: Testing kemampuan self-protection SentinelOne ketika ada attempt uninstall dalam kondisi offline. Ini sangat penting untuk demo ke atasan.

### Test Scenarios

#### B2.1: Standard Uninstall Attempt

**Windows Server:**
```powershell
# Attempt 1: Control Panel uninstall
appwiz.cpl
# Cari SentinelOne dalam Programs and Features
# Coba uninstall

# Attempt 2: MSI uninstall
msiexec /x {GUID-SentinelOne} /quiet

# Attempt 3: Service manipulation
sc stop SentinelAgent
sc delete SentinelAgent
sc stop SentinelHelperService
sc delete SentinelHelperService

# Expected Results:
# - Uninstall diblokir atau requires passphrase
# - Service manipulation ditolak
# - Self-protection mechanisms aktif
# - Tamper attempt logged
```

**Linux Server:**
```bash
# Attempt 1: Package manager removal
sudo apt remove sentinelone-agent
sudo yum remove sentinelone-agent
sudo rpm -e sentinelone-agent

# Attempt 2: Service manipulation
sudo systemctl stop sentinelone
sudo systemctl disable sentinelone
sudo systemctl mask sentinelone

# Attempt 3: Manual file deletion
sudo rm -rf /opt/sentinelone/
sudo rm -rf /var/lib/sentinelone/

# Expected Results:
# - Package removal blocked
# - Service protection aktif
# - File system protection mencegah deletion
# - Tamper protection engaged
```

#### B2.2: Advanced Uninstall Attempts

**Windows Server:**
```powershell
# Advanced technique 1: Registry manipulation
reg delete "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{SentinelOne-GUID}"
reg delete "HKLM\SYSTEM\CurrentControlSet\Services\SentinelAgent"

# Advanced technique 2: Process termination
taskkill /f /im SentinelAgent.exe
taskkill /f /im SentinelUI.exe

# Advanced technique 3: Driver manipulation
sc stop SentinelMonitor
pnputil /delete-driver SentinelOne.inf

# Expected Results:
# - Registry modifications blocked
# - Process protection prevents termination
# - Driver tampering detected and prevented
```

**Linux Server:**
```bash
# Advanced technique 1: Process killing
sudo kill -9 $(pidof sentinelone-agent)
sudo killall -9 sentinelone

# Advanced technique 2: Kernel module removal
sudo rmmod sentinelone_kernel
lsmod | grep sentinelone

# Advanced technique 3: Configuration tampering
sudo rm -f /etc/sentinelone/agent.conf
sudo chmod 000 /opt/sentinelone/bin/

# Expected Results:
# - Process resurrection capabilities
# - Kernel module protection
# - Configuration integrity maintained
```

#### B2.3: Persistence Verification

**After Uninstall Attempts:**
```bash
# Verify agent is still running
# Windows:
Get-Service -Name "*Sentinel*"
Get-Process -Name "*Sentinel*"

# Linux:
sudo systemctl status sentinelone
ps aux | grep sentinel

# Verify protection is still active
# Test with EICAR file again
echo 'X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*' > /tmp/verify_protection.txt

# Expected Results:
# - Agent masih berjalan
# - Services masih aktif
# - Protection masih efektif
# - Tamper attempts tercatat dalam log
```

---

## 📡 B3: Network Disconnection Response

### Tujuan Testing
Testing behavior SentinelOne ketika network connectivity hilang dan kemudian pulih kembali.

### Test Scenarios

#### B3.1: Gradual Network Degradation

**Phase 1: Partial Connectivity Loss**
```bash
# Simulate high latency
# Linux:
sudo tc qdisc add dev eth0 root netem delay 5000ms
# Windows:
# Gunakan network simulation tools seperti WANem atau Clumsy

# Test agent behavior dengan degraded connection
# Monitor response times dan functionality
```

**Phase 2: Intermittent Connectivity**
```bash
# Simulate connection drops
# Script untuk on/off network secara periodik
for i in {1..10}; do
    sudo ip link set eth0 down
    sleep 30
    sudo ip link set eth0 up
    sleep 60
done

# Monitor:
# - Agent reconnection behavior
# - Data synchronization
# - Policy updates
# - Alert forwarding
```

**Phase 3: Complete Isolation**
```bash
# Complete network isolation
sudo iptables -A OUTPUT -j DROP
sudo iptables -A INPUT -j DROP

# Verify complete isolation
ping 8.8.8.8  # Should fail
curl -I https://google.com  # Should fail

# Test protection capabilities
# Run various malware tests
```

#### B3.2: Reconnection and Synchronization

**Network Restoration:**
```bash
# Restore network connectivity
# Linux:
sudo iptables -F
sudo ip link set eth0 up

# Windows:
Get-NetAdapter | Enable-NetAdapter
```

**Synchronization Testing:**
```powershell
# Monitor synchronization process
# Check logs untuk:
# - Agent check-in dengan management console
# - Policy synchronization
# - Event log uploading
# - Threat intelligence updates

# Windows:
Get-EventLog -LogName Application -Source "SentinelOne"

# Linux:
sudo tail -f /var/log/sentinelone/agent.log
```

---

## 💾 B4: Cached Policy Enforcement

### Tujuan Testing
Validasi bahwa cached policies tetap enforced selama offline period dan update properly ketika reconnect.

### Test Scenarios

#### B4.1: Policy Cache Validation

**Before Going Offline:**
```bash
# Document current policy settings
# Windows:
sentinelctl status
sentinelctl policy list

# Linux:
sudo /opt/sentinelone/bin/sentinelctl status
sudo /opt/sentinelone/bin/sentinelctl policy list
```

**During Offline Period:**
```bash
# Test each policy enforcement:
# 1. File type restrictions
# 2. Application whitelisting/blacklisting  
# 3. Network access controls
# 4. User behavior policies
# 5. Threat response actions

# Verify policies masih aktif dan enforced
```

#### B4.2: Policy Conflict Resolution

**Simulate Policy Changes During Offline:**
```bash
# Scenario: Management console mengubah policy saat agent offline
# Ketika reconnect, test:
# - Policy synchronization
# - Conflict resolution
# - Retroactive enforcement
```

---

## 📊 Offline Testing Metrics

### Key Performance Indicators

| Test Case | Success Criteria | Measurement Method |
|-----------|-----------------|-------------------|
| Offline Malware Detection | >99% detection rate | EICAR & sample testing |
| Uninstall Protection | 100% prevention | Tamper attempt blocking |
| Network Recovery | <60s sync time | Reconnection monitoring |
| Policy Enforcement | 100% compliance | Policy validation tests |
| Self-Protection | 0% successful tampering | Advanced attack simulation |

### Demo Validation Checklist

#### Offline Protection Validation
- [ ] **Threat Detection**: Malware masih terdeteksi offline
- [ ] **Real-time Protection**: Blocking masih efektif
- [ ] **Behavioral Analysis**: Suspicious activity monitoring aktif
- [ ] **Quarantine Functionality**: Local quarantine berfungsi
- [ ] **Logging Integrity**: Event logging tetap comprehensive

#### Self-Protection Validation
- [ ] **Uninstall Prevention**: Standard removal methods blocked
- [ ] **Service Protection**: Critical services tidak bisa dihentikan
- [ ] **Process Protection**: Agent processes tidak bisa dimatikan
- [ ] **Configuration Integrity**: Settings tidak bisa diubah tanpa auth
- [ ] **Tamper Detection**: Semua attempt tercatat dan diblokir

#### Recovery & Sync Validation
- [ ] **Automatic Reconnection**: Agent otomatis reconnect
- [ ] **Data Synchronization**: Events dan alerts tersinkronisasi
- [ ] **Policy Updates**: Policy terbaru berhasil diapply
- [ ] **Status Reporting**: Current status akurat di console
- [ ] **Threat Intelligence**: Updates ter-download dan aktif

---

## Demo Presentation Highlights

### Executive Talking Points
1. **"Offline Protection Capability"**
   - Server tetap terlindungi meski network down
   - Local intelligence dan cached policies memastikan continuity
   - Zero security gaps selama network outage

2. **"Tamper-Proof Architecture"** 
   - Uninstall attempts diblokir bahkan oleh administrator
   - Self-healing capabilities menjaga integrity
   - Advanced persistent threats tidak bisa disable protection

3. **"Seamless Recovery"**
   - Automatic reconnection dan synchronization
   - No manual intervention required
   - Complete audit trail maintained

### Live Demo Script
1. **Setup**: Tampilkan agent status dan connectivity
2. **Disconnect**: Simulasi network failure
3. **Attack**: Jalankan malware test dalam kondisi offline
4. **Block**: Tunjukkan protection masih aktif
5. **Tamper**: Attempt uninstall berbagai cara
6. **Fail**: Semua tamper attempts gagal
7. **Reconnect**: Restore network connectivity
8. **Sync**: Monitor synchronization process
9. **Verify**: Confirm complete protection restoration

---

## Next Steps

Lanjutkan ke testing categories berikutnya:
- [Kategori C: Operational Resilience](kategori-c-operational.md)
- [Kategori D: Security Hardening](kategori-d-security.md)
- [Windows-specific Offline Testing](windows/windows-offline.md)
- [Linux-specific Offline Testing](linux/linux-offline.md)

!!! warning "Demo Critical"
    Kategori B testing adalah **MOST CRITICAL** untuk demo ke atasan. Offline protection dan tamper resistance adalah key differentiator yang akan impress stakeholder tentang robustness SentinelOne EDR.
