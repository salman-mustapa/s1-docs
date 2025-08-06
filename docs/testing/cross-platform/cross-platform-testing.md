# Cross-Platform Testing Scenarios

## Overview
Dokumentasi testing scenarios yang melibatkan multiple platform (Windows & Linux) untuk memvalidasi konsistensi protection, management, dan integration SentinelOne EDR dalam mixed environment enterprise.

---

## 🏢 Mixed Environment Architecture

### Typical Enterprise Scenarios
- **Hybrid Infrastructure**: Windows Domain Controllers + Linux Web/DB servers
- **DevOps Environment**: Linux development servers + Windows workstations  
- **Multi-tier Applications**: Windows frontend + Linux backend services
- **Container Orchestration**: Linux Kubernetes + Windows worker nodes
- **Legacy Systems**: Mixed Windows/Linux server environments

### Testing Scope
- **Policy Consistency** across platforms
- **Centralized Management** effectiveness
- **Cross-platform Communication** security
- **Incident Response** coordination
- **Performance Impact** comparison

---

## 🔐 Cross-Platform Security Testing

### Unified Policy Enforcement

#### Policy Consistency Validation
```bash
#!/bin/bash
echo "=== CROSS-PLATFORM POLICY CONSISTENCY TESTING ==="

# This script should be run on both Windows (via Git Bash/WSL) and Linux

# Define test parameters
TEST_ID="CROSS_PLATFORM_$(date +%Y%m%d_%H%M%S)"
PLATFORM=$(uname -s)

echo "Platform: $PLATFORM"
echo "Test ID: $TEST_ID"

# Function to get SentinelOne policy info
get_policy_info() {
    echo "Getting SentinelOne policy information..."
    
    if [[ "$PLATFORM" == *"NT"* ]] || [[ "$PLATFORM" == *"MSYS"* ]] || [[ "$PLATFORM" == *"Windows"* ]]; then
        # Windows
        sentinelctl.exe status | grep -i policy
        sentinelctl.exe policy list 2>/dev/null || echo "Policy list not available"
    else
        # Linux
        sudo /opt/sentinelone/bin/sentinelctl status | grep -i policy
        sudo /opt/sentinelone/bin/sentinelctl policy list 2>/dev/null || echo "Policy list not available"
    fi
}

# Function to test EICAR detection
test_eicar_detection() {
    echo "Testing EICAR detection consistency..."
    
    EICAR_STRING='X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*'
    TEST_FILE="/tmp/cross_platform_eicar_${TEST_ID}.txt"
    
    # Create EICAR file
    echo "$EICAR_STRING" > "$TEST_FILE"
    
    # Measure detection time
    START_TIME=$(date +%s)
    
    # Wait for detection (max 30 seconds)
    for i in {1..30}; do
        if [ ! -f "$TEST_FILE" ]; then
            END_TIME=$(date +%s)
            DETECTION_TIME=$((END_TIME - START_TIME))
            echo "✅ EICAR detected and quarantined in ${DETECTION_TIME}s on $PLATFORM"
            return 0
        fi
        sleep 1
    done
    
    echo "❌ EICAR not detected within 30 seconds on $PLATFORM"
    rm -f "$TEST_FILE" 2>/dev/null
    return 1
}

# Function to test behavior monitoring
test_behavior_monitoring() {
    echo "Testing behavioral monitoring..."
    
    # Create suspicious process behavior
    SUSPICIOUS_SCRIPT="/tmp/suspicious_${TEST_ID}.sh"
    
    cat > "$SUSPICIOUS_SCRIPT" << 'EOF'
#!/bin/bash
# Suspicious activity simulation
whoami
id
ps aux | head -10
netstat -an | head -5
EOF
    
    chmod +x "$SUSPICIOUS_SCRIPT"
    
    echo "Executing suspicious script..."
    "$SUSPICIOUS_SCRIPT"
    
    # Clean up
    rm -f "$SUSPICIOUS_SCRIPT"
    
    echo "✅ Behavioral monitoring test completed on $PLATFORM"
}

# Execute tests
echo "Starting cross-platform consistency tests..."

get_policy_info
echo "---"

test_eicar_detection
echo "---"

test_behavior_monitoring
echo "---"

echo "Cross-platform testing completed for $PLATFORM"
```

