package core

import (
	"context"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// NetMergeCore wraps the net-merge core functionality
type NetMergeCore struct {
	ctx context.Context
}

// NewNetMergeCore creates a new core instance
func NewNetMergeCore(ctx context.Context) *NetMergeCore {
	return &NetMergeCore{ctx: ctx}
}

// Start starts the net-merge core
func (c *NetMergeCore) Start() error {
	// In a real implementation, this would start the net-merge engine
	// For now, we just emit mock events
	go c.emitMockStats()
	return nil
}

// Stop stops the net-merge core
func (c *NetMergeCore) Stop() error {
	return nil
}

// GetStatus returns the current status
func (c *NetMergeCore) GetStatus() map[string]interface{} {
	return map[string]interface{}{
		"running":     true,
		"scheduler":   "weighted",
		"ipv6_policy": "auto",
		"mtu":         9000,
	}
}

// GetAdapters returns the list of adapters
func (c *NetMergeCore) GetAdapters() []map[string]interface{} {
	// Mock data - in reality this would come from the net-merge core
	return []map[string]interface{}{
		{
			"name":         "Wi-Fi",
			"mac":          "00:11:22:33:44:55",
			"ipv4":         "192.168.1.100",
			"ipv6":         "fe80::1234:5678:9abc:def0",
			"rx":           157286400,
			"tx":           26214400,
			"speed_rx":     12582912,
			"speed_tx":     2097152,
			"flows":        42,
			"weight":       1.0,
			"speed_limit":  0,
			"ipv6_enabled": true,
			"healthy":      true,
			"type":         "wifi",
		},
		{
			"name":         "Ethernet",
			"mac":          "aa:bb:cc:dd:ee:ff",
			"ipv4":         "192.168.1.101",
			"ipv6":         "fe80::aabb:ccdd:eeff:1122",
			"rx":           524288000,
			"tx":           52428800,
			"speed_rx":     47185920,
			"speed_tx":     5242880,
			"flows":        28,
			"weight":       1.5,
			"speed_limit":  0,
			"ipv6_enabled": true,
			"healthy":      true,
			"type":         "ethernet",
		},
		{
			"name":         "USB Tether",
			"mac":          "11:22:33:44:55:66",
			"ipv4":         "192.168.42.100",
			"ipv6":         "",
			"rx":           83886080,
			"tx":           15728640,
			"speed_rx":     8388608,
			"speed_tx":     1048576,
			"flows":        15,
			"weight":       0.8,
			"speed_limit":  5242880,
			"ipv6_enabled": false,
			"healthy":      true,
			"type":         "tether",
		},
	}
}

// UpdateAdapterConfig updates an adapter's configuration
func (c *NetMergeCore) UpdateAdapterConfig(name string, config map[string]interface{}) error {
	// In a real implementation, this would update the net-merge core
	return nil
}

// SetSchedulerMode sets the scheduler mode
func (c *NetMergeCore) SetSchedulerMode(mode string) error {
	return nil
}

// SetIPv6Policy sets the IPv6 policy
func (c *NetMergeCore) SetIPv6Policy(policy string) error {
	return nil
}

// SetMTU sets the MTU
func (c *NetMergeCore) SetMTU(mtu int) error {
	return nil
}

// SetSpeedLimit sets the speed limit for an adapter
func (c *NetMergeCore) SetSpeedLimit(adapter string, limit int64) error {
	return nil
}

// emitMockStats emits mock stats for development
func (c *NetMergeCore) emitMockStats() {
	ticker := time.NewTicker(500 * time.Millisecond)
	defer ticker.Stop()

	for {
		select {
		case <-c.ctx.Done():
			return
		case <-ticker.C:
			// In a real implementation, this would emit real stats
			// For now, we just emit a mock event
			runtime.EventsEmit(c.ctx, "stats:update", map[string]interface{}{
				"timestamp": time.Now().Format(time.RFC3339),
				"total_rx":  766504960,
				"total_tx":  94371840,
				"adapters": []map[string]interface{}{
					{
						"name":         "Wi-Fi",
						"speed_rx":     12582912,
						"speed_tx":     2097152,
						"flows":        42,
						"weight":       1.0,
						"healthy":      true,
					},
					{
						"name":         "Ethernet",
						"speed_rx":     47185920,
						"speed_tx":     5242880,
						"flows":        28,
						"weight":       1.5,
						"healthy":      true,
					},
				},
			})
		}
	}
}