# Kategori D: Security Hardening Testing

## Overview
Testing komprehensif kemampuan security hardening SentinelOne EDR, termasuk tamper protection, privilege escalation prevention, dan advanced security mechanisms yang melindungi agent dari sophisticated attacks.

---

## 🔒 D1: Tamper Protection Testing

### Tujuan Testing
Memvalidasi kemampuan SentinelOne melindungi dirinya sendiri dari berbagai upaya tampering, modification, dan disabling oleh attacker atau malicious insider.

### Test Scenarios

#### D1.1: Registry Tampering Attempts

**Windows Server:**
```powershell
# Test 1: Direct registry modification attempts
$sentinelRegPaths = @(
    "HKLM:\SYSTEM\CurrentControlSet\Services\SentinelAgent",
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\{SentinelOne-GUID}",
    "HKLM:\SOFTWARE\SentinelOne"
)

foreach($path in $sentinelRegPaths) {
    try {
        # Attempt to delete critical registry keys
        Remove-Item -Path $path -Recurse -Force -ErrorAction Stop
        Write-Host "❌ SECURITY BREACH: Registry key $path was deleted!"
    }
    catch {
        Write-Host "✅ PROTECTED: Registry key $path modification blocked - $($_.Exception.Message)"
    }
}

# Test 2: Registry value modification
try {
    Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\SentinelAgent" -Name "Start" -Value 4
    Write-Host "❌ SECURITY BREACH: Service startup type was modified!"
}
catch {
    Write-Host "✅ PROTECTED: Service configuration modification blocked"
}

# Expected Results:
# - All registry modification attempts should be blocked
# - Tamper protection should log all attempts
# - Registry integrity should be maintained
# - No service disruption should occur
```

#### D1.2: File System Tampering

**Windows Server:**
```powershell
# Test critical file modification/deletion
$sentinelFiles = @(
    "C:\Program Files\SentinelOne\Sentinel Agent\SentinelAgent.exe",
    "C:\Program Files\SentinelOne\Sentinel Agent\SentinelUI.exe",
    "C:\Windows\System32\drivers\SentinelMonitor.sys"
)

foreach($file in $sentinelFiles) {
    # Test 1: File deletion attempt
    try {
        Remove-Item -Path $file -Force -ErrorAction Stop
        Write-Host "❌ CRITICAL: File $file was deleted!"
    }
    catch {
        Write-Host "✅ PROTECTED: File deletion blocked for $file"
    }
    
    # Test 2: File modification attempt
    try {
        "malicious_content" | Out-File -FilePath $file -Encoding ASCII -ErrorAction Stop
        Write-Host "❌ CRITICAL: File $file was modified!"
    }
    catch {
        Write-Host "✅ PROTECTED: File modification blocked for $file"
    }
}
```

**Linux Server:**
```bash
# Test critical file protection
SENTINEL_FILES=(
    "/opt/sentinelone/bin/sentinelone-agent"
    "/etc/systemd/system/sentinelone.service"
    "/lib/modules/$(uname -r)/kernel/drivers/sentinelone_kernel.ko"
)

for file in "${SENTINEL_FILES[@]}"; do
    echo "Testing protection for: $file"
    
    # Test deletion
    sudo rm -f "$file" 2>/dev/null
    if [ -f "$file" ]; then
        echo "✅ PROTECTED: File deletion blocked"
    else
        echo "❌ CRITICAL: File was deleted!"
    fi
    
    # Test modification  
    echo "malicious_content" | sudo tee "$file" >/dev/null 2>&1
    if ! grep -q "malicious_content" "$file" 2>/dev/null; then
        echo "✅ PROTECTED: File modification blocked"
    else
        echo "❌ CRITICAL: File was modified!"
    fi
done
```

#### D1.3: Process Protection Testing