#### PowerShell Cross-Platform Testing
```powershell
# Cross-platform PowerShell testing (works on Windows/Linux with PowerShell Core)
param(
    [string]$TestId = "CROSS_PS_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
)

Write-Host "=== CROSS-PLATFORM POWERSHELL TESTING ===" -ForegroundColor Cyan
Write-Host "Platform: $($PSVersionTable.Platform)" -ForegroundColor Yellow
Write-Host "PowerShell Version: $($PSVersionTable.PSVersion)" -ForegroundColor Yellow

# Function to get OS-specific SentinelOne path
function Get-SentinelPath {
    if ($IsWindows -or $PSVersionTable.PSVersion.Major -lt 6) {
        return "C:\Program Files\SentinelOne\Sentinel Agent\sentinelctl.exe"
    } else {
        return "/opt/sentinelone/bin/sentinelctl"
    }
}

# Function to test SentinelOne status across platforms
function Test-SentinelStatus {
    Write-Host "Testing SentinelOne status..." -ForegroundColor Yellow
    
    $sentinelPath = Get-SentinelPath
    
    if (Test-Path $sentinelPath) {
        try {
            if ($IsWindows -or $PSVersionTable.PSVersion.Major -lt 6) {
                $status = & $sentinelPath status
            } else {
                $status = sudo $sentinelPath status
            }
            
            Write-Host "✅ SentinelOne status retrieved successfully" -ForegroundColor Green
            $status | Select-String "Agent.*Connected|Status.*Protected" | Write-Host
        }
        catch {
            Write-Host "❌ Failed to get SentinelOne status: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ SentinelOne binary not found at: $sentinelPath" -ForegroundColor Red
    }
}

# Function to test cross-platform file operations
function Test-CrossPlatformFileOps {
    Write-Host "Testing cross-platform file operations..." -ForegroundColor Yellow
    
    $testDir = if ($IsWindows -or $PSVersionTable.PSVersion.Major -lt 6) { "C:\temp" } else { "/tmp" }
    $testFile = Join-Path $testDir "cross_platform_test_$TestId.txt"
    
    try {
        # Create test file
        "Cross-platform test content - $(Get-Date)" | Out-File -FilePath $testFile -Encoding UTF8
        
        if (Test-Path $testFile) {
            Write-Host "✅ File created successfully: $testFile" -ForegroundColor Green
            
            # Test file access
            $content = Get-Content $testFile
            Write-Host "File content: $content" -ForegroundColor Gray
            
            # Clean up
            Remove-Item $testFile -Force
            Write-Host "✅ File cleanup completed" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "❌ File operation failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Function to test network connectivity
function Test-NetworkConnectivity {
    Write-Host "Testing network connectivity..." -ForegroundColor Yellow
    
    $testHosts = @("8.8.8.8", "google.com", "github.com")
    
    foreach ($host in $testHosts) {
        try {
            $result = Test-Connection -ComputerName $host -Count 1 -Quiet
            if ($result) {
                Write-Host "✅ Connectivity to $host: OK" -ForegroundColor Green
            } else {
                Write-Host "❌ Connectivity to $host: FAILED" -ForegroundColor Red
            }
        }
        catch {
            Write-Host "❌ Network test to $host failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Execute tests
Write-Host "Starting cross-platform PowerShell tests..." -ForegroundColor Cyan

Test-SentinelStatus
Write-Host "---"

Test-CrossPlatformFileOps  
Write-Host "---"

Test-NetworkConnectivity
Write-Host "---"

Write-Host "Cross-platform PowerShell testing completed" -ForegroundColor Cyan
```

---

## 🌐 Multi-Platform Attack Scenarios

### Coordinated Attack Simulation

