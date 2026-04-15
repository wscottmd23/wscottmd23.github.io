# Curriculum Vitae - React Web App

This project is a stylized, interactive Curriculum Vitae (CV) built with React, Vite, and Tailwind CSS. It features a responsive two-panel layout, a dark/light mode toggle, dynamic scroll-spy navigation, and a print-friendly PDF download option.

## Local Development Setup

Follow these instructions to run and preview the project locally using Visual Studio Code (VS Code).

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)
- Visual Studio Code (VS Code)

### Running Locally in VS Code
1. **Open the Project:** Open the project folder in VS Code.
2. **Open the Terminal:** Open the integrated terminal in VS Code by going to `Terminal > New Terminal` in the top menu, or by pressing `` Ctrl + ` `` (Windows/Linux) or `` Cmd + ` `` (Mac).
3. **Install Dependencies:** In the terminal, run the following command to install all required packages:
   ```bash
   npm install
   ```
4. **Start the Development Server:** Once installation is complete, start the local development server with:
   ```bash
   npm run dev
   ```
5. **Preview the Webpage:** The terminal will output a local URL (typically `http://localhost:3000` or `http://localhost:5173`). `Ctrl+Click` (or `Cmd+Click` on Mac) that link to open the live preview in your default web browser. Any changes you make to the code will automatically reload in the browser.

---

## Deploying to GitHub Pages

To share your CV publicly, you can host it for free using GitHub Pages. Since this project uses Vite, there are a few specific steps to follow.

### Step 1: Prepare your `package.json`
1. Open `package.json`.
2. Add a `"homepage"` field at the top level of the JSON file (right under the name/version). Replace `<username>` with your GitHub username and `<repo-name>` with your repository name:
   ```json
   "homepage": "https://<username>.github.io/<repo-name>",
   ```
3. In the `"scripts"` section of `package.json`, add these two deployment scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

### Step 2: Update `vite.config.ts`
Open `vite.config.ts` and add the `base` property inside the `defineConfig` object. It must exactly match your repository name, surrounded by slashes:
```typescript
export default defineConfig({
  base: '/<repo-name>/', // Replace <repo-name> with your actual repository name
  plugins: [react(), ...],
})
```
*(Note: If you are deploying to a custom domain or a user site like `username.github.io` directly, you can omit the `base` property or set it to `'/'`)*

### Step 3: Install `gh-pages`
In your VS Code terminal, install the `gh-pages` package as a development dependency. This package handles pushing your built files to GitHub:
```bash
npm install gh-pages --save-dev
```

### Step 4: Push to GitHub
Ensure your code is committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "Prepare for GitHub Pages deployment"
git branch -M main
git push -u origin main
```

### Step 5: Deploy!
Run the deploy script from your terminal:
```bash
npm run deploy
```
This command will automatically build your project (creating a `dist` folder) and push that folder to a new branch in your repository called `gh-pages`.

### Step 6: Configure GitHub Settings
1. Go to your repository on GitHub.com.
2. Click on **Settings** > **Pages** (on the left sidebar).
3. Under **Build and deployment**, ensure the **Source** is set to `Deploy from a branch`.
4. Under **Branch**, select the `gh-pages` branch and the `/ (root)` folder, then click **Save**.
5. Wait a minute or two, refresh the page, and you will see a notification that your site is live at the URL you specified in the `"homepage"` field!
