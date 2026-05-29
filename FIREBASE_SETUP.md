# Firebase Setup Guide — Dropship Autopilot

## Prerequisites

- Firebase CLI: `npm install -g firebase-tools`
- Login: `firebase login`
- Select project: `firebase projects:select new-automation-app-7dd33`

---

## Step 1: Create Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/project/new-automation-app-7dd33/firestore)
2. Click **Create database**
3. Choose **Production mode** → Next
4. Select a location (e.g., `us-central`) → Done

---

## Step 2: Deploy Firestore Security Rules

From the project root:

```bash
firebase deploy --only firestore:rules
```

The rules are already defined in `firestore.rules` at the project root.

---

## Step 3: Create Composite Indexes

Go to **Firestore → Indexes** in Firebase Console and add these composite indexes:

### Products collection
| Collection | Fields | Query scope |
|------------|--------|-------------|
| products | userId (Asc), createdAt (Desc) | Collection |
| products | userId (Asc), status (Asc) | Collection |
| products | userId (Asc), score (Desc) | Collection |
| products | userId (Asc), niche (Asc) | Collection |
| products | userId (Asc), source (Asc) | Collection |

### Orders collection
| Collection | Fields | Query scope |
|------------|--------|-------------|
| orders | userId (Asc), createdAt (Desc) | Collection |
| orders | userId (Asc), status (Asc) | Collection |
| orders | userId (Asc), orderNumber (Asc) | Collection |

### Automations collection
| Collection | Fields | Query scope |
|------------|--------|-------------|
| automations | userId (Asc), createdAt (Desc) | Collection |
| automations | userId (Asc), status (Asc) | Collection |
| automations | userId (Asc), moduleId (Asc) | Collection |

### Workflow runs collection
| Collection | Fields | Query scope |
|------------|--------|-------------|
| workflow_runs | workflowId (Asc), startedAt (Desc) | Collection |
| workflow_runs | userId (Asc), startedAt (Desc) | Collection |

### Team invitations
| Collection | Fields | Query scope |
|------------|--------|-------------|
| team_invitations | email (Asc), status (Asc) | Collection |
| team_invitations | invitedBy (Asc), status (Asc) | Collection |

### Suppliers collection
| Collection | Fields | Query scope |
|------------|--------|-------------|
| suppliers | userId (Asc), isActive (Asc) | Collection |
| suppliers | userId (Asc), platform (Asc) | Collection |

### Users collection
| Collection | Fields | Query scope |
|------------|--------|-------------|
| users | email (Asc) | Collection |
| users | createdAt (Desc) | Collection |

**Or deploy via CLI** — create `firestore.indexes.json` at project root:

```json
{
  "indexes": [
    {
      "collectionGroup": "products",
      "queryScope": "COLLECTION",
      "fields": [{ "fieldPath": "userId", "order": "ASCENDING" }, { "fieldPath": "createdAt", "order": "DESCENDING" }]
    },
    {
      "collectionGroup": "products",
      "queryScope": "COLLECTION",
      "fields": [{ "fieldPath": "userId", "order": "ASCENDING" }, { "fieldPath": "status", "order": "ASCENDING" }]
    },
    {
      "collectionGroup": "products",
      "queryScope": "COLLECTION",
      "fields": [{ "fieldPath": "userId", "order": "ASCENDING" }, { "fieldPath": "score", "order": "DESCENDING" }]
    },
    {
      "collectionGroup": "products",
      "queryScope": "COLLECTION",
      "fields": [{ "fieldPath": "userId", "order": "ASCENDING" }, { "fieldPath": "niche", "order": "ASCENDING" }]
    },
    {
      "collectionGroup": "products",
      "queryScope": "COLLECTION",
      "fields": [{ "fieldPath": "userId", "order": "ASCENDING" }, { "fieldPath": "source", "order": "ASCENDING" }]
    },
    {
      "collectionGroup": "orders",
      "queryScope": "COLLECTION",
      "fields": [{ "fieldPath": "userId", "order": "ASCENDING" }, { "fieldPath": "createdAt", "order": "DESCENDING" }]
    },
    {
      "collectionGroup": "orders",
      "queryScope": "COLLECTION",
      "fields": [{ "fieldPath": "userId", "order": "ASCENDING" }, { "fieldPath": "status", "order": "ASCENDING" }]
    },
    {
      "collectionGroup": "orders",
      "queryScope": "COLLECTION",
      "fields": [{ "fieldPath": "userId", "order": "ASCENDING" }, { "fieldPath": "orderNumber", "order": "ASCENDING" }]
    },
    {
      "collectionGroup": "automations",
      "queryScope": "COLLECTION",
      "fields": [{ "fieldPath": "userId", "order": "ASCENDING" }, { "fieldPath": "createdAt", "order": "DESCENDING" }]
    },
    {
      "collectionGroup": "automations",
      "queryScope": "COLLECTION",
      "fields": [{ "fieldPath": "userId", "order": "ASCENDING" }, { "fieldPath": "status", "order": "ASCENDING" }]
    },
    {
      "collectionGroup": "automations",
      "queryScope": "COLLECTION",
      "fields": [{ "fieldPath": "userId", "order": "ASCENDING" }, { "fieldPath": "moduleId", "order": "ASCENDING" }]
    },
    {
      "collectionGroup": "workflow_runs",
      "queryScope": "COLLECTION",
      "fields": [{ "fieldPath": "workflowId", "order": "ASCENDING" }, { "fieldPath": "startedAt", "order": "DESCENDING" }]
    },
    {
      "collectionGroup": "workflow_runs",
      "queryScope": "COLLECTION",
      "fields": [{ "fieldPath": "userId", "order": "ASCENDING" }, { "fieldPath": "startedAt", "order": "DESCENDING" }]
    },
    {
      "collectionGroup": "team_invitations",
      "queryScope": "COLLECTION",
      "fields": [{ "fieldPath": "email", "order": "ASCENDING" }, { "fieldPath": "status", "order": "ASCENDING" }]
    },
    {
      "collectionGroup": "team_invitations",
      "queryScope": "COLLECTION",
      "fields": [{ "fieldPath": "invitedBy", "order": "ASCENDING" }, { "fieldPath": "status", "order": "ASCENDING" }]
    },
    {
      "collectionGroup": "suppliers",
      "queryScope": "COLLECTION",
      "fields": [{ "fieldPath": "userId", "order": "ASCENDING" }, { "fieldPath": "isActive", "order": "ASCENDING" }]
    },
    {
      "collectionGroup": "suppliers",
      "queryScope": "COLLECTION",
      "fields": [{ "fieldPath": "userId", "order": "ASCENDING" }, { "fieldPath": "platform", "order": "ASCENDING" }]
    },
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [{ "fieldPath": "email", "order": "ASCENDING" }]
    },
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [{ "fieldPath": "createdAt", "order": "DESCENDING" }]
    }
  ]
}
```