#### Windows-to-Linux Lateral Movement
```bash
#!/bin/bash
echo "=== WINDOWS-TO-LINUX LATERAL MOVEMENT TESTING ==="

# Simulate lateral movement from compromised Windows box to Linux server
# This tests SentinelOne's ability to detect cross-platform attack chains

# Phase 1: Simulate Windows compromise indicators
echo "Phase 1: Simulating Windows compromise indicators..."

# Create fake Windows-style artifacts on Linux (for testing)
WINDOWS_ARTIFACTS_DIR="/tmp/windows_artifacts"
mkdir -p "$WINDOWS_ARTIFACTS_DIR"

# Simulate stolen credentials file
cat > "$WINDOWS_ARTIFACTS_DIR/credentials.txt" << 'EOF'
# Simulated stolen credentials (for testing only)
domain\administrator:P@ssw0rd123
domain\sqlservice:ServiceAccount1
linuxuser:ubuntu123
EOF

# Simulate network enumeration from Windows
echo "Phase 2: Network enumeration simulation..."

# Test if SentinelOne detects network scanning
nmap -sT localhost 2>/dev/null | head -10

# Simulate SSH brute force (safe simulation)
echo "Phase 3: SSH access attempt simulation..."

# Create script that simulates SSH login attempts
cat > "$WINDOWS_ARTIFACTS_DIR/ssh_attack.sh" << 'EOF'
#!/bin/bash
# Simulated SSH brute force (doesn't actually connect)
echo "Simulating SSH login attempts..."
for user in admin root administrator; do
    echo "Attempting SSH connection as $user..."
    # Simulate failed attempt (don't actually connect)
    ssh -o ConnectTimeout=1 -o BatchMode=yes "$user@127.0.0.1" echo "test" 2>/dev/null || true
    sleep 1
done
EOF

chmod +x "$WINDOWS_ARTIFACTS_DIR/ssh_attack.sh"
"$WINDOWS_ARTIFACTS_DIR/ssh_attack.sh"

# Phase 4: Simulate privilege escalation attempt
echo "Phase 4: Privilege escalation simulation..."

# Test various escalation techniques (safely)
echo "Testing sudo enumeration..."
sudo -l 2>/dev/null || echo "Sudo enumeration blocked or not available"

# Test SUID binary enumeration
echo "SUID binary enumeration:"
find /usr/bin -perm -4000 -type f 2>/dev/null | head -5

# Phase 5: Simulate persistence attempt  
echo "Phase 5: Persistence mechanism simulation..."

# Try to modify system startup scripts
PERSISTENCE_TEST_FILE="/etc/cron.d/malicious_cron"
echo "# Malicious cron job (test)" > "$PERSISTENCE_TEST_FILE" 2>/dev/null

if [ -f "$PERSISTENCE_TEST_FILE" ]; then
    echo "❌ Persistence mechanism created - SECURITY RISK!"
    rm -f "$PERSISTENCE_TEST_FILE"
else
    echo "✅ Persistence mechanism blocked"
fi

# Cleanup
rm -rf "$WINDOWS_ARTIFACTS_DIR"

echo "Lateral movement simulation completed"
```

