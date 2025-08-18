# 🚀 Deployment Guide - MongoDB + Netlify

This guide will help you deploy your invoice application with MongoDB database on Netlify for free.

## 📋 Prerequisites

1. **GitHub Account** - to host your code
2. **Netlify Account** - for hosting (free tier)
3. **MongoDB Atlas Account** - for database (free tier)

## 🗄️ Step 1: Set up MongoDB Atlas (Free)

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project

### 1.2 Create Database Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider and region
4. Click "Create"

### 1.3 Set up Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a username and password (save these!)
4. Select "Read and write to any database"
5. Click "Add User"

### 1.4 Set up Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for Netlify)
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `facturation`

Your connection string should look like:
```
mongodb+srv://username:yourpassword@cluster.mongodb.net/facturation?retryWrites=true&w=majority
```

## 🌐 Step 2: Deploy to Netlify

### 2.1 Push Code to GitHub
1. Create a new repository on GitHub
2. Push your code to the repository

### 2.2 Connect to Netlify
1. Go to [Netlify](https://netlify.com)
2. Sign up/Login with your GitHub account
3. Click "New site from Git"
4. Choose your repository

### 2.3 Configure Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `18`

### 2.4 Set Environment Variables
1. Go to "Site settings" → "Environment variables"
2. Add the following variable:
   - **Key**: `MONGODB_URI`
   - **Value**: Your MongoDB connection string from Step 1.5

### 2.5 Deploy
1. Click "Deploy site"
2. Wait for the build to complete

## 🧪 Step 3: Test Locally (Optional)

### 3.1 Install Dependencies
```bash
npm install
```

### 3.2 Set up Environment Variables
1. Copy `env.example` to `.env`
2. Add your MongoDB connection string

### 3.3 Run Locally
```bash
npm run netlify:dev
```

This will start both the React app and Netlify Functions locally.

## ✅ Step 4: Verify Everything Works

1. **Create an invoice** - Should save to MongoDB
2. **View history** - Should load from MongoDB
3. **Edit invoice** - Should update in MongoDB
4. **Export PDF** - Should work as before

## 🔧 Troubleshooting

### Common Issues:

1. **"Failed to fetch invoices"**
   - Check your MongoDB connection string
   - Verify network access allows all IPs
   - Check Netlify function logs

2. **"Function error"**
   - Check Netlify function logs in the dashboard
   - Verify environment variables are set correctly

3. **Build fails**
   - Check that all dependencies are in `package.json`
   - Verify Node.js version is 18+

### Check Logs:
1. Go to Netlify dashboard
2. Click on your site
3. Go to "Functions" tab
4. Check for any error messages

## 💰 Cost Breakdown

- **Netlify**: Free tier includes:
  - 100GB bandwidth/month
  - 300 build minutes/month
  - 125,000 function invocations/month
  - Perfect for small business use

- **MongoDB Atlas**: Free tier includes:
  - 512MB storage
  - Shared RAM
  - Perfect for invoice storage

## 🔒 Security Notes

1. **Environment Variables**: Never commit your MongoDB connection string to Git
2. **Network Access**: MongoDB Atlas free tier allows all IPs (fine for this use case)
3. **Authentication**: Consider adding user authentication for production use

## 📈 Scaling Considerations

If you need more capacity:
- **Netlify Pro**: $19/month for more bandwidth and build minutes
- **MongoDB Atlas**: $9/month for dedicated cluster
- **Custom Domain**: Add your own domain name

## 🎉 Success!

Your invoice application is now:
- ✅ Hosted on Netlify (free)
- ✅ Connected to MongoDB (free)
- ✅ Fully functional with database persistence
- ✅ Ready for production use