Then deploy with:

```bash
firebase deploy --only firestore:indexes
```

---

## Step 4: Enable Firebase Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
   - Enable "Email link (passwordless sign-in)" if you want magic link login
3. Enable **Google**
   - Select the same Firebase project Web app from Step 5
4. Click **Save**

---

## Step 5: Add Authorized Domains

In **Authentication → Settings → Authorized domains**, add:

- `localhost`
- `127.0.0.1`
- Your network IP (e.g., `192.168.x.x`) — only if accessing via LAN
- Your deployed domain (e.g., `your-app.vercel.app`) after deployment

Direct link: https://console.firebase.google.com/project/new-automation-app-7dd33/authentication/settings

---

## Step 6: Verify Web App Configuration

1. Go to **Project Settings → General**
2. Scroll to **Your apps** — you should see a Web app (`1:1042435665365:web:f6b46f682cf02be389615c`)
3. If not, click **Add app → Web** and register it

---

## Step 7: Environment Variables Check

Your `.env.local` should have these values (already set with the new Firebase key):

```env
# Firebase Web (client — login/register UI)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAVRpf4TdRWdrLVqAXr5D4bhCVgDLMhXkA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=new-automation-app-7dd33.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=new-automation-app-7dd33
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=new-automation-app-7dd33.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1042435665365
NEXT_PUBLIC_FIREBASE_APP_ID=1:1042435665365:web:f6b46f682cf02be389615c

# Firebase Admin (server — Firestore + session cookies)
FIREBASE_PROJECT_ID=new-automation-app-7dd33
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@new-automation-app-7dd33.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## Step 8: Deploy Security Rules & Indexes via CLI

```bash
# Login to Firebase
firebase login

# Initialize (if not done)
firebase init firestore

# Deploy rules and indexes
firebase deploy --only firestore:rules,firestore:indexes
```

---

## Step 9: Test Sign-In

1. Run `npm run dev`
2. Go to `http://localhost:3000/login`
3. Try registering a new account or signing in with Google

If you see "Firebase login is not active yet", check that `.env.local` exists and restart the dev server.

---

## Collection Reference

| Collection | Purpose |
|------------|---------|
| `users` | User profiles (keyed by Firebase UID) |
| `api_keys` | Encrypted third-party API keys |
| `products` | Product catalog and research results |
| `suppliers` | Supplier integrations and configs |
| `orders` | Customer orders and tracking |
| `automations` | Automation run history |
| `workflows` | Visual workflow definitions |
| `workflow_runs` | Workflow execution logs |
| `team_members` | Active team memberships |
| `team_invitations` | Pending team invitations |
| `settings` | User preferences (keyed by UID) |
| `notifications` | In-app notification feed |
| `prompt_templates` | AI prompt templates |
| `webhooks` | Outbound webhook endpoints |
| `webhook_deliveries` | Webhook delivery logs |
| `audit_logs` | Immutable activity logs |
| `analytics` | Daily aggregated stats |
| `billing_usage` | Usage metering |
| `subscriptions` | Subscription plan records |

---

## Troubleshooting

### "Firebase Auth is not configured"
- Ensure `NEXT_PUBLIC_FIREBASE_API_KEY` is set in `.env.local`
- Restart the dev server after modifying `.env.local`
- Check **Authentication → Sign-in method** to ensure Email/Password and Google are enabled

### "Server Firebase Admin misconfigured"
- Check `FIREBASE_PRIVATE_KEY` in `.env.local` is valid
- Ensure `FIREBASE_CLIENT_EMAIL` matches the service account email
- Ensure `FIREBASE_PROJECT_ID` is correct

### "Missing Firestore index"
- Deploy indexes via: `firebase deploy --only firestore:indexes`
- Or add manually in Firebase Console → Firestore → Indexes

### Sign-in redirects to /login
- Check that authorized domains include your current URL
- For localhost, ensure you're using `localhost:3000` not an IP address