#### Linux-to-Windows Pivot Simulation
```powershell
# Simulate Linux-to-Windows pivot attack
Write-Host "=== LINUX-TO-WINDOWS PIVOT SIMULATION ===" -ForegroundColor Cyan

# Phase 1: Simulate Linux server compromise
Write-Host "Phase 1: Simulating Linux server compromise indicators..." -ForegroundColor Yellow

# Create fake Linux artifacts (for testing on Windows)
$linuxArtifactsPath = "C:\temp\linux_artifacts"
if (!(Test-Path $linuxArtifactsPath)) {
    New-Item -ItemType Directory -Path $linuxArtifactsPath -Force
}

# Simulate stolen SSH keys
$fakeSSHKey = @"
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA7tFakeKeyContentForTestingOnly...
(This is a fake SSH key for testing purposes)
-----END RSA PRIVATE KEY-----
"@

$fakeSSHKey | Out-File "$linuxArtifactsPath\id_rsa_stolen" -Encoding ASCII

# Phase 2: Network enumeration from compromised Linux box
Write-Host "Phase 2: Network enumeration simulation..." -ForegroundColor Yellow

# Simulate network discovery
$networkTargets = @("127.0.0.1", "localhost")
foreach ($target in $networkTargets) {
    Write-Host "Scanning target: $target"
    Test-NetConnection -ComputerName $target -Port 3389 -InformationLevel Quiet
    Test-NetConnection -ComputerName $target -Port 445 -InformationLevel Quiet
}

# Phase 3: Simulate credential stuffing
Write-Host "Phase 3: Credential stuffing simulation..." -ForegroundColor Yellow

# Test with obviously fake credentials (won't actually authenticate)
$fakeCredentials = @(
    @{User="administrator"; Pass="password123"},
    @{User="admin"; Pass="admin123"},
    @{User="guest"; Pass="guest"}
)

foreach ($cred in $fakeCredentials) {
    Write-Host "Testing credential: $($cred.User)"
    # Don't actually attempt authentication, just simulate the attempt
    try {
        # This will fail safely without causing actual authentication attempts
        $securePass = ConvertTo-SecureString $cred.Pass -AsPlainText -Force
        $testCred = New-Object System.Management.Automation.PSCredential($cred.User, $securePass)
        # Don't actually use the credential, just create it for testing
        Write-Host "Credential object created for testing"
    }
    catch {
        Write-Host "✅ Credential creation blocked or failed safely"
    }
}

# Phase 4: Simulate Windows-specific attack techniques
Write-Host "Phase 4: Windows-specific attack simulation..." -ForegroundColor Yellow

# Test registry enumeration
try {
    Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion" -Name "ProductName" | Out-Null
    Write-Host "Registry access successful"
}
catch {
    Write-Host "❌ Registry access blocked"
}

# Test WMI enumeration
try {
    Get-WmiObject -Class Win32_OperatingSystem | Select-Object Caption | Out-Null
    Write-Host "WMI access successful"
}
catch {
    Write-Host "❌ WMI access blocked or restricted"
}

# Phase 5: Simulate persistence attempts
Write-Host "Phase 5: Persistence mechanism testing..." -ForegroundColor Yellow

# Test registry persistence
try {
    $regPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"
    Set-ItemProperty -Path $regPath -Name "TestPersistence" -Value "cmd.exe /c echo test" -ErrorAction Stop
    
    # Check if it was set
    $testValue = Get-ItemProperty -Path $regPath -Name "TestPersistence" -ErrorAction SilentlyContinue
    if ($testValue) {
        Write-Host "❌ Registry persistence created - SECURITY RISK!"
        Remove-ItemProperty -Path $regPath -Name "TestPersistence" -ErrorAction SilentlyContinue
    }
}
catch {
    Write-Host "✅ Registry persistence blocked"
}

# Test scheduled task persistence
try {
    $taskName = "TestPersistenceTask"
    $action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c echo test"
    $trigger = New-ScheduledTaskTrigger -Daily -At "12:00AM"
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -ErrorAction Stop
    
    # Check if task was created
    $task = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
    if ($task) {
        Write-Host "❌ Scheduled task persistence created - SECURITY RISK!"
        Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue
    }
}
catch {
    Write-Host "✅ Scheduled task persistence blocked"
}

# Cleanup
Remove-Item -Path $linuxArtifactsPath -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Linux-to-Windows pivot simulation completed" -ForegroundColor Cyan
```

---

## 📊 Cross-Platform Performance Comparison

