# Update Sensor/Patch SentinelOne EDR

Panduan teknis untuk melakukan update sensor EDR dengan berbagai metode deployment.

## Pre-Update Checklist

### 1. Cek Versi Saat Ini
```bash
# Via agent command
sentinelctl version

# Via console
Console > Sentinels > Version Column
```

### 2. Download Update Package
```
Console > Updates > Download Latest Package
```

## Update Methods

### Method 1: Console Push Update
```
1. Console > Sentinels
2. Select endpoints
3. Actions > Update Agent
4. Confirm update
```

### Method 2: Command Line Update
```bash
# Windows
"C:\Program Files\SentinelOne\Sentinel Agent\SentinelCtl.exe" update --package "path\to\update.msi"

# Linux
sudo /opt/sentinelone/bin/sentinelctl update --package "/path/to/update.rpm"
```

### Method 3: SCCM Deployment
```powershell
# SCCM Package Command
msiexec /i SentinelAgent_update.msi /quiet /l*v update.log
```

### Method 4: Script Automation
```bash
#!/bin/bash
# Bulk update script

UPDATE_FILE="/path/to/SentinelAgent_update.rpm"
LOG_FILE="/var/log/sentinel_update.log"

echo "Starting SentinelOne update: $(date)" >> $LOG_FILE

# Check current version
CURRENT_VERSION=$(sentinelctl version | grep Version | awk '{print $2}')
echo "Current version: $CURRENT_VERSION" >> $LOG_FILE

# Perform update
if sudo /opt/sentinelone/bin/sentinelctl update --package $UPDATE_FILE; then
    echo "Update successful" >> $LOG_FILE
    NEW_VERSION=$(sentinelctl version | grep Version | awk '{print $2}')
    echo "New version: $NEW_VERSION" >> $LOG_FILE
else
    echo "Update failed" >> $LOG_FILE
    exit 1
fi
```

## Update Verification

### 1. Check Agent Status
```bash
# Verify agent is running
sentinelctl status

# Expected output:
Agent Status: Running
Connection Status: Connected
Protection Status: Protected
```

### 2. Version Verification
```bash
# Check new version
sentinelctl version

# Verify in console
Console > Sentinels > Check Version Column
```

### 3. Functionality Test
```bash
# Test scanning capability
sentinelctl scan --path /tmp/test

# Check connectivity
sentinelctl connectivity test
```

## Error Troubleshooting

### Error: "Update package corrupted"
**Penyebab:** File download incomplete
**Solusi:**
```bash
# Verify package integrity
md5sum SentinelAgent_update.rpm
# Compare with official MD5

# Re-download if mismatch
wget https://console.sentinelone.com/update/package.rpm
```

### Error: "Insufficient disk space"
**Penyebab:** Disk space kurang
**Solusi:**
```bash
# Check disk space
df -h

# Clean temporary files
sudo rm -rf /var/tmp/sentinel*
sudo rm -rf /tmp/sentinel*

# Retry update
```

### Error: "Agent unresponsive after update"
**Penyebab:** Service tidak restart properly
**Solusi:**
```bash
# Restart agent service
# Windows
net stop "SentinelAgent" && net start "SentinelAgent"

# Linux
sudo systemctl restart sentinelone

# Verify status
sentinelctl status
```

### Error: "Policy sync failed"
**Penyebab:** Network connectivity issue
**Solusi:**
```bash
# Force policy sync
sentinelctl management policy update

# Check connectivity
sentinelctl connectivity test

# Verify DNS resolution
nslookup console.sentinelone.com
```

## Rollback Procedure

### Emergency Rollback
```bash
# Windows
msiexec /x {PRODUCT-CODE} /quiet
msiexec /i old_version.msi /quiet SITE_TOKEN=token

# Linux
sudo rpm -e sentinelone-agent
sudo rpm -i old_version.rpm
sudo sentinelctl management token set TOKEN
sudo sentinelctl control start
```

## Batch Update Script

```python
#!/usr/bin/env python3
# bulk_update.py

import subprocess
import csv
import logging

# Setup logging
logging.basicConfig(filename='update.log', level=logging.INFO)

# Read endpoint list
with open('endpoints.csv', 'r') as file:
    reader = csv.reader(file)
    for row in reader:
        hostname = row[0]
        try:
            # SSH to remote host and update
            cmd = f"ssh {hostname} 'sudo sentinelctl update --package /tmp/update.rpm'"
            result = subprocess.run(cmd, shell=True, capture_output=True)
            
            if result.returncode == 0:
                logging.info(f"Update successful on {hostname}")
            else:
                logging.error(f"Update failed on {hostname}: {result.stderr}")
                
        except Exception as e:
            logging.error(f"Error updating {hostname}: {str(e)}")
```

---

*Hubungi admin IT Anda jika mengalami kesulitan selama proses update.*

*Last updated: {{ git_revision_date_localized }}*
