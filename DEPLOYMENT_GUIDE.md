# Deployment Guide (Netlify Only)

Great news! We have configured your project to be a **Monorepo** on Netlify. 
This means you can deploy **both** your Frontend (Next.js) and your Backend (Express/Node.js) to a single Netlify site. No need for Render or any other host.

## How it works
- Your backend code has been wrapped in a **Netlify Function** (`netlify/functions/api.js`).
- We configured `netlify.toml` to build your frontend and headers, while bundling the backend logic into a serverless function.
- All requests to `/api/v1/*` are automatically redirected to this function.

## 1. Environment Variables (Netlify)
You need to set up your environment variables in Netlify > Site Settings > Environment Variables.

### Required Variables:
*   `DB`: Your MongoDB Connection String. (e.g., `mongodb+srv://...`)
    *   *Note:* Ensure your MongoDB Atlas Network Access allows `0.0.0.0/0` (Anywhere), as Netlify IPs change.
*   `JWT_SECRET`: A random string for security.
*   `CLIENT_URL`: `https://progresslms.netlify.app` (Or your specific Netlify URL).
*   `NEXT_PUBLIC_API_URL`: `https://progresslms.netlify.app/api/v1`
    *   **Important:** This points to the *same* site now, specifically the `/api/v1` path which Netlify redirects to your backend function.

## 2. Deploying
1.  **Push your changes** to GitHub.
    *   `git add .`
    *   `git commit -m "Configure for Netlify Only deployment"`
    *   `git push`
2.  Netlify should detect the change and build.
    *   Build Command: `cd backend && npm install && cd ../frontend && npm install && npm run build`
    *   Publish directory: `frontend/.next`
    *   Functions directory: `netlify/functions`

## 3. Troubleshooting
*   **Database Connection:** If login fails, check Netlify Function Logs.
    *   Go to Netlify Dashboard > "Logs" > "Functions" > "api".
    *   Look for "Database connected!" or connection errors.
*   **Cold Starts:** The first request after a while might take a few seconds (~5s). This is normal for serverless functions.
