# Kategori E: Performance Impact Testing

## Overview
Testing komprehensif dampak performance SentinelOne EDR terhadap sistem server, aplikasi, dan workload production. Validasi bahwa security tidak mengorbankan performance dan availability sistem kritis.

---

## 📊 E1: CPU/Memory Utilization

### Tujuan Testing
Mengukur resource consumption SentinelOne dan dampaknya terhadap overall system performance dalam berbagai kondisi workload.

### Test Scenarios

#### E1.1: Baseline Performance Measurement

**Windows Server:**
```powershell
# Pre-SentinelOne baseline measurement
Write-Host "=== BASELINE PERFORMANCE MEASUREMENT (Before SentinelOne) ==="

# CPU baseline
$cpuBaseline = @()
for($i = 1; $i -le 60; $i++) {
    $cpu = (Get-WmiObject win32_processor | Measure-Object -property LoadPercentage -Average).Average
    $cpuBaseline += $cpu
    Write-Progress -Activity "Measuring CPU baseline" -PercentComplete ($i/60*100)
    Start-Sleep 1
}
$avgCpuBaseline = ($cpuBaseline | Measure-Object -Average).Average

# Memory baseline
$memTotal = (Get-WmiObject -Class Win32_ComputerSystem).TotalPhysicalMemory / 1GB
$memAvailable = (Get-Counter "\Memory\Available MBytes").CounterSamples.CookedValue / 1024
$memUsedBaseline = $memTotal - $memAvailable

Write-Host "CPU Baseline: $([math]::Round($avgCpuBaseline, 2))%"
Write-Host "Memory Baseline: $([math]::Round($memUsedBaseline, 2)) GB / $([math]::Round($memTotal, 2)) GB"

# Save baseline untuk comparison
$baseline = @{
    'CPU' = $avgCpuBaseline
    'Memory' = $memUsedBaseline
    'Timestamp' = Get-Date
}
$baseline | ConvertTo-Json | Out-File "C:\temp\performance_baseline.json"
```

**Linux Server:**
```bash
#!/bin/bash
echo "=== BASELINE PERFORMANCE MEASUREMENT (Before SentinelOne) ==="

# CPU baseline measurement
echo "Measuring CPU baseline for 60 seconds..."
cpu_baseline=0
for i in {1..60}; do
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    cpu_baseline=$(echo "$cpu_baseline + $cpu_usage" | bc)
    sleep 1
done
avg_cpu_baseline=$(echo "scale=2; $cpu_baseline / 60" | bc)

# Memory baseline
mem_total=$(free -g | awk '/^Mem:/{print $2}')
mem_used_baseline=$(free -g | awk '/^Mem:/{print $3}')
mem_available=$(free -g | awk '/^Mem:/{print $7}')

echo "CPU Baseline: ${avg_cpu_baseline}%"
echo "Memory Baseline: ${mem_used_baseline} GB / ${mem_total} GB"

# Save baseline
cat > /tmp/performance_baseline.json << EOF
{
    "cpu": $avg_cpu_baseline,
    "memory_used": $mem_used_baseline,
    "memory_total": $mem_total,
    "timestamp": "$(date -Iseconds)"
}
EOF
```

#### E1.2: SentinelOne Resource Consumption