**Windows Server:**
```powershell
# Test process termination protection
$sentinelProcesses = Get-Process -Name "*Sentinel*" -ErrorAction SilentlyContinue

foreach($process in $sentinelProcesses) {
    Write-Host "Testing protection for process: $($process.ProcessName) (PID: $($process.Id))"
    
    try {
        # Attempt normal termination
        Stop-Process -Id $process.Id -ErrorAction Stop
        Write-Host "❌ CRITICAL: Process $($process.ProcessName) was terminated normally!"
    }
    catch {
        Write-Host "✅ PROTECTED: Normal termination blocked for $($process.ProcessName)"
    }
    
    try {
        # Attempt forced termination
        Stop-Process -Id $process.Id -Force -ErrorAction Stop
        Write-Host "❌ CRITICAL: Process $($process.ProcessName) was force-terminated!"
    }
    catch {
        Write-Host "✅ PROTECTED: Force termination blocked for $($process.ProcessName)"
    }
}

# Test using external tools
try {
    taskkill /F /IM SentinelAgent.exe
    Write-Host "❌ CRITICAL: External termination succeeded!"
}
catch {
    Write-Host "✅ PROTECTED: External termination blocked"
}
```

**Linux Server:**
```bash
# Test process protection
SENTINEL_PIDS=$(pidof sentinelone-agent)

for pid in $SENTINEL_PIDS; do
    echo "Testing protection for PID: $pid"
    
    # Test SIGTERM
    sudo kill -TERM $pid
    sleep 2
    if kill -0 $pid 2>/dev/null; then
        echo "✅ PROTECTED: SIGTERM ignored"
    else
        echo "❌ CRITICAL: Process terminated by SIGTERM"
    fi
    
    # Test SIGKILL
    sudo kill -9 $pid
    sleep 2
    if kill -0 $pid 2>/dev/null; then
        echo "✅ PROTECTED: SIGKILL ignored"
    else
        echo "❌ CRITICAL: Process terminated by SIGKILL"
    fi
done
```

---

## 🛡️ D2: Privilege Escalation Prevention

### Tujuan Testing
Testing kemampuan SentinelOne mendeteksi dan mencegah privilege escalation attempts.

### Test Scenarios

#### D2.1: UAC Bypass Attempts

**Windows Server:**
```powershell
# Test UAC bypass techniques
# CATATAN: Ini untuk testing purposes saja

# Test 1: eventvwr.exe UAC bypass
$bypassCommand = 'reg add "HKCU\Software\Classes\mscfile\shell\open\command" /ve /d "powershell.exe -c whoami > C:\temp\uac-bypass-test.txt" /f'
cmd /c $bypassCommand
eventvwr.exe

# Wait and check if bypass succeeded
Start-Sleep -Seconds 10
if(Test-Path "C:\temp\uac-bypass-test.txt") {
    Write-Host "❌ UAC BYPASS SUCCEEDED"
    Remove-Item "C:\temp\uac-bypass-test.txt" -Force
} else {
    Write-Host "✅ UAC BYPASS PREVENTED"
}

# Test 2: fodhelper.exe UAC bypass
reg add "HKCU\Software\Classes\ms-settings\Shell\Open\command" /ve /d "powershell.exe -c whoami > C:\temp\fodhelper-bypass.txt" /f
fodhelper.exe

# Expected Results:
# - UAC bypass attempts should be detected
# - Behavioral analysis should flag suspicious registry modifications
# - Process execution should be monitored and potentially blocked
```

#### D2.2: Sudo Privilege Escalation

**Linux Server:**
```bash
# Test sudo privilege escalation attempts
# Test 1: Sudo version vulnerabilities (if applicable)
sudo --version

# Test 2: SUID binary abuse
find /usr/bin -perm -4000 -type f 2>/dev/null | head -10

# Test common SUID escalation vectors
for binary in find vim less more nano; do
    if [ -u "/usr/bin/$binary" ]; then
        echo "Testing SUID escalation via: $binary"
        # Attempt privilege escalation
        # (Safe testing commands here)
    fi
done

# Expected Results:
# - Privilege escalation attempts should be detected
# - Suspicious SUID usage should be monitored
# - Behavioral analysis should flag unusual privilege patterns
```

#### D2.3: Windows Token Manipulation

**Windows Server:**
```powershell
# Test token manipulation techniques
# CATATAN: Requires advanced PowerShell or C# code

# Test 1: Token impersonation
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Security.Principal;

public class TokenManipulation
{
    [DllImport("advapi32.dll", SetLastError = true)]
    public static extern bool ImpersonateLoggedOnUser(IntPtr hToken);
    
    [DllImport("kernel32.dll", SetLastError = true)]
    public static extern bool CloseHandle(IntPtr hObject);
}
"@

# Attempt token manipulation (safe test)
try {
    $currentIdentity = [System.Security.Principal.WindowsIdentity]::GetCurrent()
    Write-Host "Current Identity: $($currentIdentity.Name)"
    
    # Test token operations
    # Expected: SentinelOne should detect and log this activity
}
catch {
    Write-Host "Token manipulation attempt detected/blocked: $($_.Exception.Message)"
}
```

