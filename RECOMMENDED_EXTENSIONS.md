# Recommended VS Code Extensions for Welux Events

This project uses React, Tailwind CSS, Vite, and i18next. To maximize productivity and ensure code quality, we recommend the following extensions.

## Essentials (Must Have)

### 1. **ES7+ React/Redux/React-Native snippets**
- **ID**: `dsznajder.es7-react-js-snippets`
- **Why**: Provides shortcuts like `rafce` to quickly generate React components. Essential for efficiency.

### 2. **Tailwind CSS IntelliSense**
- **ID**: `bradlc.vscode-tailwindcss`
- **Why**: critical for this project. Gives autocomplete for Tailwind classes, shows color previews, and validates class names.

### 3. **Prettier - Code formatter**
- **ID**: `esbenp.prettier-vscode`
- **Why**: Ensures consistent code style (indentation, quotes, etc.) automatically on save.

### 4. **i18n Ally**
- **ID**: `lokalise.i18n-ally`
- **Why**: The best extension for managing `translation.json` files. It shows translations inline in your code and helps find missing keys.

## Useful Utilities

### 5. **ESLint**
- **ID**: `dbaeumer.vscode-eslint`
- **Why**: Catch errors and bugs before running the code.

### 6. **GitHub Actions**
- **ID**: `github.vscode-github-actions`
- **Why**: Helps manage and monitor the workflows we just created (like the Cloudflare purge).

### 7. **Pretty TypeScript Errors**
- **ID**: `yoavbls.pretty-ts-errors`
- **Why**: Makes TypeScript errors much easier to read and understand.

## How to Install
Run the provided script in your terminal:
```bash
./scripts/install_extensions.sh
```
