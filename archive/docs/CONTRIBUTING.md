# Contributing to Base ETH Faucet

Thank you for your interest in contributing to the Base ETH Faucet! We welcome contributions from the community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/base-faucet.git
   cd base-faucet
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/base-faucet.git
   ```

4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)**

## Making Changes

### Before You Start

- Check existing issues and PRs to avoid duplicates
- For major changes, open an issue first to discuss
- Keep changes focused and atomic

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat: add social verification for claims"
git commit -m "fix: resolve wallet connection issue on mobile"
git commit -m "docs: update README with new features"
```

## Pull Request Process

1. **Update your fork**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run quality checks**
   ```bash
   npm run lint
   npm run type-check
   npm run format:check
   npm run build
   ```

3. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Fill out the PR template
   - Link related issues

5. **PR Review**
   - Wait for maintainer review
   - Address feedback promptly
   - Keep PR updated with main branch

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Avoid `any` types (use `unknown` if necessary)
- Properly type all functions and components
- Use interfaces for object shapes

```typescript
// Good
interface UserProps {
  address: Address;
  balance: bigint;
}

// Avoid
const data: any = {};
```

### React Components

- Use functional components with hooks
- Prefer named exports for components
- Use TypeScript for prop types
- Keep components focused and small

```typescript
interface ButtonProps {
  onClick: () => void;
  children: ReactNode;
}

export function Button({ onClick, children }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `FaucetCard.tsx`)
- Hooks: `use-kebab-case.ts` (e.g., `use-claim.ts`)
- Utils: `kebab-case.ts` (e.g., `format-address.ts`)
- Types: `kebab-case.d.ts` (e.g., `index.d.ts`)

### Code Style

We use Prettier for formatting. Run before committing:

```bash
npm run format
```

**Key rules:**
- 2 spaces for indentation
- Single quotes for strings
- No semicolons (except where required)
- 100 character line length
- Trailing commas in multiline

### Accessibility

- Use semantic HTML elements
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Respect `prefers-reduced-motion`

```typescript
<button
  aria-label="Claim ETH"
  onClick={handleClaim}
>
  Claim
</button>
```

### Performance

- Lazy load heavy components
- Memoize expensive computations
- Optimize images
- Minimize bundle size
- Use React Query for data fetching

```typescript
const MemoizedComponent = memo(({ data }) => {
  return <div>{data}</div>;
});
```

## Testing

### Unit Tests

```bash
npm test
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Build Test

```bash
npm run build
```

## What to Contribute

### Good First Issues

Look for issues labeled `good first issue`:
- Documentation improvements
- UI/UX enhancements
- Bug fixes
- Accessibility improvements

### Feature Ideas

- Social verification (Twitter, Discord)
- Multi-chain support
- Admin analytics dashboard
- Claim leaderboard
- Referral system
- Enhanced security features

### Documentation

- Improve README
- Add code comments
- Create tutorials
- Update design system docs

## Questions?

- Open an issue for bugs or features
- Use discussions for questions
- Join our Discord (if available)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Base ETH Faucet! 🌊**


