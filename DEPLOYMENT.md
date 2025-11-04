# 🚀 Deployment Guide - Netlify

This guide will help you deploy your Project Management Dashboard to Netlify.

## 📋 Prerequisites

Before deploying, ensure you have:
- A [Netlify](https://netlify.com) account
- A GitHub/GitLab/Bitbucket repository with this project
- (Optional) Supabase project configured

## 🔧 Environment Variables

If you're using Supabase or other external services, you'll need to set environment variables in Netlify:

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add the following variables:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📦 Deployment Methods

### Method 1: Deploy via Git (Recommended)

1. **Connect your repository to Netlify:**
   - Log in to [Netlify](https://app.netlify.com)
   - Click **Add new site** → **Import an existing project**
   - Choose your Git provider (GitHub, GitLab, or Bitbucket)
   - Select your repository

2. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `build`
   - Base directory: (leave empty)

3. **Deploy:**
   - Click **Deploy site**
   - Netlify will automatically build and deploy your site

### Method 2: Deploy via Netlify CLI

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Login to Netlify:**
```bash
netlify login
```

3. **Initialize and deploy:**
```bash
# Build your project
npm run build

# Deploy to Netlify
netlify deploy --prod
```

### Method 3: Manual Deploy (Drag & Drop)

1. **Build your project locally:**
```bash
npm run build
```

2. **Deploy to Netlify:**
   - Go to [Netlify](https://app.netlify.com)
   - Drag and drop the `build` folder to the deploy area

## ⚙️ Configuration

The `netlify.toml` file includes:

- **Build settings**: Optimised for Vite + React + TypeScript
- **Redirects**: SPA routing support
- **Headers**: Security headers (CSP, XSS protection, etc.)
- **Caching**: Optimised cache headers for static assets
- **Compression**: Automatic asset compression

## 🔒 Security Headers

The deployment includes security headers:
- `X-Frame-Options`: Prevents clickjacking
- `X-XSS-Protection`: Adds XSS protection
- `X-Content-Type-Options`: Prevents MIME type sniffing
- `Referrer-Policy`: Controls referrer information
- `Permissions-Policy`: Controls browser features

## 🎯 Post-Deployment

After deployment:

1. **Custom Domain** (Optional):
   - Go to **Site settings** → **Domain management**
   - Add your custom domain

2. **HTTPS**:
   - Netlify provides free SSL certificates
   - Automatically enabled for all sites

3. **Performance**:
   - Enable **Asset optimization** in Site settings
   - Enable **Branch deploys** for preview environments

## 🔍 Troubleshooting

### Build fails

**Issue**: Build fails with dependency errors

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 404 errors on page refresh

**Issue**: Getting 404 errors when refreshing pages

**Solution**: The `netlify.toml` and `public/_redirects` files should handle this. If not:
1. Ensure `public/_redirects` exists
2. Check that the redirect rule is: `/*    /index.html   200`

### Environment variables not working

**Issue**: Environment variables not being read

**Solution**:
1. Ensure variables are prefixed with `VITE_`
2. Check they're set in Netlify dashboard
3. Trigger a new deploy after adding variables

## 📊 Monitoring

Monitor your deployment:
- **Analytics**: Available in Netlify dashboard
- **Build logs**: Check for any warnings or errors
- **Performance**: Use Lighthouse in Chrome DevTools

## 🆘 Support

- [Netlify Documentation](https://docs.netlify.com)
- [Netlify Community](https://answers.netlify.com)
- [Vite Documentation](https://vitejs.dev)

---

**Last Updated**: November 2025
**Dashboard Version**: 1.0.0

