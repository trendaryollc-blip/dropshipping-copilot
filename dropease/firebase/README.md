# Firestore rules and deployment

Files:
- `firestore.rules.staging` — permissive rules for staging (for testing only).
- `firestore.rules.prod` — stricter rules for production (require auth).

Deploy (run from repo root):
```bash
bash ./scripts/deploy-firestore-rules.sh
```

Notes:
- Staging rules are intentionally open for development only — DO NOT leave them open in production.
- The deployment uses the Firebase CLI; ensure you are logged in with `firebase login` and have access to the projects.
- For production service accounts, create a `trendaryo-automation-prod-admin` service account in Google Cloud Console and store its key securely (do not commit).
