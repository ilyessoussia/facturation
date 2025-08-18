#!/bin/bash

echo "🚀 Acrecert Facturation - Deployment Script"
echo "=============================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Acrecert Facturation System"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Build the project
echo "🔨 Building project..."
npm run build
echo "✅ Project built successfully"

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo ""
echo "1. 🗄️  Set up MongoDB Atlas:"
echo "   - Go to https://www.mongodb.com/atlas"
echo "   - Create free account and database"
echo "   - Get your connection string"
echo ""
echo "2. 🌐 Deploy to Netlify:"
echo "   - Push code to GitHub: git push origin main"
echo "   - Go to https://netlify.com"
echo "   - Connect your GitHub repository"
echo "   - Add environment variable: MONGODB_URI"
echo ""
echo "3. 🧪 Test your deployment:"
echo "   - Visit: your-site.netlify.app/test-connection.html"
echo "   - Run all tests to verify database connection"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - DEPLOYMENT.md"
echo "   - setup-checklist.md"
echo ""
echo "🎉 Your invoice system is ready to deploy!"
