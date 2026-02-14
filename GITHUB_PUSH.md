# Push to GitHub

## Already ignored (won't be pushed)
- **node_modules/** (all project dependencies)
- **.env** and **.env*.local** (your backend DB password and secrets)
- **.expo/** (Expo cache)
- **dist/, web-build/, ios/, android/** (build outputs)

---

## Steps

### 1. Open terminal in project folder
```bash
cd "/Users/user/Desktop/doctor discover app/doctor-discover-app"
```

### 2. Initialize Git (only if this is not already a git repo)
```bash
git init
```

### 3. Add all files (respects .gitignore)
```bash
git add .
```

### 4. First commit
```bash
git commit -m "Initial commit: Doctor Discovery App"
```

### 5. Create a new repo on GitHub
- Go to https://github.com/new
- Create a repository (e.g. `doctor-discovery-app`)
- **Do not** add README, .gitignore, or license (you already have files)

### 6. Add GitHub as remote and push
Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repo name:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

Example:
```bash
git remote add origin https://github.com/sanju/doctor-discovery-app.git
git branch -M main
git push -u origin main
```

---

## Verify before pushing
Check what will be committed (should **not** list .env or node_modules):
```bash
git status
git status --ignored   # optional: see ignored files
```

You can delete this file (GITHUB_PUSH.md) after you're done if you don't want it in the repo.