**Windows Server:**
```powershell
# Measure SentinelOne specific resource usage
Write-Host "=== SENTINELONE RESOURCE CONSUMPTION ==="

# Get all SentinelOne processes
$sentinelProcesses = Get-Process -Name "*Sentinel*" -ErrorAction SilentlyContinue

if($sentinelProcesses) {
    Write-Host "SentinelOne Processes Found:"
    
    $totalCpu = 0
    $totalMemory = 0
    
    foreach($process in $sentinelProcesses) {
        $cpu = $process.CPU
        $memory = [math]::Round($process.WorkingSet / 1MB, 2)
        
        Write-Host "- $($process.ProcessName): CPU=$cpu, Memory=$memory MB"
        
        $totalMemory += $memory
        if($cpu) { $totalCpu += $cpu }
    }
    
    Write-Host "Total SentinelOne Resource Usage:"
    Write-Host "- CPU: $totalCpu seconds"
    Write-Host "- Memory: $totalMemory MB"
    
    # Calculate percentage impact
    $baseline = Get-Content "C:\temp\performance_baseline.json" | ConvertFrom-Json
    $memoryImpactPercent = [math]::Round(($totalMemory / 1024) / ($baseline.Memory) * 100, 2)
    
    Write-Host "Memory Impact: $memoryImpactPercent% of baseline memory usage"
    
} else {
    Write-Host "No SentinelOne processes found!"
}

# Real-time monitoring for 5 minutes
Write-Host "`n=== REAL-TIME MONITORING (5 minutes) ==="
$monitoringData = @()

for($i = 1; $i -le 300; $i++) {
    $sentinelProcesses = Get-Process -Name "*Sentinel*" -ErrorAction SilentlyContinue
    $timestamp = Get-Date
    
    $cpuTotal = (Get-WmiObject win32_processor | Measure-Object -property LoadPercentage -Average).Average
    $memAvailable = (Get-Counter "\Memory\Available MBytes").CounterSamples.CookedValue / 1024
    $memUsed = $memTotal - $memAvailable
    
    $sentinelMemory = 0
    if($sentinelProcesses) {
        $sentinelMemory = ($sentinelProcesses | Measure-Object WorkingSet -Sum).Sum / 1MB
    }
    
    $dataPoint = [PSCustomObject]@{
        Timestamp = $timestamp
        SystemCPU = $cpuTotal
        SystemMemory = $memUsed
        SentinelMemory = $sentinelMemory
    }
    
    $monitoringData += $dataPoint
    
    if($i % 30 -eq 0) {
        Write-Host "[$i/300] CPU: $cpuTotal%, Memory: $([math]::Round($memUsed, 2))GB, Sentinel: $([math]::Round($sentinelMemory, 2))MB"
    }
    
    Start-Sleep 1
}

# Export monitoring data
$monitoringData | Export-Csv "C:\temp\sentinelone_performance_monitoring.csv" -NoTypeInformation
```

#### E1.3: Performance Under Load

**Windows Server Stress Test:**
```powershell
# Create controlled system load
Write-Host "=== PERFORMANCE UNDER LOAD TESTING ==="

# CPU stress test
$cpuStressJobs = @()
for($i = 1; $i -le 4; $i++) {
    $job = Start-Job -ScriptBlock {
        $start = Get-Date
        while((Get-Date) -lt $start.AddMinutes(10)) {
            $result = 1
            for($j = 1; $j -le 10000; $j++) {
                $result = $result * $j % 1000000
            }
        }
    }
    $cpuStressJobs += $job
    Write-Host "Started CPU stress job $i"
}

# Monitor performance during stress
$stressData = @()
$startTime = Get-Date

while($cpuStressJobs | Where-Object {$_.State -eq "Running"}) {
    $currentTime = Get-Date
    $elapsedMinutes = ($currentTime - $startTime).TotalMinutes
    
    # System metrics
    $cpuUsage = (Get-WmiObject win32_processor | Measure-Object -property LoadPercentage -Average).Average
    $memAvailable = (Get-Counter "\Memory\Available MBytes").CounterSamples.CookedValue / 1024
    $memUsed = $memTotal - $memAvailable
    
    # SentinelOne metrics
    $sentinelProcesses = Get-Process -Name "*Sentinel*" -ErrorAction SilentlyContinue
    $sentinelMemory = 0
    $sentinelCpu = 0
    
    if($sentinelProcesses) {
        $sentinelMemory = ($sentinelProcesses | Measure-Object WorkingSet -Sum).Sum / 1MB
        # Note: CPU measurement during stress requires different approach
    }
    
    $stressDataPoint = [PSCustomObject]@{
        ElapsedMinutes = [math]::Round($elapsedMinutes, 2)
        SystemCPU = $cpuUsage
        SystemMemory = [math]::Round($memUsed, 2)
        SentinelMemory = [math]::Round($sentinelMemory, 2)
        TestPhase = "CPU_Stress"
    }
    
    $stressData += $stressDataPoint
    Write-Host "Stress Test [$([math]::Round($elapsedMinutes, 1))min]: CPU=$cpuUsage%, Sys Mem=$([math]::Round($memUsed, 2))GB, S1 Mem=$([math]::Round($sentinelMemory, 2))MB"
    
    Start-Sleep 10
}

