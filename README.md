# 🧾 Acrecert Facturation System

A professional invoice and quote management system for Acrecert consulting company, built with React and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free)
- Netlify account (free)

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test with Netlify Functions locally
npm run netlify:dev
```

## 🗄️ Database Setup

### 1. MongoDB Atlas (Free)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account and project
3. Build free database (M0 Sandbox)
4. Create database user with read/write permissions
5. Allow network access from anywhere
6. Get connection string

### 2. Connection String Format
```
mongodb+srv://username:password@cluster.mongodb.net/facturation?retryWrites=true&w=majority
```

## 🌐 Deployment

### Netlify Deployment
1. Push code to GitHub
2. Connect repository to Netlify
3. Set environment variable: `MONGODB_URI`
4. Deploy

### Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `18`

## 🧪 Testing

After deployment, test your setup:
1. Visit: `your-site.netlify.app/test-connection.html`
2. Click "Test Database Connection"
3. Click "Test Create Invoice"
4. Click "Test Get Invoices"

## 📁 Project Structure

```
facturation/
├── src/
│   ├── App.jsx              # Main application
│   ├── InvoiceForm.jsx      # Invoice creation form
│   ├── InvoiceHistory.jsx   # Invoice management
│   ├── api.js              # API service layer
│   └── styles.css          # Styling
├── netlify/
│   └── functions/
│       ├── invoices.js     # API endpoints
│       └── mongoClient.js  # Database connection
├── public/
│   └── test-connection.html # Connection test page
└── package.json
```

## 🔧 Features

- ✅ Create invoices and quotes
- ✅ MongoDB database persistence
- ✅ PDF export functionality
- ✅ Invoice history management
- ✅ Edit existing invoices
- ✅ Professional Tunisian invoice format
- ✅ Tax calculations (TVA 19%)
- ✅ French number-to-text conversion

## 💰 Cost

- **Netlify**: Free tier (100GB bandwidth, 125K function calls)
- **MongoDB Atlas**: Free tier (512MB storage)
- **Total**: $0/month

## 📞 Support

For deployment help, see `DEPLOYMENT.md` and `setup-checklist.md`

## 🏢 Company Info

**Acrecert - Bureau de Consulting en Informatique**
- **Tax ID**: MF 1912549Q/A/M/000
- **Location**: Cheraf, Bekalta, Monastir, Tunisia
- **Contact**: 99 10 99 72 / 99 10 99 87
- **Website**: www.acrecert.com
- **Email**: contact@acrecert.com
