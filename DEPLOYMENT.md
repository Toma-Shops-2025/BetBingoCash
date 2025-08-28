# 🚀 Deployment Guide for BetBingoCash

This guide will walk you through deploying your BetBingoCash app to Netlify.

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **Supabase Project**: Set up your database (see setup below)

## 🔧 Supabase Setup

1. **Go to your Supabase project**: https://nankdjfsdaipjrtvtddu.supabase.co
2. **Get your credentials**:
   - Go to Settings → API
   - Copy your Project URL and anon key
3. **Set up the database**:
   - Go to SQL Editor
   - Copy and paste the contents of `supabase-schema.sql`
   - Run the SQL commands

## 🌐 Netlify Deployment

### Option 1: Deploy from GitHub (Recommended)

1. **Connect to GitHub**:
   - Log into Netlify
   - Click "New site from Git"
   - Choose GitHub
   - Select your BetBingoCash repository

2. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

3. **Set environment variables**:
   - Go to Site settings → Environment variables
   - Add these variables:
     ```
     VITE_SUPABASE_URL=https://nankdjfsdaipjrtvtddu.supabase.co
     VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
     ```

4. **Deploy**:
   - Click "Deploy site"
   - Wait for build to complete

### Option 2: Manual Deploy

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Upload to Netlify**:
   - Drag and drop the `dist` folder to Netlify
   - Or use Netlify CLI:
     ```bash
     npm install -g netlify-cli
     netlify deploy --prod --dir=dist
     ```

## 🔑 Environment Variables

Make sure these are set in your Netlify dashboard:

```env
VITE_SUPABASE_URL=https://nankdjfsdaipjrtvtddu.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_NAME=BetBingoCash
VITE_APP_URL=https://your-site.netlify.app
```

## 🎯 Custom Domain (Optional)

1. **Go to Site settings → Domain management**
2. **Add custom domain**: `betbingo.live`
3. **Configure DNS** (if using external domain)
4. **Enable HTTPS** (automatic with Netlify)

## 🧪 Testing Your Deployment

1. **Check the homepage loads**
2. **Test user registration**
3. **Test the bingo game**
4. **Verify payment flow**
5. **Check mobile responsiveness**

## 🚨 Common Issues

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies are installed
- Check for TypeScript errors

### App Doesn't Work
- Verify environment variables are set
- Check Supabase connection
- Look at browser console for errors

### Authentication Issues
- Verify Supabase Auth is enabled
- Check RLS policies are set up
- Ensure user table exists

## 📱 Mobile Optimization

Your app is already mobile-optimized with:
- Responsive design
- Touch-friendly controls
- Mobile-first approach
- PWA capabilities

## 🔒 Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables set
- [ ] Supabase RLS policies configured
- [ ] Input validation implemented
- [ ] Authentication working

## 📊 Performance Monitoring

Netlify provides:
- Build analytics
- Performance insights
- Error tracking
- Uptime monitoring

## 🆘 Getting Help

- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **GitHub Issues**: Create an issue in your repo

## 🎉 You're Live!

Once deployed, your BetBingoCash app will be available at:
- Netlify URL: `https://your-site.netlify.app`
- Custom domain: `https://betbingo.live` (if configured)

---

**Happy Deploying! 🚀** 