# Clean up stress jobs
$cpuStressJobs | Remove-Job -Force
Write-Host "CPU stress test completed"

# Export stress test data
$stressData | Export-Csv "C:\temp\sentinelone_stress_test.csv" -NoTypeInformation
```

---

## 💾 E2: Disk I/O Impact

### Tujuan Testing
Mengukur dampak SentinelOne terhadap disk I/O performance dan storage utilization.

### Test Scenarios

#### E2.1: File System Performance

**Windows Server:**
```powershell
Write-Host "=== DISK I/O PERFORMANCE TESTING ==="

# Baseline disk performance test
function Test-DiskPerformance {
    param($TestName, $FilePath, $FileSizeMB = 100)
    
    Write-Host "Testing: $TestName"
    
    # Write test
    $writeStart = Get-Date
    $data = New-Object byte[] (1024 * 1024)  # 1MB chunks
    $stream = [System.IO.File]::Create($FilePath)
    
    for($i = 0; $i -lt $FileSizeMB; $i++) {
        $stream.Write($data, 0, $data.Length)
    }
    $stream.Close()
    $writeTime = (Get-Date) - $writeStart
    $writeSpeed = [math]::Round($FileSizeMB / $writeTime.TotalSeconds, 2)
    
    # Read test
    $readStart = Get-Date
    $content = [System.IO.File]::ReadAllBytes($FilePath)
    $readTime = (Get-Date) - $readStart
    $readSpeed = [math]::Round($FileSizeMB / $readTime.TotalSeconds, 2)
    
    # Clean up
    Remove-Item $FilePath -Force
    
    return @{
        WriteSpeed = $writeSpeed
        ReadSpeed = $readSpeed
        WriteTime = $writeTime.TotalSeconds
        ReadTime = $readTime.TotalSeconds
    }
}

# Test different file types and locations
$diskTests = @(
    @{Name="System Drive"; Path="C:\temp\disktest.dat"},
    @{Name="Large File"; Path="C:\temp\largefile.dat"; Size=500},
    @{Name="Multiple Small Files"; Path="C:\temp\smallfile"; Size=10}
)

$diskResults = @()
foreach($test in $diskTests) {
    $size = if($test.Size) { $test.Size } else { 100 }
    $result = Test-DiskPerformance -TestName $test.Name -FilePath $test.Path -FileSizeMB $size
    
    $diskResults += [PSCustomObject]@{
        TestName = $test.Name
        FileSize = $size
        WriteSpeedMBps = $result.WriteSpeed
        ReadSpeedMBps = $result.ReadSpeed
        WriteTimeSeconds = $result.WriteTime
        ReadTimeSeconds = $result.ReadTime
    }
    
    Write-Host "- Write: $($result.WriteSpeed) MB/s, Read: $($result.ReadSpeed) MB/s"
}

$diskResults | Export-Csv "C:\temp\disk_performance_results.csv" -NoTypeInformation
```

**Linux Server:**
```bash
#!/bin/bash
echo "=== DISK I/O PERFORMANCE TESTING ==="

