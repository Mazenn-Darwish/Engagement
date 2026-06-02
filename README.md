# Mazen & Doha — Engagement Invitation

A Blazor WebAssembly engagement invitation site with a live countdown, animated gold petals, and a Google Sheets–backed RSVP form.

---

## Running locally

```bash
cd INV
dotnet watch
```

The site is served at `https://localhost:5001` (or the port shown in the terminal).  
Hot-reload is active: saving any `.razor`, `.cs`, or `.css` file refreshes the browser automatically.

---

## Deploying to GitHub Pages

### One-time setup

1. **Create a GitHub repository** named `engagement` (or any name — just update the `base href` in the workflow).

2. **Push this project to the `main` branch:**
   ```bash
   git init
   git remote add origin https://github.com/YOUR_USERNAME/engagement.git
   git add .
   git commit -m "initial commit"
   git push -u origin main
   ```

3. **Enable GitHub Pages in the repo settings:**
   - Go to *Settings → Pages*.
   - Under *Source*, choose **GitHub Actions**.

4. **Push again (or re-run the workflow)** — the site will be live at:
   ```
   https://YOUR_USERNAME.github.io/engagement/
   ```

> If your repo is named something other than `engagement`, edit the `sed` line in `.github/workflows/deploy.yml` to match.

---

## Setting up the Google Apps Script RSVP webhook

### Step 1 — Create the script

1. Open [script.google.com](https://script.google.com) and click **New project**.
2. Open a Google Sheet you want to use for responses, or create one.
3. In the Apps Script editor, delete the default code and paste the entire contents of `docs/google-apps-script.js`.
4. Save the project (Ctrl+S).

### Step 2 — Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Choose type: **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy** and **Authorize** when prompted.
5. Copy the **Web app URL** (it looks like `https://script.google.com/macros/s/AKfyc.../exec`).

### Step 3 — Link the URL to the Blazor app

Open `Services/RsvpService.cs` and replace the placeholder:

```csharp
// TODO: Replace with your deployed Google Apps Script Web App URL
private const string WebhookUrl = "https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec";
```

Paste your Web App URL in place of the constant value, then redeploy.

### Notes on CORS

Google Apps Script Web Apps redirect requests to a `run.googleapis.com` URL.  
Blazor WASM's `HttpClient` follows the redirect, and the Apps Script runtime adds CORS headers on the final response.  
If you see CORS errors in the browser console, re-check that:
- *Who has access* is set to **Anyone** (not "Anyone with Google Account").
- You copied the URL from the *latest* deployment, not an older version.

---

## File reference

| File | Blazor concept illustrated |
|------|---------------------------|
| `INV.csproj` | Blazor WebAssembly SDK and target framework |
| `Program.cs` | Dependency injection — `HttpClient`, custom services |
| `App.razor` | `Router` component and `RouteView` |
| `_Imports.razor` | Global `@using` directives |
| `Pages/Index.razor` | `@page`, `@inject`, `@implements IDisposable`, `OnAfterRenderAsync`, `System.Threading.Timer`, component state |
| `Models/RsvpModel.cs` | Data Annotations validation attributes |
| `Services/RsvpService.cs` | Scoped service, `HttpClient`, async/await |
| `wwwroot/index.html` | App shell, loading screen, Open Graph meta tags |
| `wwwroot/css/app.css` | CSS custom properties, `clamp()` responsive sizing |
| `wwwroot/js/petals.js` | JS interop target — called via `IJSRuntime.InvokeVoidAsync` |
| `EditForm` (in Index.razor) | `EditForm`, `DataAnnotationsValidator`, `ValidationMessage`, `InputRadioGroup` |
| `.github/workflows/deploy.yml` | GitHub Actions CI/CD — publish, base-href patch, Pages deploy |
| `docs/google-apps-script.js` | Server-side webhook (Google Apps Script, not .NET) |
