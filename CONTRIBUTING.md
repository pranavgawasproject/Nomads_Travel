# 🤝 Contributing to RoamIQ

Thank you for your interest in contributing to RoamIQ! We're building the operating system for digital nomads, and we need all the help we can get.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Coding Standards](#coding-standards)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## 📜 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone. We do not tolerate discrimination, harassment, or inappropriate behavior of any kind.

---

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Nomads_Travel.git
   cd Nomads_Travel
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/pranavgawasproject/Nomads_Travel.git
   ```

---

## 💻 Development Setup

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend
cp .env.example .env    # Edit with your credentials
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
cp .env.example .env   # Edit with your API keys
npm install
npm run dev
```

### Verify Installation

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

## 🔄 Making Changes

### 1. Create a Feature Branch

```bash
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
```

### 2. Branch Naming Conventions

| Type | Example |
|------|---------|
| Feature | `feature/job-board-filters` |
| Bug Fix | `fix/login-redirect-issue` |
| Documentation | `docs/update-readme` |
| Refactor | `refactor/api-service-layer` |
| Test | `test/add-auth-tests` |

### 3. Make Your Changes

- Write code following our [Coding Standards](#coding-standards)
- Add comments for complex logic
- Update relevant documentation

### 4. Test Your Changes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm run lint
npm run build
```

---

## 🔀 Pull Request Process

### Before Submitting

1. **Sync with upstream**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all tests**:
   ```bash
   npm test
   ```

3. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

### Creating the PR

1. Go to the original repository
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill out the PR template:
   - **Title**: Clear, concise description
   - **Description**: What does this PR do?
   - **Related Issues**: Link any issues it resolves
   - **Screenshots**: For UI changes

### PR Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented complex code
- [ ] I have made corresponding changes to documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix works
- [ ] New and existing unit tests pass
```

---

## ✍️ Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Formatting, no code change |
| `refactor` | Code refactoring |
| `test` | Adding tests |
| `chore` | Maintenance tasks |

### Examples

```
feat(visa): add AI-powered visa recommendation engine
fix(auth): resolve token refresh race condition
docs(readme): add deployment instructions
refactor(job-board): simplify filter logic
```

---

## 📐 Coding Standards

### JavaScript/React

- Use **functional components** with hooks
- Prefer **const** over **let**, never use **var**
- Use **camelCase** for variables and functions
- Use **PascalCase** for React components
- Use **UPPER_SNAKE_CASE** for constants

### Backend (Node.js/Express)

- Use **async/await** instead of callbacks
- Return proper **HTTP status codes**
- Validate input with **Yup** or **Joi**
- Use **Mongoose** models for database operations

### CSS/Styling

- Use **Tailwind CSS** utility classes
- Follow BEM for custom CSS when needed
- Use CSS variables for theming

### File Organization

```
Frontend:
├── components/     # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom hooks
├── services/       # API calls
├── features/       # Redux slices
└── utils/          # Helper functions

Backend:
├── controllers/    # Request handlers
├── models/         # Database schemas
├── routes/         # API routes
├── middlewares/    # Express middleware
├── config/         # Configuration
└── utils/          # Helper functions
```

---

## 🐛 Reporting Bugs

Before creating a bug report:

1. **Search existing issues** - avoid duplicates
2. **Check if you're on the latest version**
3. **Gather information**:
   - Browser and version
   - Steps to reproduce
   - Expected vs actual behavior
   - Console errors

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Screenshots
If applicable, add screenshots.

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Safari, Firefox]
- Version: [e.g., 1.0.0]

## Additional Context
Any other context about the problem.
```

---

## 💡 Suggesting Features

We love feature ideas! Before suggesting:

1. **Search existing suggestions**
2. **Check if similar features exist**
3. **Consider if it fits the product vision**

### Feature Request Template

```markdown
## Problem/Use Case
What problem does this solve?

## Proposed Solution
Your proposed feature.

## Alternatives Considered
Other solutions you've considered.

## Additional Context
Mockups, examples, or implementation ideas.
```

---

## 🎯 Good First Issues

Looking for a place to start? Check these:

- [Good first issues](https://github.com/pranavgawasproject/Nomads_Travel/labels/good%20first%20issue)
- [Help wanted](https://github.com/pranavgawasproject/Nomads_Travel/labels/help%20wanted)
- [Documentation](https://github.com/pranavgawasproject/Nomads_Travel/labels/docs)

---

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Email**: hello@roamiq.io

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

<p align="center">
  <strong>Thank you for making RoamIQ better! 🌍</strong>
</p>