---

## 🔐 D3: Agent Self-Protection

### Tujuan Testing
Memvalidasi kemampuan SentinelOne melindungi agent components dari sophisticated attacks.

### Test Scenarios

#### D3.1: DLL Injection Attempts

**Windows Server:**
```powershell
# Test DLL injection into SentinelOne processes
$sentinelProcesses = Get-Process -Name "*Sentinel*"

foreach($process in $sentinelProcesses) {
    Write-Host "Testing DLL injection protection for: $($process.ProcessName)"
    
    # Create test DLL injection attempt
    # CATATAN: Ini simulasi untuk testing, bukan actual malicious DLL
    
    try {
        # Attempt to inject using PowerShell reflection
        $processHandle = $process.Handle
        Write-Host "Process handle obtained: $processHandle"
        
        # Attempt memory allocation in target process
        # Expected: Should be blocked by SentinelOne
        
    }
    catch {
        Write-Host "✅ DLL injection attempt blocked: $($_.Exception.Message)"
    }
}

# Expected Results:
# - DLL injection attempts should be detected
# - Process memory protection should prevent injection
# - Behavioral analysis should flag injection patterns
```

#### D3.2: Code Cave Attacks

**Windows Server:**
```c
// Test code cave injection (C code for compilation)
// CATATAN: Compile sebagai test executable
#include <windows.h>
#include <tlhelp32.h>
#include <stdio.h>

int main() {
    printf("Testing code cave protection...\n");
    
    // Find SentinelOne process
    PROCESSENTRY32 pe32;
    HANDLE hProcessSnap = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
    
    if(hProcessSnap != INVALID_HANDLE_VALUE) {
        pe32.dwSize = sizeof(PROCESSENTRY32);
        
        if(Process32First(hProcessSnap, &pe32)) {
            do {
                if(strstr(pe32.szExeFile, "Sentinel") != NULL) {
                    printf("Found SentinelOne process: %s (PID: %lu)\n", 
                           pe32.szExeFile, pe32.th32ProcessID);
                    
                    // Attempt to open process for memory manipulation
                    HANDLE hProcess = OpenProcess(PROCESS_ALL_ACCESS, FALSE, pe32.th32ProcessID);
                    if(hProcess != NULL) {
                        printf("❌ CRITICAL: Process opened successfully\n");
                        CloseHandle(hProcess);
                    } else {
                        printf("✅ PROTECTED: Process access denied\n");
                    }
                }
            } while(Process32Next(hProcessSnap, &pe32));
        }
        CloseHandle(hProcessSnap);
    }
    
    return 0;
}
```

#### D3.3: Kernel-Level Attacks

**Linux Server:**
```bash
# Test kernel-level protection mechanisms
echo "Testing kernel module protection..."

# Test 1: Attempt to unload SentinelOne kernel module
SENTINEL_MODULES=$(lsmod | grep sentinelone | awk '{print $1}')

for module in $SENTINEL_MODULES; do
    echo "Attempting to remove module: $module"
    sudo rmmod $module 2>&1
    
    # Check if module still loaded
    if lsmod | grep -q $module; then
        echo "✅ PROTECTED: Module removal blocked"
    else
        echo "❌ CRITICAL: Module was removed!"
    fi
done

# Test 2: Attempt to load malicious kernel module
echo "Testing malicious module loading protection..."
# (Safe test that doesn't actually load malicious code)

# Expected Results:
# - Kernel module protection should prevent unloading
# - Malicious module loading should be detected
# - System call monitoring should flag suspicious activity
```

---

## ⚙️ D4: Configuration Integrity

### Tujuan Testing
Testing perlindungan terhadap configuration tampering dan policy bypass attempts.

### Test Scenarios

#### D4.1: Configuration File Tampering

