# ✅ MongoDB + Netlify Setup Checklist

## 🗄️ MongoDB Atlas Setup

- [ ] 1. Create MongoDB Atlas account at https://www.mongodb.com/atlas
- [ ] 2. Create new project named "Acrecert Facturation"
- [ ] 3. Build free database (M0 Sandbox tier)
- [ ] 4. Create database user:
  - Username: `acrecert_user`
  - Password: [your strong password]
  - Privileges: Read and write to any database
- [ ] 5. Set network access to "Allow Access from Anywhere"
- [ ] 6. Get connection string and modify it:
  ```
  mongodb+srv://acrecert_user:yourpassword@cluster0.xxxxx.mongodb.net/facturation?retryWrites=true&w=majority
  ```

## 🌐 Netlify Deployment

- [ ] 7. Push code to GitHub repository
- [ ] 8. Create Netlify account at https://netlify.com
- [ ] 9. Connect GitHub repository to Netlify
- [ ] 10. Configure build settings:
  - Build command: `npm run build`
  - Publish directory: `dist`
- [ ] 11. Add environment variable:
  - Key: `MONGODB_URI`
  - Value: [your MongoDB connection string from step 6]
- [ ] 12. Deploy site

## 🧪 Testing

- [ ] 13. Visit your Netlify URL + `/test-connection.html`
- [ ] 14. Click "Test Database Connection" - should show ✅
- [ ] 15. Click "Test Create Invoice" - should show ✅
- [ ] 16. Click "Test Get Invoices" - should show ✅
- [ ] 17. Test your main application:
  - Create a new invoice
  - Check if it appears in history
  - Edit an invoice
  - Export PDF

## 🔧 Troubleshooting

If tests fail:

### Connection Issues:
- [ ] Check MongoDB connection string format
- [ ] Verify network access allows all IPs
- [ ] Check database user credentials

### Function Errors:
- [ ] Check Netlify function logs in dashboard
- [ ] Verify environment variables are set correctly
- [ ] Ensure all dependencies are installed

### Build Issues:
- [ ] Check Node.js version (should be 18+)
- [ ] Verify all dependencies in package.json
- [ ] Check build logs in Netlify

## 📞 Support

If you're still having issues:
1. Check Netlify function logs
2. Check MongoDB Atlas logs
3. Verify all environment variables
4. Test with the provided test page

## 🎉 Success Indicators

Your setup is working when:
- ✅ Database connection test passes
- ✅ Invoice creation test passes
- ✅ Invoice retrieval test passes
- ✅ Main application saves/loads invoices
- ✅ PDF export works
- ✅ No errors in browser console
