# Firebase Configuration Setup

## Step 1: Create .env.local file

Create a file named `.env.local` in your project root with the following content:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id-here
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id-here
```

## Step 2: Get Your Firebase Config

1. Go to https://console.firebase.google.com
2. Select your existing project (the one your online store uses)
3. Click the gear icon (⚙️) → Project Settings
4. Scroll down to "Your apps" section
5. Click the </> icon (Web app)
6. Enter app name: `dropease`
7. Click Register app
8. Copy the firebaseConfig object
9. Replace the placeholder values in .env.local with your actual values

## Step 3: Install Firebase Dependencies

Run this command in your terminal:

```bash
npm install
```

This will install the Firebase SDK that was added to package.json.

## Step 4: Verify Configuration

After setting up .env.local, the app will automatically detect if Firebase is configured.
- If configured: Real Firestore operations
- If not configured: Falls back to mock data (safe for development)

## Collection Structure

The following collections will be used in Firestore:

- `dropease_products` - Product catalog
- `dropease_suppliers` - Supplier information
- `dropease_orders` - Order management
- `dropease_users` - User accounts
- `dropease_automation_rules` - Automation configurations
- `dropease_notifications` - User notifications
- `dropease_analytics` - Analytics data

## Security Rules

- Staging rules (firebase/firestore.rules.staging): Open for testing
- Production rules (firebase/firestore.rules.prod): Requires authentication