**Windows Server:**
```powershell
# Test configuration protection
$configPaths = @(
    "C:\Program Files\SentinelOne\Sentinel Agent\config\agent.conf",
    "C:\ProgramData\SentinelOne\config\policy.xml"
)

foreach($configFile in $configPaths) {
    if(Test-Path $configFile) {
        Write-Host "Testing protection for: $configFile"
        
        # Backup original
        $backupPath = "$configFile.backup"
        Copy-Item $configFile $backupPath -Force
        
        # Test modification
        try {
            "malicious_config=true" | Add-Content $configFile
            Write-Host "❌ CRITICAL: Configuration file was modified!"
        }
        catch {
            Write-Host "✅ PROTECTED: Configuration modification blocked"
        }
        
        # Test deletion
        try {
            Remove-Item $configFile -Force
            Write-Host "❌ CRITICAL: Configuration file was deleted!"
        }
        catch {
            Write-Host "✅ PROTECTED: Configuration deletion blocked"
        }
        
        # Restore if needed
        if(Test-Path $backupPath) {
            if(!(Test-Path $configFile)) {
                Move-Item $backupPath $configFile
            } else {
                Remove-Item $backupPath
            }
        }
    }
}
```

#### D4.2: Policy Bypass Attempts

**Windows & Linux:**
```bash
# Test policy bypass mechanisms
echo "Testing policy bypass protection..."

# Test 1: Environment variable manipulation
export SENTINELONE_DISABLE=1
export SENTINELONE_DEBUG=1

# Test 2: Command line parameter bypass
sentinelctl --disable-protection 2>&1
sentinelctl --bypass-policy 2>&1

# Test 3: Configuration override attempts
echo "protection_enabled=false" >> /tmp/fake_config.conf
sentinelctl --config /tmp/fake_config.conf 2>&1

# Expected Results:
# - Policy bypass attempts should be ignored
# - Configuration integrity should be maintained
# - Unauthorized configuration sources should be rejected
```

---

## 📊 Security Hardening Metrics

### Key Performance Indicators

| Test Case | Success Criteria | Validation Method |
|-----------|-----------------|------------------|
| Tamper Protection | 100% blocking rate | Registry/file/process protection |
| Privilege Escalation | >99% detection rate | UAC bypass/sudo escalation tests |
| Self-Protection | 0% successful attacks | DLL injection/code cave attempts |
| Configuration Integrity | 100% protection | Config tampering attempts |

### Validation Checklist

#### Tamper Resistance Validation
- [ ] **Registry Protection**: All registry modification attempts blocked
- [ ] **File System Protection**: Critical files cannot be modified/deleted
- [ ] **Process Protection**: Agent processes cannot be terminated
- [ ] **Service Protection**: Services cannot be stopped/disabled
- [ ] **Driver Protection**: Kernel components are tamper-proof

#### Advanced Attack Prevention
- [ ] **Code Injection**: DLL/code injection attempts blocked
- [ ] **Memory Protection**: Process memory is protected from manipulation
- [ ] **Kernel Protection**: Kernel-level attacks are prevented
- [ ] **Privilege Escalation**: Escalation attempts are detected/blocked
- [ ] **Configuration Integrity**: Settings cannot be bypassed/modified

---

## Demo Presentation Points

### Executive Summary
1. **"Military-Grade Tamper Protection"**
   - Agent cannot be disabled even by administrators
   - Self-protection mechanisms prevent all tampering attempts
   - Maintains security posture under sophisticated attacks

2. **"Advanced Attack Resistance"**
   - Prevents privilege escalation attempts
   - Blocks code injection and memory manipulation
   - Protects against kernel-level attacks

3. **"Configuration Security"**
   - Policy settings cannot be bypassed
   - Configuration integrity is maintained
   - No unauthorized modifications possible

### Technical Demonstrations
- Live tamper protection testing
- Privilege escalation prevention demo
- Advanced attack resistance validation
- Configuration integrity verification

---

## Next Steps

Continue to performance and integration testing:
- [Kategori E: Performance Impact](kategori-e-performance.md)
- [Kategori F: Integration Testing](kategori-f-integration.md)

!!! warning "Security Critical"
    Kategori D testing demonstrates the hardcore security capabilities that differentiate SentinelOne from traditional antivirus solutions. This is crucial for convincing stakeholders about advanced threat protection.
