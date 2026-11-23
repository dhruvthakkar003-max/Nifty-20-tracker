# Nifty Top-20 – GitHub Pages PWA

## Fix “only name on home screen” / blank open

1. On your phone: **delete the old home-screen icon**
2. In Chrome: open the site → ⋮ → **Settings** → **Site settings** → **Clear & reset**
   (or Chrome → padlock → Clear data for this site)
3. Re-upload **all files** from this folder to repo **root**
4. Open: `https://USERNAME.github.io/REPO_NAME/`
5. Wait until you see Ranking / Buy-Sell tabs (full app)
6. Then: **Install app** / **Add to Home Screen** again

## Deploy

Upload these to the **root** of a public GitHub repo:

- index.html
- manifest.webmanifest
- sw.js
- icon-192.png
- icon-512.png

Settings → Pages → Deploy from branch → `main` → `/ (root)`

App URL must look like:
`https://yourname.github.io/your-repo/`

Not:
`https://github.com/yourname/your-repo`
