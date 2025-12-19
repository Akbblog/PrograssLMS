# Deployment Guide for ProgressLMS

## 1. Deploying the Backend (API)

Your backend is a Node.js/Express application located in the `backend/` folder. We have prepared a `render.yaml` file to make deployment easy on [Render.com](https://render.com).

### Steps:
1.  **Push your code to GitHub.** Ensure your latest changes are committed and pushed to your repository.
2.  **Sign up/Log in to Render.** Go to [dashboard.render.com](https://dashboard.render.com).
3.  **Create a New Blueprint Instance.**
    *   Click "New +" -> "Blueprint".
    *   Connect your GitHub repository.
    *   Render will automatically detect the `render.yaml` file.
    *   Click "Apply".
4.  **Configure Environment Variables.**
    *   The build might fail initially or the service might not start because the Database URL is missing.
    *   Go to your new Service in the Dashboard -> "Environment".
    *   Add a new variable:
        *   **Key:** `DB`
        *   **Value:** `mongodb+srv://...` (Your MongoDB Atlas connection string)
5.  **Get your Backend URL.**
    *   Once deployed, Render will verify you a URL like: `https://progress-lms-backend.onrender.com`
    *   Copy this URL.

## 2. Connecting Frontend to Backend

Now that your backend is live, you need to tell your Netlify frontend where to find it.

1.  **Go to Netlify Dashboard.**
2.  Select your site (`progresslms`).
3.  Go to **Site configuration** -> **Environment variables**.
4.  Add a new variable:
    *   **Key:** `NEXT_PUBLIC_API_URL`
    *   **Value:** `https://progress-lms-backend.onrender.com/api/v1`
    *   *(Make sure to append `/api/v1` if your routes are prefixed with it, which they seem to be based on your logs)*.
5.  **Trigger a new Deploy.**
    *   Go to "Deploys" -> "Trigger deploy" -> "Clear cache and deploy site" just to be safe.

## 3. Verification

Once the frontend finishes redeploying:
1.  Open your Netlify URL (`https://progresslms.netlify.app`).
2.  Open the Network tab in Developer Tools (F12).
3.  Try to Log In.
4.  You should see requests going to your **new Render URL** instead of the Netlify URL.

## Troubleshooting

- **CORS Errors:** If you see CORS errors in the browser console, you may need to update your backend's CORS configuration to allow `https://progresslms.netlify.app`.
    - Check `backend/app/app.js` or `server.js` for `cors()` settings.
- **Database Connection:** Check the Render Logs if the backend fails to start. It usually means the `DB` environment variable is incorrect or the IP is blocked (allow `0.0.0.0/0` in MongoDB Atlas Network Access for Render dynamic IPs).
