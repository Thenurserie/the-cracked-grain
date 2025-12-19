# Square Credentials Quick Reference

## Where to Get Your Square Credentials

### Step 1: Access Square Developer Dashboard
- Go to: **https://developer.squareup.com**
- Sign in with your Square account (The Nurserie)

### Step 2: Navigate to Applications
- Click **"Applications"** in the top menu
- You should see your application (or create a new one)

### Step 3: Get Sandbox Credentials (for Testing)

Click on your application, then click the **"Sandbox"** tab:

1. **Application ID**
   - Found under "Sandbox Application ID"
   - Starts with `sandbox-sq0idb-`
   - Example: `sandbox-sq0idb-ABC123XYZ456`
   - This is **PUBLIC** - safe to expose in browser

2. **Access Token**
   - Click "Show" next to "Sandbox Access Token"
   - Starts with `EAAA` (very long string)
   - Example: `EAAAl... (200+ characters)`
   - This is **SECRET** - never expose to browser

3. **Location ID**
   - Click "Locations" tab
   - Copy the Location ID for your test location
   - Starts with `L` followed by characters
   - Example: `LABCDE123456`

### Step 4: Get Production Credentials (for Live Payments)

Click the **"Production"** tab:

1. **Application ID**
   - Found under "Production Application ID"
   - Starts with `sq0idp-`
   - Example: `sq0idp-ABC123XYZ456`
   - This is **PUBLIC** - safe to expose in browser

2. **Access Token**
   - Click "Show" next to "Production Access Token"
   - Starts with `EAAAE` (very long string)
   - Example: `EAAAE... (200+ characters)`
   - This is **SECRET** - never expose to browser

3. **Location ID**
   - Go to main Square Dashboard: https://squareup.com/dashboard
   - Click "Account & Settings" → "Business" → "Locations"
   - Copy your Location ID
   - Example: `LAB456DEF789`

---

## Add to Your Project

### Create .env.local file

In your project root, create `.env.local`:

```env
# Square Sandbox (Testing)
NEXT_PUBLIC_SQUARE_APPLICATION_ID="sandbox-sq0idb-YOUR_ACTUAL_APP_ID"
SQUARE_ACCESS_TOKEN="YOUR_ACTUAL_SANDBOX_ACCESS_TOKEN"
SQUARE_LOCATION_ID="YOUR_ACTUAL_LOCATION_ID"
SQUARE_ENVIRONMENT="sandbox"
```

**Replace:**
- `YOUR_ACTUAL_APP_ID` with your actual Sandbox Application ID
- `YOUR_ACTUAL_SANDBOX_ACCESS_TOKEN` with your actual token
- `YOUR_ACTUAL_LOCATION_ID` with your actual location ID

### Important Security Notes

✅ **Safe to expose (NEXT_PUBLIC_* variables):**
- `NEXT_PUBLIC_SQUARE_APPLICATION_ID` - needed in browser for Square SDK

❌ **NEVER expose (server-only variables):**
- `SQUARE_ACCESS_TOKEN` - has full API access to your Square account
- `SQUARE_LOCATION_ID` - not sensitive but keep server-side

---

## Testing Credentials

### Test Credit Cards (Sandbox Only)

When testing in Sandbox mode, use these test cards:

**Visa (Success):**
```
Card Number: 4111 1111 1111 1111
Expiration: 12/25 (any future date)
CVV: 123 (any 3 digits)
ZIP: 12345 (any 5 digits)
```

**Mastercard (Success):**
```
Card Number: 5105 1051 0510 5100
Expiration: 12/25
CVV: 123
ZIP: 12345
```

**Declined Card (for testing errors):**
```
Card Number: 4000 0000 0000 0002
Expiration: 12/25
CVV: 123
ZIP: 12345
```

---

## Switch to Production

When ready to accept real payments:

1. **Update .env.local:**
   ```env
   # Switch to production credentials
   NEXT_PUBLIC_SQUARE_APPLICATION_ID="sq0idp-YOUR_PRODUCTION_APP_ID"
   SQUARE_ACCESS_TOKEN="YOUR_PRODUCTION_ACCESS_TOKEN"
   SQUARE_LOCATION_ID="YOUR_PRODUCTION_LOCATION_ID"
   SQUARE_ENVIRONMENT="production"
   ```

2. **Test with small amount first** (like $0.01)

3. **Monitor Square Dashboard** for real payments

---

## Credential Checklist

Before starting development:

- [ ] Logged into Square Developer Dashboard
- [ ] Created/found application
- [ ] Copied Sandbox Application ID
- [ ] Copied Sandbox Access Token
- [ ] Copied Sandbox Location ID
- [ ] Created .env.local file
- [ ] Added all sandbox credentials
- [ ] Set SQUARE_ENVIRONMENT="sandbox"
- [ ] Restarted dev server (`npm run dev`)

Before going live:

- [ ] Copied Production Application ID
- [ ] Copied Production Access Token
- [ ] Copied Production Location ID
- [ ] Updated .env.local with production credentials
- [ ] Changed SQUARE_ENVIRONMENT="production"
- [ ] Tested with small real payment
- [ ] Verified payment in Square Dashboard
- [ ] Restarted production server

---

## Need Help?

### Square Support Links

- **Developer Dashboard**: https://developer.squareup.com/apps
- **Documentation**: https://developer.squareup.com/docs
- **Web Payments SDK**: https://developer.squareup.com/docs/web-payments/overview
- **API Reference**: https://developer.squareup.com/reference/square
- **Support**: https://developer.squareup.com/forums

### Common Issues

**"Invalid credentials" error:**
- Double-check you copied the entire access token
- Make sure you're using sandbox token with sandbox environment
- Verify no extra spaces in .env.local

**"Location not found" error:**
- Verify Location ID is correct
- Check you're using a location that exists in your account
- For sandbox, use a sandbox test location

**Payments not showing in dashboard:**
- Sandbox payments only show in Sandbox dashboard
- Production payments show in main Square dashboard
- Check you're looking at the right environment

---

## Quick Start Command

After adding credentials to `.env.local`:

```bash
# Restart your dev server to load new environment variables
npm run dev
```

Then navigate to your checkout page and test with sandbox cards!
