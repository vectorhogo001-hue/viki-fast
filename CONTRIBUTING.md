# Contributing to NetMerge GUI

Thank you for your interest in contributing to NetMerge GUI! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs

Before submitting a bug report:
1. Check if the issue already exists in [GitHub Issues](https://github.com/net-merge/netmerge-gui/issues)
2. Use the bug report template
3. Include:
   - OS and version
   - NetMerge GUI version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/logs if applicable

### Suggesting Features

1. Check existing feature requests
2. Open a feature request issue
3. Describe the use case and expected behavior
4. Discuss implementation approach

### Pull Requests

1. **Fork** the repository
2. Create a **feature branch**: `git checkout -b feature/amazing-feature`
3. Make your changes
4. **Run tests and linting**:
   ```bash
   make test
   cd frontend && npm run lint
   ```
5. **Commit** with conventional commits:
   ```
   feat: add amazing feature
   
   Description of what this feature does and why it's useful.
   ```
5. Push to your fork
6. Open a **Pull Request**

## Development Setup

### Prerequisites
- Go 1.22+
- Node.js 18+
- Wails CLI: `go install github.com/wailsapp/wails/v2/cmd/wails@latest`

### Setup
```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/netmerge-gui
cd netmerge-gui

# Install dependencies
make install-deps

# Start development
make dev
```

### Project Structure
```
netmerge-gui/
├── cmd/netmerge-gui/          # Wails entry point
├── frontend/                  # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/        # Dashboard, Adapters, History, Settings
│   │   ├── hooks/             # useStats, useAdapters, useTheme
│   │   ├── utils/             # cn, formatBytes, etc.
│   │   └── types.ts
│   └── wails.json
├── internal/
│   ├── app/                   # Wails bindings
│   ├── core/                  # net-merge core logic
│   ├── tray/                  # System tray (native per OS)
│   ├── store/                 # BadgerDB persistence
│   └── updater/               # Self-update
├── build/                     # Packaging scripts
└── wails.json
```

## Code Style

### Go
- Follow [Effective Go](https://golang.org/doc/effective_go.html)
- Run `gofmt` and `goimports`
- Run `golangci-lint run`
- Write tests for new functionality

### TypeScript/React
- Use TypeScript strict mode
- Follow React best practices
- Use functional components with hooks
- Run `npm run lint` before committing
- Use `clsx` for conditional classes
- Use `cn` utility for Tailwind classes

### Git Commits
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(adapters): add per-adapter speed limits
fix(dashboard): fix memory leak in stats collector
docs(readme): update installation instructions
```

## Testing

### Go Tests
```bash
go test -v ./...
go test -race ./...
go test -bench=./...
```

### Frontend Tests
```bash
cd frontend
npm run test
npm run test:coverage
```

### E2E Tests (Future)
```bash
# TODO: Add Playwright/Cypress tests
```

## Code Review

### Reviewer Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] No breaking changes without discussion
- [ ] Documentation updated
- [ ] No security issues
- [ ] Performance considerations addressed

### Author Checklist
- [ ] Self-reviewed code
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] No merge conflicts

## Release Process

1. Update version in `wails.json` and `frontend/package.json`
2. Update `CHANGELOG.md`
3. Create PR with version bump
4. After merge, create tag: `git tag v0.1.0 && git push origin v0.1.0`
5. GitHub Actions builds and creates release

## Getting Help

- **Discord**: [NetMerge Discord](https://discord.gg/netmerge) (TODO)
- **GitHub Discussions**: [GitHub Discussions](https://github.com/net-merge/netmerge-gui/discussions)
- **Email**: team@netmerge.org

## License

By contributing, you agree that your contributions will be licensed under the MIT License.