### Unified Performance Monitoring
```python
#!/usr/bin/env python3
"""
Cross-Platform SentinelOne Performance Monitoring
Requires: psutil (pip install psutil)
"""

import psutil
import platform
import time
import json
import subprocess
import os
from datetime import datetime

class CrossPlatformMonitor:
    def __init__(self):
        self.platform = platform.system()
        self.hostname = platform.node()
        self.start_time = datetime.now()
        
    def get_sentinelone_processes(self):
        """Find all SentinelOne processes across platforms"""
        sentinel_processes = []
        
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_info', 'create_time']):
            try:
                if 'sentinel' in proc.info['name'].lower():
                    sentinel_processes.append({
                        'pid': proc.info['pid'],
                        'name': proc.info['name'],
                        'cpu_percent': proc.info['cpu_percent'],
                        'memory_mb': proc.info['memory_info'].rss / 1024 / 1024,
                        'create_time': proc.info['create_time']
                    })
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
                
        return sentinel_processes
    
    def get_system_metrics(self):
        """Get cross-platform system metrics"""
        return {
            'cpu_percent': psutil.cpu_percent(interval=1),
            'memory_percent': psutil.virtual_memory().percent,
            'memory_available_mb': psutil.virtual_memory().available / 1024 / 1024,
            'disk_usage_percent': psutil.disk_usage('/').percent if self.platform != 'Windows' else psutil.disk_usage('C:').percent,
            'boot_time': psutil.boot_time(),
            'load_average': os.getloadavg() if hasattr(os, 'getloadavg') else None
        }
    
    def get_network_stats(self):
        """Get network statistics"""
        net_io = psutil.net_io_counters()
        return {
            'bytes_sent': net_io.bytes_sent,
            'bytes_recv': net_io.bytes_recv,
            'packets_sent': net_io.packets_sent,
            'packets_recv': net_io.packets_recv
        }
    
    def run_eicar_test(self):
        """Run EICAR test and measure detection time"""
        eicar_string = 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*'
        test_file = f"/tmp/eicar_test_{int(time.time())}.txt" if self.platform != 'Windows' else f"C:\\temp\\eicar_test_{int(time.time())}.txt"
        
        try:
            # Create EICAR file
            start_time = time.time()
            with open(test_file, 'w') as f:
                f.write(eicar_string)
            
            # Wait for detection (max 30 seconds)
            for i in range(30):
                if not os.path.exists(test_file):
                    detection_time = time.time() - start_time
                    return {
                        'detected': True,
                        'detection_time': detection_time,
                        'status': 'SUCCESS'
                    }
                time.sleep(1)
            
            # Clean up if not detected
            if os.path.exists(test_file):
                os.remove(test_file)
            
            return {
                'detected': False,
                'detection_time': 30,
                'status': 'TIMEOUT'
            }
            
        except Exception as e:
            return {
                'detected': False,
                'detection_time': 0,
                'status': f'ERROR: {str(e)}'
            }
    
    def generate_report(self, duration_minutes=5):
        """Generate comprehensive cross-platform report"""
        print(f"=== CROSS-PLATFORM SENTINELONE MONITORING ===")
        print(f"Platform: {self.platform}")
        print(f"Hostname: {self.hostname}")
        print(f"Start Time: {self.start_time}")
        print()
        
        # Initial metrics
        print("=== INITIAL SYSTEM STATE ===")
        system_metrics = self.get_system_metrics()
        print(f"CPU Usage: {system_metrics['cpu_percent']}%")
        print(f"Memory Usage: {system_metrics['memory_percent']}%")
        print(f"Available Memory: {system_metrics['memory_available_mb']:.1f} MB")
        print()
        
        # SentinelOne processes
        print("=== SENTINELONE PROCESSES ===")
        sentinel_procs = self.get_sentinelone_processes()
        if sentinel_procs:
            total_memory = sum(proc['memory_mb'] for proc in sentinel_procs)
            print(f"Found {len(sentinel_procs)} SentinelOne processes")
            print(f"Total Memory Usage: {total_memory:.1f} MB")
            for proc in sentinel_procs:
                print(f"  PID {proc['pid']}: {proc['name']} - {proc['memory_mb']:.1f} MB")
        else:
            print("No SentinelOne processes found")
        print()
        
        # EICAR test
        print("=== EICAR DETECTION TEST ===")
        eicar_result = self.run_eicar_test()
        print(f"Detection Result: {eicar_result['status']}")
        if eicar_result['detected']:
            print(f"Detection Time: {eicar_result['detection_time']:.2f} seconds")
        print()
        
        # Performance monitoring
        print("=== PERFORMANCE MONITORING ===")
        print(f"Monitoring for {duration_minutes} minutes...")
        
        metrics_history = []
        samples = duration_minutes * 2  # Sample every 30 seconds
        
        for i in range(samples):
            sample_metrics = {
                'timestamp': time.time(),
                'system': self.get_system_metrics(),
                'sentinelone': self.get_sentinelone_processes(),
                'network': self.get_network_stats()
            }
            metrics_history.append(sample_metrics)
            
            if i % 4 == 0:  # Print every 2 minutes
                print(f"  Sample {i+1}/{samples}: CPU {sample_metrics['system']['cpu_percent']:.1f}%, "
                      f"Memory {sample_metrics['system']['memory_percent']:.1f}%")
            
            time.sleep(30)
        
        # Final analysis
        print("\n=== FINAL ANALYSIS ===")
        if metrics_history:
            avg_cpu = sum(m['system']['cpu_percent'] for m in metrics_history) / len(metrics_history)
            avg_memory = sum(m['system']['memory_percent'] for m in metrics_history) / len(metrics_history)
            
            sentinel_memory_samples = []
            for m in metrics_history:
                if m['sentinelone']:
                    total_mem = sum(proc['memory_mb'] for proc in m['sentinelone'])
                    sentinel_memory_samples.append(total_mem)
            
            avg_sentinel_memory = sum(sentinel_memory_samples) / len(sentinel_memory_samples) if sentinel_memory_samples else 0
            
            print(f"Average CPU Usage: {avg_cpu:.2f}%")
            print(f"Average Memory Usage: {avg_memory:.2f}%")
            print(f"Average SentinelOne Memory: {avg_sentinel_memory:.2f} MB")
        
        # Generate summary report
        report = {
            'platform': self.platform,
            'hostname': self.hostname,
            'test_duration': duration_minutes,
            'eicar_test': eicar_result,
            'performance_summary': {
                'avg_cpu_percent': avg_cpu if 'avg_cpu' in locals() else 0,
                'avg_memory_percent': avg_memory if 'avg_memory' in locals() else 0,
                'avg_sentinelone_memory_mb': avg_sentinel_memory if 'avg_sentinel_memory' in locals() else 0
            },
            'sentinelone_processes': len(sentinel_procs),
            'timestamp': datetime.now().isoformat()
        }
        
        # Save report
        report_file = f"sentinelone_report_{self.platform.lower()}_{int(time.time())}.json"
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\nDetailed report saved to: {report_file}")
        return report

if __name__ == "__main__":
    monitor = CrossPlatformMonitor()
    monitor.generate_report(duration_minutes=5)
```

