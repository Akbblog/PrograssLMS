# Gmail SMTP Setup Guide

To enable email notifications for the Contact Us form, you need to configure a Gmail App Password.

## Step 1: Enable 2-Factor Authentication (2FA)
1. Go to your [Google Account Settings](https://myaccount.google.com/).
2. Navigate to **Security**.
3. Under "How you sign in to Google", turn on **2-Step Verification**.

## Step 2: Generate App Password
*Note: As of 2024, if "App passwords" isn't visible, search for it in the search bar at the top of the Google Account page.*

1. Search for **"App passwords"** in the Google Account search bar.
2. Create a new app password:
   - **App name:** `LMS Contact Form`
3. Click **Create**.
4. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`).

## Step 3: Configure Environment Variables
1. Open `f:\webTest\LMS\backend\.env`.
2. Add the following lines:

```env
GMAIL_USER=your.email@gmail.com
GMAIL_PASS=abcd efgh ijkl mnop
```

*(Replace `your.email@gmail.com` with your actual Gmail address and the password with the App Password you just generated)*.

## Step 4: Restart Backend
Restart the backend server for changes to take effect:

```bash
cd backend
npm run dev
```
