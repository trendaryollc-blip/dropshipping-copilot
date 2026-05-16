# Contributing to DropEase

Thank you for contributing to DropEase! This guide covers the basic workflow for developers working with the repository.

## Getting started

1. Fork the repository.
2. Clone your fork locally.
3. Install dependencies with `npm install`.
4. Run the development server with `npm run dev`.

## Branching and workflow

- Create a feature branch for each ticket: `feature/your-feature-name`
- Keep commits small and focused.
- Include tests for all new functionality.
- Update documentation when adding or changing features.

## Code style

- Use TypeScript for new files.
- Keep formatting consistent with existing files.
- Prefer `const` and descriptive variable names.
- Use `use client` in client components only when necessary.

## Testing

- Run unit tests with `npm test`.
- Use `vitest` for service and component tests.

## Deployment

- The app runs on Vercel.
- Ensure environment variables are configured in your Vercel project before deploying.
- Public APIs should be documented in `src/app/api/docs/route.ts`.