---

## 🔄 Integration Consistency Testing

### SIEM Log Format Comparison
```bash
#!/bin/bash
echo "=== CROSS-PLATFORM SIEM LOG FORMAT TESTING ==="

# Test log format consistency across Windows and Linux
PLATFORM=$(uname -s)
TEST_ID="SIEM_$(date +%Y%m%d_%H%M%S)"

echo "Platform: $PLATFORM"
echo "Test ID: $TEST_ID"

# Function to generate test events
generate_test_events() {
    echo "Generating test security events..."
    
    # Create EICAR to generate detection event
    EICAR_STRING='X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*'
    echo "$EICAR_STRING" > "/tmp/siem_test_${TEST_ID}.txt"
    
    # Wait for detection
    sleep 10
    
    # Create suspicious network activity
    nc -z 127.0.0.1 1234 2>/dev/null || true
    
    echo "Test events generated"
}

# Function to check syslog format
check_syslog_format() {
    echo "Checking syslog format..."
    
    # Check common syslog locations
    SYSLOG_FILES=("/var/log/syslog" "/var/log/messages" "/var/log/sentinel*")
    
    for logfile in "${SYSLOG_FILES[@]}"; do
        if [ -f "$logfile" ] || ls $logfile 2>/dev/null; then
            echo "Checking log file: $logfile"
            
            # Look for SentinelOne entries from last 5 minutes
            if [[ "$PLATFORM" == *"Linux"* ]]; then
                tail -100 $logfile 2>/dev/null | grep -i sentinel | head -5
            fi
        fi
    done
}

# Function to check JSON log format
check_json_format() {
    echo "Checking JSON log format..."
    
    # Check for structured JSON logs
    JSON_LOG_PATHS=("/var/log/sentinelone/*.json" "/opt/sentinelone/logs/*.json")
    
    for path in "${JSON_LOG_PATHS[@]}"; do
        if ls $path 2>/dev/null; then
            echo "Found JSON log at: $path"
            
            # Validate JSON format
            for jsonfile in $path; do
                if [ -f "$jsonfile" ]; then
                    echo "Validating JSON format in: $jsonfile"
                    python3 -m json.tool "$jsonfile" >/dev/null 2>&1
                    if [ $? -eq 0 ]; then
                        echo "✅ Valid JSON format"
                    else
                        echo "❌ Invalid JSON format"
                    fi
                fi
            done
        fi
    done
}

# Function to test CEF format
check_cef_format() {
    echo "Checking CEF (Common Event Format) compliance..."
    
    # Look for CEF formatted logs
    # CEF format: CEF:Version|Device Vendor|Device Product|Device Version|Device Event Class ID|Name|Severity|[Extension]
    
    find /var/log -name "*.log" -type f 2>/dev/null | xargs grep -l "CEF:" 2>/dev/null | head -3 | while read ceflog; do
        echo "CEF log found: $ceflog"
        grep "CEF:" "$ceflog" | head -2
    done
}

# Execute tests
echo "Starting SIEM log format consistency tests..."

generate_test_events
echo "---"

check_syslog_format
echo "---"

check_json_format
echo "---"

check_cef_format
echo "---"

echo "SIEM log format testing completed for $PLATFORM"

# Generate format compliance report
cat > "/tmp/siem_format_report_${PLATFORM}_${TEST_ID}.txt" << EOF
SIEM Log Format Compliance Report
Platform: $PLATFORM
Test ID: $TEST_ID
Timestamp: $(date)

Format Compliance:
- Syslog RFC3164: $(check_syslog_format >/dev/null 2>&1 && echo "COMPLIANT" || echo "NOT_DETECTED")
- JSON Format: $(check_json_format >/dev/null 2>&1 && echo "COMPLIANT" || echo "NOT_DETECTED")
- CEF Format: $(check_cef_format >/dev/null 2>&1 && echo "COMPLIANT" || echo "NOT_DETECTED")

Notes:
- Log formats may vary based on SentinelOne configuration
- SIEM integration should be verified in target environment
- Custom log forwarding rules may affect format consistency

EOF

echo "Format compliance report saved to: /tmp/siem_format_report_${PLATFORM}_${TEST_ID}.txt"
```

