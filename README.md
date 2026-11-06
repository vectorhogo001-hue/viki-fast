# Viki Fast

> **Use all your internet connections at once** — A beautiful, minimal, cross-platform GUI for [net-merge](https://github.com/net-merge/net-merge)

![Viki Fast Dashboard](docs/demo.gif)

## ✨ Features

- **Real-time Network Monitoring** — Live bandwidth, latency, and connection tracking
- **Per-Adapter Control** — Weights, speed limits, IPv6 policy per adapter
- **Smart Load Balancing** — Weighted scheduling with automatic failover
- **Cross-Platform** — Native Windows (exe), macOS (dmg), Linux (AppImage, deb, rpm)
- **Modern UI** — Minimal, dark/light themes, real-time charts, responsive design
- **System Tray Integration** — Native tray on Windows, macOS, Linux
- **Privacy First** — No accounts, no servers, no telemetry

## Screenshots

| Dashboard | Adapters | History |
|-----------|----------|---------|
| ![Dashboard](docs/dashboard.png) | ![Adapters](docs/adapters.png) | ![History](docs/history.png) |

## Quick Start

### Download
- **Windows**: [viki-fast-setup.exe](https://github.com/viki-fast/viki-fast/releases/latest/download/viki-fast-setup.exe)
- **macOS**: [viki-fast.dmg](https://github.com/viki-fast/viki-fast/releases/latest/download/viki-fast-macos-universal.dmg)
- **Linux**: [AppImage](https://github.com/viki-fast/viki-fast/releases/latest/download/viki-fast-linux-x86_64.AppImage) / [deb](https://github.com/viki-fast/viki-fast/releases/latest/download/viki-fast_amd64.deb) / [rpm](https://github.com/viki-fast/viki-fast/releases/latest/download/viki-fast.rpm)

### Install

**Windows**
```powershell
# PowerShell
irm https://raw.githubusercontent.com/viki-fast/viki-fast/main/install.ps1 | iex
```

**macOS / Linux**
```bash
curl -fsSL https://raw.githubusercontent.com/viki-fast/viki-fast/main/install.sh | sh
```

## Building from Source

### Prerequisites
- Go 1.22+
- Node.js 18+
- Wails CLI: `go install github.com/wailsapp/wails/v2/cmd/wails@latest`

### Build
```bash
# Clone
git clone https://github.com/viki-fast/viki-fast
cd viki-fast

# Install dependencies
make install-deps

# Development (hot reload)
make dev

# Build for current platform
make build

# Build all platforms
make package
```

### Development
```bash
# Start dev server (hot reload)
make dev

# Run tests
make test

# Lint
cd frontend && npm run lint
go vet ./...
```

## Architecture

```
viki-fast/
├── cmd/viki-fast/          # Wails entry point
├── frontend/               # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/     # Dashboard, Adapters, History, Settings
│   │   ├── hooks/          # useStats, useAdapters, useTheme
│   │   ├── utils/          # cn, formatBytes, etc.
│   │   └── types.ts
│   └── wails.json
├── internal/
│   ├── app/                # Wails bindings
│   ├── core/               # net-merge core logic
│   ├── tray/               # System tray (native per OS)
│   ├── store/              # BadgerDB persistence
│   └── updater/            # Self-update
├── build/                  # Packaging scripts
│   ├── windows/            # NSIS installer
│   ├── macos/              # DMG, entitlements
│   └── linux/              # AppImage, deb, rpm
└── wails.json
```

## Technology Stack

| Layer | Technology |
|-------|------------|
| Core | Go 1.22+ |
| GUI Framework | Wails v2 (Go + WebView) |
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| State | Zustand |
| Icons | Lucide React |
| Packaging | Wails + GoReleaser |

## Configuration

The app stores settings in:
- **Windows**: `%APPDATA%\viki-fast`
- **macOS**: `~/Library/Application Support/viki-fast`
- **Linux**: `~/.config/viki-fast`

Configuration file (`config.json`):
```json
{
  "scheduler_mode": "weighted",
  "ipv6_policy": "auto",
  "mtu": 9000,
  "socks5_enabled": false,
  "theme": "auto",
  "auto_start": false,
  "auto_pause": true
}
```

## How It Works

Viki Fast is a frontend for **net-merge**, which:
1. Creates a **Virtual TUN Adapter** (Wintun/TUN/utun)
2. Routes all traffic through **gVisor/tun2socks** userland TCP/IP stack
3. **Schedules each connection** to an adapter using weighted round-robin
4. **Monitors adapter health** and throughput in real-time
4. **Gracefully handles failures** — crash-safe, no orphaned routes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a PR

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

MIT License — see [LICENSE](LICENSE) for details.

## Acknowledgments

- [net-merge](https://github.com/net-merge/net-merge) — The core engine
- [Wails](https://wails.io/) — Go + WebView framework
- [gVisor](https://gvisor.dev/) — Userland TCP/IP stack
- [Wintun](https://www.wintun.net/) — Windows TUN driver
- [Recharts](https://recharts.org/) — Charting library

## Support

- **Issues**: [GitHub Issues](https://github.com/viki-fast/viki-fast/issues)
- **Discussions**: [GitHub Discussions](https://github.com/viki-fast/viki-fast/discussions)
- **Donate**: [Buy me a coffee](https://buymeacoffee.com/vikifast) / [PayPal](https://paypal.me/vikifast)

---

*Built with ❤️ by the Viki Fast Team*