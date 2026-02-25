# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Repository Overview

The `certsuite-operator-plugin` is an OpenShift Dynamic Console Plugin that extends the OpenShift web console UI for the Certification Suite Operator. This TypeScript/React-based plugin enables users to:

- Run certification test suites directly from the OpenShift console
- View and manage CertsuiteRun custom resources
- Review certification test results with an interactive progress bar and filtering
- Access related Kubernetes resources (Secrets, ConfigMaps) through a dedicated navigation section

The plugin integrates with the [certsuite-operator](https://github.com/redhat-best-practices-for-k8s/certsuite-operator) and displays results from the [certsuite](https://github.com/redhat-best-practices-for-k8s/certsuite) test framework.

## Build Commands

### Docker/Container Build
```bash
make docker-build      # Build container image (default: certsuite-operator-plugin)
make docker-push       # Push container image to registry
IMG=custom-image make docker-build  # Build with custom image name
```

### Development Build
```bash
yarn install           # Install dependencies
yarn build             # Production build (clean + webpack)
yarn build-dev         # Development build (clean + webpack without optimization)
yarn clean             # Remove dist directory
```

### Start Development Server
```bash
yarn start             # Start webpack dev server on port 9001
yarn start-console     # Start local OpenShift console with plugin
```

## Test Commands

### Integration Tests (Cypress)
```bash
yarn test-cypress           # Open Cypress test runner (interactive)
yarn test-cypress-headless  # Run Cypress tests headlessly
yarn cypress-postreport     # Generate test report after run
```

### Linting
```bash
make lint              # Run all linters (hadolint, shfmt, typos, markdownlint, yamllint)
yarn lint              # Run ESLint and Stylelint with auto-fix
```

### i18n Validation
```bash
yarn i18n              # Build internationalization files
./test-frontend.sh     # Verify i18n files are up to date
```

## Code Organization

```
certsuite-operator-plugin/
├── src/
│   └── components/           # React components
│       ├── CertsuiteRunPage.tsx   # List page for CertsuiteRun CRs
│       ├── ResultsPage.tsx        # Results display with filtering
│       ├── ProgressBar.tsx        # Visual summary of test results
│       ├── ConfigMapList.tsx      # ConfigMap listing component
│       ├── SecretList.tsx         # Secret listing component
│       ├── plugin.ts              # Plugin exports
│       └── example.css            # Component styles
├── integration-tests/        # Cypress e2e tests
│   ├── tests/                # Test specifications
│   ├── fixtures/             # Test fixtures
│   ├── plugins/              # Cypress plugins
│   ├── support/              # Test support files
│   └── cypress.config.js     # Cypress configuration
├── locales/                  # i18n translation files
├── i18n-scripts/             # Internationalization build scripts
├── console-extensions.json   # OpenShift console extension definitions
├── webpack.config.ts         # Webpack configuration
├── package.json              # Node.js dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── Dockerfile                # Multi-stage container build
├── Makefile                  # Build automation
└── start-console.sh          # Local console development script
```

### Key Files

- **console-extensions.json**: Defines console extensions including:
  - Navigation section "Certification Suites"
  - CertsuiteRun resource pages and navigation items
  - Secrets and ConfigMaps navigation within the section
  - Results tab as a horizontal nav component

- **webpack.config.ts**: Configures webpack with:
  - ConsoleRemotePlugin for OpenShift console integration
  - TypeScript/TSX loader
  - CSS processing
  - Dev server on port 9001

## Key Dependencies

### OpenShift Console SDK
- `@openshift-console/dynamic-plugin-sdk`: Core plugin SDK (v1.2.0)
- `@openshift-console/dynamic-plugin-sdk-webpack`: Webpack integration

### UI Framework
- `@patternfly/react-core`: PatternFly React components (v5.1.1)
- `@patternfly/react-icons`: PatternFly icons
- `react`: React 17.x
- `react-router-dom`: React Router 5.3.x

### Build Tools
- `typescript`: TypeScript 4.7.x
- `webpack`: Webpack 5.75.0
- `ts-loader`: TypeScript webpack loader

### Testing
- `cypress`: E2E testing framework (v13.11.0)
- `cypress-multi-reporters`: Test reporting

### Linting
- `eslint`: JavaScript/TypeScript linting
- `prettier`: Code formatting
- `stylelint`: CSS linting

## Development Guidelines

### Plugin Architecture

The plugin uses the OpenShift Dynamic Plugin SDK pattern:
1. Extensions are declared in `console-extensions.json`
2. Components are exposed via `consolePlugin.exposedModules` in `package.json`
3. The webpack build produces a plugin manifest consumed by the OpenShift console

### Custom Resource Integration

The plugin works with the `CertsuiteRun` custom resource:
- **Group**: `best-practices-for-k8s.openshift.io`
- **Version**: `v1alpha1`
- **Kind**: `CertsuiteRun`

Components use `useK8sWatchResource` hook to watch and display CertsuiteRun resources.

### Component Patterns

- Use PatternFly components for UI consistency
- Use `useTranslation` hook for i18n support
- Follow the `ListPage` + `VirtualizedTable` pattern for resource lists
- Use `ResourceLink` for clickable resource references

### Internationalization

- Translation keys use the pattern `plugin__certsuite-operator-plugin~<key>`
- Run `yarn i18n` after adding new translation strings
- Translation files are in `locales/` directory

### Local Development

1. Ensure you're logged into an OpenShift cluster: `oc login`
2. Start the webpack dev server: `yarn start`
3. In another terminal, start the console: `yarn start-console`
4. Access the console at http://localhost:9000

The `start-console.sh` script automatically:
- Connects to your current OpenShift cluster
- Configures the plugin to load from localhost:9001
- Uses podman or docker to run the console image

### Linting Requirements

All code must pass these linters:
- `hadolint`: Dockerfile linting
- `shfmt`: Shell script formatting
- `typos`: Spell checking
- `markdownlint`: Markdown formatting
- `yamllint`: YAML validation
- `eslint`: TypeScript/JavaScript linting
- `stylelint`: CSS linting

Run `make lint` and `yarn lint` before committing.

### Container Build

The Dockerfile uses a multi-stage build:
1. **Build stage**: Node.js 20 on UBI8, runs yarn install and build
2. **Runtime stage**: Nginx 1.20 on UBI8, serves static files from `/usr/share/nginx/html`

The plugin is served as static assets via nginx.

## Common Workflows

### Adding a New Component

1. Create component in `src/components/`
2. Export in `package.json` under `consolePlugin.exposedModules` if needed
3. Add console extension in `console-extensions.json` if adding new navigation/pages
4. Run `yarn lint` to fix formatting

### Testing Changes Locally

```bash
# Terminal 1: Start dev server
yarn start

# Terminal 2: Start console
yarn start-console

# Access http://localhost:9000
```

### Building for Deployment

```bash
yarn build                    # Build production assets
make docker-build             # Build container image
make docker-push              # Push to registry
```

### Enabling the Plugin

After deploying the operator:

**Via OLM**: Plugin should auto-enable. Check `Operators` -> `Installed Operators` -> `certsuite-operator` -> enable Console plugin checkbox.

**Manual deployment**: Navigate to `Administration` -> `Cluster Settings` -> `Configuration` -> `Console operator.openshift.io` -> `Console plugins` -> enable `certsuite-operator-plugin`.