# Function to test disk performance
test_disk_performance() {
    local test_name=$1
    local file_path=$2
    local file_size_mb=${3:-100}
    
    echo "Testing: $test_name"
    
    # Write test
    echo "Write test..."
    write_start=$(date +%s.%N)
    dd if=/dev/zero of="$file_path" bs=1M count=$file_size_mb 2>/dev/null
    write_end=$(date +%s.%N)
    sync  # Ensure data is written to disk
    
    write_time=$(echo "$write_end - $write_start" | bc)
    write_speed=$(echo "scale=2; $file_size_mb / $write_time" | bc)
    
    # Read test
    echo "Read test..."
    # Clear cache first
    sudo sh -c 'echo 3 > /proc/sys/vm/drop_caches'
    
    read_start=$(date +%s.%N)
    dd if="$file_path" of=/dev/null bs=1M 2>/dev/null
    read_end=$(date +%s.%N)
    
    read_time=$(echo "$read_end - $read_start" | bc)
    read_speed=$(echo "scale=2; $file_size_mb / $read_time" | bc)
    
    # Clean up
    rm -f "$file_path"
    
    echo "- Write: ${write_speed} MB/s, Read: ${read_speed} MB/s"
    
    # Log results
    echo "$test_name,$file_size_mb,$write_speed,$read_speed,$write_time,$read_time" >> /tmp/disk_performance_results.csv
}

# Initialize results file
echo "TestName,FileSizeMB,WriteSpeedMBps,ReadSpeedMBps,WriteTimeSeconds,ReadTimeSeconds" > /tmp/disk_performance_results.csv

# Run tests
test_disk_performance "System Drive" "/tmp/disktest.dat" 100
test_disk_performance "Large File" "/tmp/largefile.dat" 500
test_disk_performance "Small Files" "/tmp/smallfile.dat" 10

echo "Disk performance testing completed"
```

#### E2.2: SentinelOne Storage Usage

**Windows & Linux:**
```powershell
# Windows - Analyze SentinelOne storage usage
Write-Host "=== SENTINELONE STORAGE ANALYSIS ==="

$sentinelPaths = @(
    "C:\Program Files\SentinelOne",
    "C:\ProgramData\SentinelOne",
    "$env:TEMP\SentinelOne"
)

