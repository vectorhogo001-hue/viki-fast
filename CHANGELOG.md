# Changelog

All notable changes to Viki Fast will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project structure
- Wails v2 + React + TypeScript + Tailwind CSS setup
- Real-time dashboard with speedometer, flow distribution, adapter cards
- Adapters management view with editing capabilities
- History view with bandwidth, latency, and flow charts
- Settings view with tabs (General, Network, Scheduler, Appearance, Advanced)
- System tray integration (Windows, macOS, Linux)
- Dark/Light theme support with auto-detection
- Cross-platform packaging (NSIS, DMG, AppImage, deb, rpm)

### Changed
- N/A

### Fixed
- N/A

### Security
- N/A

## [0.1.0] - 2024-XX-XX

### Added
- Initial release
- Core net-merge integration
- Real-time dashboard with speedometer, flow distribution, adapter cards
- Adapter management with weight, speed limit, IPv6 controls
- History view with bandwidth, latency, and flow charts
- Settings: General, Network, Scheduler, Appearance, Advanced
- System tray integration (Windows, macOS, Linux)
- Dark/Light/Auto theme support
- Cross-platform builds (Windows, macOS, Linux)
- CI/CD pipeline with GitHub Actions
- Automated packaging (NSIS, DMG, AppImage, deb, rpm)

---

## Release Types

- **Major**: Breaking changes, major architecture changes
- **Minor**: New features, significant improvements
- **Patch**: Bug fixes, minor improvements, security patches

## Release Process

1. Update version in `wails.json` and `frontend/package.json`
2. Update `CHANGELOG.md`
3. Create and push tag: `git tag v0.1.0 && git push origin v0.1.0`
4. GitHub Actions builds and creates release automatically
5. GoReleaser creates packages and uploads to GitHub Releases