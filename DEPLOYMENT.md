# UKBRUM Website Deployment Guide

## Pre-Deployment Checklist

### ✅ Files Ready for Upload
- All HTML, CSS, JS files optimized
- Images folder (add actual images to replace placeholders)
- Data files with proper configurations
- Error pages (404.html) created
- .htaccess for server optimization

### ⚠️ Before Going Live

1. **Replace Placeholder Images**
   - Add actual logo to `/images/logo.png`
   - Add department hero images to `/images/` folder
   - Update image references if needed

2. **Update Discord Webhook**
   - Current webhook: `https://discord.com/api/webhooks/1388568324043964579/tEwAqTdUH7rPZoaGyhsWyrqKLs0L6ip2ZADc8sObKsuEnelBIDO1rDcxQaFEx2RRiamN`
   - Located in: `/js/report-handler.js`

3. **Update Domain References**
   - Update robots.txt sitemap URL
   - Update any hardcoded domain references

4. **Test Features**
   - Form submission to Discord
   - Development overlays (mod, fire, sub-departments)
   - Theme toggle functionality
   - Mobile responsiveness

## Server Requirements

- **Web Server**: Apache/Nginx
- **PHP**: Not required (pure HTML/CSS/JS)
- **HTTPS**: Recommended for security
- **Compression**: Enabled via .htaccess

## Upload Structure

```
/public_html/ (or web root)
├── index.html
├── info.html
├── rules.html
├── 404.html
├── .htaccess
├── robots.txt
├── css/
├── js/
├── data/
├── departments/
├── images/
└── api/ (if needed)
```

## Post-Deployment Testing

1. Visit all main pages
2. Test form submission
3. Check development overlays
4. Verify mobile responsiveness
5. Test 404 error page
6. Confirm Discord webhook functionality

## Security Notes

- Discord webhook URL is exposed in client-side JS
- Consider server-side form handling for production
- .htaccess includes basic security headers
- JSON files are protected from direct access

## Performance Optimizations

- Gzip compression enabled
- Browser caching configured
- CSS/JS minification recommended
- Image optimization recommended

Ready for deployment! 🚀