# Linux Offline Testing Scenarios

## Overview
Pengujian khusus Linux untuk validasi kemampuan SentinelOne EDR dalam kondisi offline atau terputus dari management console.

---

## 🔌 B1: Linux Network Disconnection Testing

### Tujuan
Memvalidasi behavior SentinelOne agent ketika koneksi network terputus pada sistem Linux.

### Prerequisites
- [ ] SentinelOne Agent terinstall dan aktif
- [ ] Policy sudah di-sync sebelum test
- [ ] Access ke firewall/iptables untuk simulasi disconnection

### Test Scenarios

#### B1.1: Firewall-based Network Isolation

```bash
#!/bin/bash
# Linux Network Isolation Test Script

echo "=== Linux Network Disconnection Test ==="

# Step 1: Check initial agent status
echo "Initial agent status:"
sudo /opt/sentinelone/bin/sentinelctl status

# Step 2: Block SentinelOne communication
echo "Blocking SentinelOne network traffic..."
sudo iptables -I OUTPUT -d *.sentinelone.net -j DROP
sudo iptables -I OUTPUT -p tcp --dport 443 -m string --string "sentinelone" --algo bm -j DROP

# Step 3: Verify network isolation
echo "Testing network isolation:"
ping -c 3 console.sentinelone.net || echo "✅ Network successfully isolated"

# Step 4: Test malware detection while offline
echo "Creating EICAR test file while offline:"
echo 'X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*' > /tmp/eicar_offline.txt

# Expected Result: File should still be detected and quarantined
sleep 5
ls -la /tmp/eicar_offline.txt || echo "✅ File quarantined while offline"

# Step 5: Check local logs
echo "Checking local logs for offline detection:"
sudo /opt/sentinelone/bin/sentinelctl logs --tail 10 | grep -i "eicar\|threat"

# Step 6: Restore network connectivity
echo "Restoring network connectivity..."
sudo iptables -D OUTPUT -d *.sentinelone.net -j DROP
sudo iptables -D OUTPUT -p tcp --dport 443 -m string --string "sentinelone" --algo bm -j DROP

# Step 7: Wait for sync
echo "Waiting for agent to reconnect..."
sleep 30
sudo /opt/sentinelone/bin/sentinelctl status
```

#### B1.2: Interface Down Simulation

```bash
#!/bin/bash
# Simulate network interface down

echo "=== Interface Down Simulation ==="

# Get primary interface
PRIMARY_IF=$(ip route | grep default | head -1 | awk '{print $5}')
echo "Primary interface: $PRIMARY_IF"

# Take interface down
echo "Taking interface down..."
sudo ip link set $PRIMARY_IF down

# Create test threat
echo 'X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*' > /tmp/eicar_ifdown.txt

# Check agent behavior
sudo /opt/sentinelone/bin/sentinelctl status

# Restore interface
echo "Restoring interface..."
sudo ip link set $PRIMARY_IF up
sudo dhclient $PRIMARY_IF

# Verify reconnection
sleep 30
sudo /opt/sentinelone/bin/sentinelctl status
```

---

## 🛠️ B2: Linux Service Resilience Testing

### Test Service Restart Behavior

```bash
#!/bin/bash
# Test service resilience

echo "=== Service Resilience Testing ==="

# Step 1: Stop SentinelOne service
echo "Stopping SentinelOne service..."
sudo systemctl stop sentinelone

# Step 2: Create threat while service is down
echo 'X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*' > /tmp/eicar_service_down.txt

# Step 3: Restart service
echo "Starting SentinelOne service..."
sudo systemctl start sentinelone

# Step 4: Check if threat is detected on startup
sleep 10
ls -la /tmp/eicar_service_down.txt || echo "✅ Threat detected after service restart"

# Step 5: Verify service auto-recovery
sudo systemctl status sentinelone
```

---

## 🔄 B3: Linux Policy Cache Validation

### Test Cached Policy Enforcement

```bash
#!/bin/bash
# Test cached policy enforcement

echo "=== Cached Policy Validation ==="

# Step 1: Verify current policy
sudo /opt/sentinelone/bin/sentinelctl policy show

# Step 2: Disconnect from network (using iptables)
sudo iptables -I OUTPUT -d *.sentinelone.net -j DROP

# Step 3: Test policy enforcement while offline
echo "Testing policy enforcement while offline..."

# Create various test files to trigger different policy rules
mkdir -p /tmp/policy_test
echo 'X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*' > /tmp/policy_test/eicar.txt
dd if=/dev/zero of=/tmp/policy_test/largefile.bin bs=1M count=100

# Step 4: Check enforcement results
sleep 10
ls -la /tmp/policy_test/ || echo "✅ Policy enforced from cache"

# Step 5: Restore connectivity
sudo iptables -D OUTPUT -d *.sentinelone.net -j DROP

# Step 6: Wait for policy sync
sleep 30
sudo /opt/sentinelone/bin/sentinelctl policy refresh
```

---

## 📊 Validation Metrics

### Expected Results

| Test Scenario | Expected Behavior | Pass Criteria |
|---------------|-------------------|---------------|
| Network Disconnection | Continue threat detection locally | EICAR detected and quarantined |
| Service Restart | Resume protection immediately | Service starts \< 30 seconds |
| Policy Cache | Enforce cached policies | Policies remain active offline |
| Connectivity Recovery | Auto-sync when online | Status shows "Online" within 60s |

### Validation Checklist

- [ ] **Offline Detection**: Threats detected without internet connection
- [ ] **Local Quarantine**: Malicious files quarantined locally
- [ ] **Service Resilience**: Service auto-recovers from failures
- [ ] **Policy Persistence**: Policies enforced from local cache
- [ ] **Auto-Reconnection**: Agent reconnects when network is restored
- [ ] **Event Synchronization**: Offline events sync to console when online

---

## Next Steps

Continue with:
- [Linux Performance Testing](linux-performance.md)
- [Linux Container Testing](linux-containers.md)
- [Cross-Platform Scenarios](../cross-platform/cross-platform-testing.md)

---

*Last updated: {{ git_revision_date_localized }}*
