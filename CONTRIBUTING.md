# Contributing to ProjectPilot AI

Thank you for your interest in contributing! 🚀

## How to Contribute

### 1. Fork & Clone
```bash
git clone https://github.com/amitkushwaha2311/Promptwar.git
cd Promptwar
npm install
```

### 2. Create a Feature Branch
```bash
git checkout -b feat/your-feature-name
```

### 3. Development Setup
```bash
npx prisma generate
npx prisma db push
npm run dev
```

### 4. Run Tests Before Committing
```bash
npm test
npm run lint
```

### 5. Commit Convention
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation update
- `test:` — adding tests
- `chore:` — maintenance

### 6. Submit a Pull Request
Open a PR against `main` with a clear description of what you changed and why.

## Code Standards
- TypeScript strict mode is enabled
- All components must be accessible (ARIA labels, keyboard navigable)
- Run `npm run lint` before pushing
- Keep components focused and reusable

## Reporting Issues
Use [GitHub Issues](https://github.com/amitkushwaha2311/Promptwar/issues) to report bugs or request features.

## License
By contributing, you agree your code is licensed under the [MIT License](LICENSE).
