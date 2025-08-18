# ⚡ Quick Start Guide - 5 Minutes to Live

## 🎯 What You'll Have
- ✅ Professional invoice system
- ✅ Free MongoDB database
- ✅ Free Netlify hosting
- ✅ PDF export functionality
- ✅ Complete invoice management

## 🚀 5-Minute Setup

### Step 1: MongoDB Atlas (2 minutes)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" → Create account
3. Create project: "Acrecert Facturation"
4. Build database → Choose "FREE" tier
5. Create database user:
   - Username: `acrecert_user`
   - Password: [create strong password]
   - Privileges: Read and write to any database
6. Network Access → "Allow Access from Anywhere"
7. Database → Connect → "Connect your application"
8. Copy connection string and modify:
   ```
   mongodb+srv://acrecert_user:yourpassword@cluster.mongodb.net/facturation?retryWrites=true&w=majority
   ```

### Step 2: GitHub (1 minute)
1. Create new repository on GitHub
2. Push your code:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

### Step 3: Netlify (2 minutes)
1. Go to [Netlify](https://netlify.com)
2. Sign up with GitHub
3. "New site from Git" → Choose your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Site settings → Environment variables:
   - Key: `MONGODB_URI`
   - Value: [your MongoDB connection string]
6. Deploy site

## 🧪 Test Everything Works

Visit: `your-site.netlify.app/test-connection.html`

Click all three test buttons - they should all show ✅

## 🎉 You're Done!

Your invoice system is now:
- 🌐 Live on the internet
- 🗄️ Connected to MongoDB
- 💰 Completely free
- 📱 Accessible from any device
- 🧾 Ready for professional use

## 📞 Need Help?

- Check `DEPLOYMENT.md` for detailed instructions
- Use `setup-checklist.md` to track progress
- Test page will show specific error messages

## 💡 Pro Tips

- Save your MongoDB connection string securely
- Test the system thoroughly before using with real clients
- Consider adding a custom domain later
- Monitor usage to stay within free tier limits

**Total Cost: $0/month** 🎉
