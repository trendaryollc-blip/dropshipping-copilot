# Git hooks

To enable the shared hooks for this repository run:

```bash
git config core.hooksPath .githooks
```

This will make Git run the scripts in `.githooks/` as hooks for this repository.

The included `pre-commit` hook prevents accidental commits of `.env` files.