---

## 📝 Cross-Platform Testing Checklist

### Pre-Demo Environment Setup
- [ ] **Multi-Platform Environment Ready**
  - [ ] Windows Server deployed and configured
  - [ ] Linux Server deployed and configured  
  - [ ] Network connectivity between platforms
  - [ ] Centralized management console accessible
  - [ ] SIEM/logging infrastructure prepared

- [ ] **SentinelOne Deployment Validated**
  - [ ] Agents installed on both platforms
  - [ ] Consistent policy applied across platforms
  - [ ] All agents connected to same management console
  - [ ] Version consistency verified

### Cross-Platform Demo Scenarios
- [ ] **Unified Policy Enforcement**
  - [ ] Same policy applied to Windows and Linux
  - [ ] Consistent EICAR detection timing
  - [ ] Identical threat response behavior
  - [ ] Uniform logging format

- [ ] **Mixed Attack Chain Demo**
  - [ ] Windows-to-Linux lateral movement
  - [ ] Linux-to-Windows privilege escalation
  - [ ] Cross-platform persistence attempts
  - [ ] Coordinated incident response

- [ ] **Management Consistency**
  - [ ] Single pane of glass visibility
  - [ ] Consistent alert handling
  - [ ] Unified policy management
  - [ ] Cross-platform reporting

### Success Metrics
- [ ] **Policy Consistency**: 100% identical enforcement across platforms
- [ ] **Performance Parity**: <5% variance in resource usage between platforms
- [ ] **Detection Consistency**: <1 second variance in threat detection time
- [ ] **Management Efficiency**: Single console manages all platforms effectively
- [ ] **Integration Quality**: Consistent SIEM log formats and API responses

---

## 📊 Executive Summary Template

### Cross-Platform Readiness Assessment

#### Security Posture
- **✅ Unified Protection**: Consistent threat detection across Windows and Linux
- **✅ Policy Enforcement**: Single policy framework for mixed environments
- **✅ Attack Chain Coverage**: Complete visibility across platform boundaries
- **✅ Incident Response**: Coordinated response regardless of platform

#### Operational Efficiency
- **✅ Single Management Console**: Unified visibility and control
- **✅ Consistent Performance**: Minimal platform-specific overhead
- **✅ Integration Ready**: Standardized SIEM and API interfaces
- **✅ Scalability**: Platform-agnostic deployment model

#### Business Value
- **Cost Optimization**: Single solution for multiple platforms
- **Complexity Reduction**: Unified security operations
- **Risk Mitigation**: Comprehensive cross-platform protection
- **Compliance Support**: Consistent audit trails and reporting

---

## Next Steps

Continue with final validation:
- Review all testing categories completeness
- Prepare executive demonstration materials
- Validate testing environment readiness
- Schedule stakeholder presentations

!!! success "Cross-Platform Validation Complete"
    Comprehensive cross-platform testing framework ensures SentinelOne EDR provides consistent, unified protection across mixed Windows/Linux enterprise environments with single-pane-of-glass management and coordinated incident response capabilities.
