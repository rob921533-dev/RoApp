RoApp info website (static, no build, no Supabase, no downloads on the page).
Host it on GitHub Pages at the repo root: https://rob921533-dev.github.io/RoApp/
- index.html: the page with the "Try it" demos (all simulated in the browser, nothing saved).
- 404.html: GitHub Pages serves this for /videos/<id>, so share links show an "Open in RoApp" page.
- The same repo is also where the app looks for updates (the app reads these two files):
  - txt.txt     -> only the build number, for example 13
  - RoApp.apk   -> the signed APK (same keystore every time) for "Install update automatically"
  Upload RoApp.apk first, then raise the number in txt.txt.
- In the app: Owner > Tools > Website address (set it to your Pages URL).