$totalSize = 0
foreach($path in $sentinelPaths) {
    if(Test-Path $path) {
        $size = (Get-ChildItem $path -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Host "- $path: $([math]::Round($size, 2)) MB"
        $totalSize += $size
    }
}

Write-Host "Total SentinelOne Storage Usage: $([math]::Round($totalSize, 2)) MB"

# Check for large log files
$logFiles = Get-ChildItem "C:\ProgramData\SentinelOne" -Filter "*.log" -Recurse -ErrorAction SilentlyContinue
if($logFiles) {
    Write-Host "`nLog Files Analysis:"
    foreach($log in $logFiles) {
        $sizeMB = $log.Length / 1MB
        Write-Host "- $($log.Name): $([math]::Round($sizeMB, 2)) MB"
    }
}
```

```bash
# Linux - Analyze SentinelOne storage usage
echo "=== SENTINELONE STORAGE ANALYSIS ==="

sentinel_paths=(
    "/opt/sentinelone"
    "/var/lib/sentinelone"
    "/var/log/sentinelone"
    "/tmp/sentinelone"
)

total_size=0
for path in "${sentinel_paths[@]}"; do
    if [ -d "$path" ]; then
        size=$(du -sm "$path" 2>/dev/null | cut -f1)
        echo "- $path: ${size} MB"
        total_size=$((total_size + size))
    fi
done

echo "Total SentinelOne Storage Usage: ${total_size} MB"

# Check log file sizes
echo -e "\nLog Files Analysis:"
find /var/log/sentinelone -name "*.log" -exec du -sh {} \; 2>/dev/null | sort -hr
```

---

## 🌐 E3: Network Latency Testing

### Tujuan Testing
Mengukur dampak SentinelOne terhadap network performance dan latency.

### Test Scenarios

#### E3.1: Network Throughput Analysis

**Windows Server:**
```powershell
Write-Host "=== NETWORK PERFORMANCE TESTING ==="

# Test network throughput to various destinations
$testTargets = @(
    @{Name="Local Gateway"; Address="192.168.1.1"},
    @{Name="Public DNS"; Address="8.8.8.8"},
    @{Name="External Host"; Address="google.com"}
)

$networkResults = @()

foreach($target in $testTargets) {
    Write-Host "Testing network to: $($target.Name) ($($target.Address))"
    
    # Ping test for latency
    $pingResults = Test-Connection $target.Address -Count 10 -ErrorAction SilentlyContinue
    if($pingResults) {
        $avgLatency = ($pingResults | Measure-Object ResponseTime -Average).Average
        $minLatency = ($pingResults | Measure-Object ResponseTime -Minimum).Minimum
        $maxLatency = ($pingResults | Measure-Object ResponseTime -Maximum).Maximum
        $packetLoss = (10 - $pingResults.Count) / 10 * 100
        
        $networkResults += [PSCustomObject]@{
            Target = $target.Name
            Address = $target.Address
            AvgLatencyMs = [math]::Round($avgLatency, 2)
            MinLatencyMs = $minLatency
            MaxLatencyMs = $maxLatency
            PacketLossPercent = $packetLoss
        }
        
        Write-Host "- Avg Latency: $([math]::Round($avgLatency, 2))ms, Packet Loss: $packetLoss%"
    }
}

$networkResults | Export-Csv "C:\temp\network_performance_results.csv" -NoTypeInformation
```

**Linux Server:**
```bash
#!/bin/bash
echo "=== NETWORK PERFORMANCE TESTING ==="

# Test targets
declare -A test_targets
test_targets[Local_Gateway]="192.168.1.1"
test_targets[Public_DNS]="8.8.8.8"
test_targets[External_Host]="google.com"

# Initialize results file
echo "Target,Address,AvgLatencyMs,MinLatencyMs,MaxLatencyMs,PacketLossPercent" > /tmp/network_performance_results.csv

for target_name in "${!test_targets[@]}"; do
    address="${test_targets[$target_name]}"
    echo "Testing network to: $target_name ($address)"
    
    # Ping test
    ping_result=$(ping -c 10 "$address" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        # Parse ping statistics
        avg_latency=$(echo "$ping_result" | tail -1 | awk -F '/' '{print $5}')
        min_latency=$(echo "$ping_result" | tail -1 | awk -F '/' '{print $4}')
        max_latency=$(echo "$ping_result" | tail -1 | awk -F '/' '{print $6}')
        
        # Calculate packet loss
        packet_loss=$(echo "$ping_result" | grep "packet loss" | awk '{print $6}' | sed 's/%//')
        
        echo "- Avg Latency: ${avg_latency}ms, Packet Loss: ${packet_loss}%"
        
        # Log results
        echo "$target_name,$address,$avg_latency,$min_latency,$max_latency,$packet_loss" >> /tmp/network_performance_results.csv
    else
        echo "- Failed to reach $address"
        echo "$target_name,$address,FAILED,FAILED,FAILED,100" >> /tmp/network_performance_results.csv
    fi
done
```

#### E3.2: Bandwidth Impact Measurement

**Network Bandwidth Test:**
```bash
# Test bandwidth with and without SentinelOne deep packet inspection
echo "=== BANDWIDTH IMPACT TESTING ==="

# Install iperf3 if needed
if ! command -v iperf3 &> /dev/null; then
    echo "Installing iperf3..."
    sudo apt update && sudo apt install iperf3 -y
fi

# Note: Requires iperf3 server on another machine
# Replace SERVER_IP with actual iperf3 server
SERVER_IP="192.168.1.100"

if ping -c 1 "$SERVER_IP" &> /dev/null; then
    echo "Testing bandwidth to iperf3 server: $SERVER_IP"
    
    # TCP bandwidth test
    echo "TCP bandwidth test (10 seconds):"
    iperf3 -c "$SERVER_IP" -t 10 -f M
    
    # UDP bandwidth test
    echo "UDP bandwidth test (10 seconds):"
    iperf3 -c "$SERVER_IP" -u -t 10 -f M
    
else
    echo "iperf3 server not reachable at $SERVER_IP"
    echo "Skipping bandwidth tests"
fi
```

---

## 🚀 E4: Application Performance

### Tujuan Testing
Testing dampak SentinelOne terhadap performance aplikasi bisnis critical.

### Test Scenarios

#### E4.1: Database Performance Impact

**SQL Server Performance Test:**
```sql
-- SQL Server performance testing
USE tempdb;
GO

-- Create test table
CREATE TABLE PerformanceTest (
    ID int IDENTITY(1,1) PRIMARY KEY,
    TestData varchar(255),
    CreatedDate datetime DEFAULT GETDATE()
);
GO

-- Baseline performance test
DECLARE @StartTime datetime2 = SYSDATETIME();

-- Insert test
DECLARE @i int = 0;
WHILE @i < 10000
BEGIN
    INSERT INTO PerformanceTest (TestData) 
    VALUES ('Test data row ' + CAST(@i as varchar(10)));
    SET @i = @i + 1;
END

DECLARE @InsertTime float = DATEDIFF(MICROSECOND, @StartTime, SYSDATETIME()) / 1000.0;
PRINT 'Insert 10,000 rows: ' + CAST(@InsertTime as varchar(20)) + ' ms';

-- Select test  
SET @StartTime = SYSDATETIME();
SELECT COUNT(*) FROM PerformanceTest WHERE TestData LIKE '%500%';
SET @SelectTime = DATEDIFF(MICROSECOND, @StartTime, SYSDATETIME()) / 1000.0;
PRINT 'Select with LIKE: ' + CAST(@SelectTime as varchar(20)) + ' ms';

-- Update test
SET @StartTime = SYSDATETIME();
UPDATE PerformanceTest SET TestData = TestData + ' - Updated' WHERE ID % 100 = 0;
DECLARE @UpdateTime float = DATEDIFF(MICROSECOND, @StartTime, SYSDATETIME()) / 1000.0;
PRINT 'Update 100 rows: ' + CAST(@UpdateTime as varchar(20)) + ' ms';

-- Clean up
DROP TABLE PerformanceTest;
GO
```

**MySQL/PostgreSQL Performance Test:**
```bash
#!/bin/bash
echo "=== DATABASE PERFORMANCE TESTING ==="

# MySQL performance test
if command -v mysql &> /dev/null; then
    echo "Testing MySQL performance..."
    
    mysql -u root -p -e "
    USE test;
    DROP TABLE IF EXISTS performance_test;
    CREATE TABLE performance_test (
        id INT AUTO_INCREMENT PRIMARY KEY,
        test_data VARCHAR(255),
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    SET @start_time = NOW(6);
    
    -- Insert test
    INSERT INTO performance_test (test_data) 
    SELECT CONCAT('Test data row ', n)
    FROM (
        SELECT a.N + b.N * 10 + c.N * 100 + d.N * 1000 as n
        FROM 
        (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) a,
        (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) b,
        (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) c,
        (SELECT 0 as N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) d
    ) numbers
    WHERE n < 10000;
    
    SELECT CONCAT('Insert 10,000 rows: ', TIMESTAMPDIFF(MICROSECOND, @start_time, NOW(6))/1000, ' ms') as result;
    "
fi
```

#### E4.2: Web Application Performance

**IIS/Apache Performance Test:**
```powershell
# Windows - IIS performance test using WebRequest
Write-Host "=== WEB APPLICATION PERFORMANCE TEST ==="

$testUrls = @(
    "http://localhost/",
    "http://localhost/api/test",
    "http://localhost/static/large-image.jpg"
)

$webResults = @()

foreach($url in $testUrls) {
    Write-Host "Testing: $url"
    
    $responseTimes = @()
    
    # Make 10 requests to each URL
    for($i = 1; $i -le 10; $i++) {
        try {
            $startTime = Get-Date
            $response = Invoke-WebRequest $url -TimeoutSec 30
            $endTime = Get-Date
            
            $responseTime = ($endTime - $startTime).TotalMilliseconds
            $responseTimes += $responseTime
            
            Write-Progress -Activity "Testing $url" -PercentComplete ($i/10*100)
        }
        catch {
            Write-Host "Request $i failed: $($_.Exception.Message)"
        }
    }
    
    if($responseTimes.Count -gt 0) {
        $avgResponse = [math]::Round(($responseTimes | Measure-Object -Average).Average, 2)
        $minResponse = [math]::Round(($responseTimes | Measure-Object -Minimum).Minimum, 2)
        $maxResponse = [math]::Round(($responseTimes | Measure-Object -Maximum).Maximum, 2)
        
        $webResults += [PSCustomObject]@{
            URL = $url
            AvgResponseTimeMs = $avgResponse
            MinResponseTimeMs = $minResponse
            MaxResponseTimeMs = $maxResponse
            SuccessRate = $responseTimes.Count / 10 * 100
        }
        
        Write-Host "- Avg: ${avgResponse}ms, Min: ${minResponse}ms, Max: ${maxResponse}ms"
    }
}

$webResults | Export-Csv "C:\temp\web_performance_results.csv" -NoTypeInformation
```

---

## 📊 Performance Impact Metrics

### Key Performance Indicators

| Metric Category | Baseline Target | With SentinelOne Target | Acceptable Impact |
|----------------|-----------------|----------------------|-------------------|
| CPU Usage | <20% | <25% | <5% increase |
| Memory Usage | Baseline | Baseline + 500MB | <10% of total RAM |
| Disk I/O | Baseline | >90% of baseline | <10% degradation |
| Network Latency | Baseline | <10ms additional | <5% increase |
| App Response Time | Baseline | <20% increase | <15% degradation |

### Validation Checklist

#### Resource Usage Validation
- [ ] **CPU Impact**: <5% additional CPU usage under normal load
- [ ] **Memory Footprint**: <500MB total memory usage
- [ ] **Disk Usage**: <2GB storage consumption
- [ ] **Network Overhead**: <5% additional network traffic
- [ ] **Boot Impact**: <10 seconds additional boot time

#### Application Performance Validation
- [ ] **Database Performance**: <10% query time increase
- [ ] **Web Applications**: <15% response time increase
- [ ] **File Operations**: <10% I/O performance impact
- [ ] **Network Services**: <5% throughput reduction
- [ ] **System Responsiveness**: No noticeable UI lag

---

## Demo Presentation Points

### Executive Summary
1. **"Minimal Performance Impact"**
   - Less than 5% CPU overhead under normal operations
   - Memory footprint under 500MB
   - No noticeable impact on user experience

2. **"Optimized for Production"**
   - Designed for 24/7 server environments
   - Efficient resource utilization
   - Scales with system capabilities

3. **"Performance vs Security Balance"**
   - Maximum protection with minimal impact
   - Intelligent resource management
   - Priority given to critical system functions

### Technical Demonstrations
- Real-time resource monitoring during various workloads
- Before/after performance comparisons
- Application response time measurements
- System stress testing with SentinelOne active

---

## Next Steps

Complete the testing framework with:
- [Kategori F: Integration Testing](kategori-f-integration.md)
- [Windows Server Specific Testing](windows/windows-overview.md)
- [Linux Server Specific Testing](linux/linux-overview.md)

!!! success "Performance Validated"
    Kategori E testing proves that SentinelOne delivers enterprise-grade security without compromising system performance, crucial for business continuity arguments.
