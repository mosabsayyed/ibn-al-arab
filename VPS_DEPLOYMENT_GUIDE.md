# VPS Deployment Guide for Ibn Al Arab Restaurant App

## Overview
This guide will help you deploy the Ibn Al Arab restaurant app (React frontend + Express backend) to a Hostinger VPS. The app will run on a single server with Nginx as reverse proxy.

## Prerequisites
- Hostinger VPS with root access
- Domain name pointed to VPS IP
- SSH access to VPS
- This GitHub repository: https://github.com/mosabsayyed/ibn-al-arab.git

## Step 1: Initial VPS Setup

SSH into your VPS:
```bash
ssh root@YOUR_VPS_IP
```

Update system and install required software:
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# Install Nginx
apt install nginx -y

# Install PM2 globally
npm install -g pm2

# Install pnpm
npm install -g pnpm

# Install git (if not already installed)
apt install git -y

# Verify installations
node --version
npm --version
nginx -v
pm2 --version
pnpm --version
```

## Step 2: Deploy Application

Clone and build the application:
```bash
# Navigate to web directory
cd /var/www

# Clone repository
git clone https://github.com/mosabsayyed/ibn-al-arab.git
cd ibn-al-arab

# Switch to the working branch
git checkout with-bugs

# Install dependencies
pnpm install

# Build frontend (creates dist/spa)
pnpm run build:client

# Build backend (creates dist/backend)
pnpm run build:backend

# Create uploads directory
mkdir -p uploads

# Set proper permissions
chown -R www-data:www-data /var/www/ibn-al-arab
chmod -R 755 /var/www/ibn-al-arab
```

## Step 3: Environment Configuration

Create production environment file:
```bash
cd /var/www/ibn-al-arab
nano .env
```

Add these environment variables (replace with your actual values):
```env
NODE_ENV=production
PORT=4101
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key
UPLOADS_DIR=/var/www/ibn-al-arab/uploads
STORAGE_SECRET=your_random_secret_for_file_signing
```

## Step 4: PM2 Process Manager Setup

Create PM2 ecosystem configuration:
```bash
cd /var/www/ibn-al-arab
nano ecosystem.config.js
```

Add this configuration:
```javascript
module.exports = {
  apps: [{
    name: 'ibn-al-arab-backend',
    script: 'dist/backend/server.js',
    cwd: '/var/www/ibn-al-arab',
    env: {
      NODE_ENV: 'production',
      PORT: 4101
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
```

Start the backend with PM2:
```bash
# Create logs directory
mkdir -p logs

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set PM2 to start on system boot
pm2 startup

# Follow the instructions from pm2 startup command
```

## Step 5: Nginx Configuration

Create Nginx site configuration:
```bash
nano /etc/nginx/sites-available/ibn-al-arab
```

Add this configuration (replace YOUR_DOMAIN.com with your actual domain):
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN.com www.YOUR_DOMAIN.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # Serve static frontend files
    location / {
        root /var/www/ibn-al-arab/dist/spa;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://localhost:4101;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeout for uploads
        proxy_connect_timeout       300;
        proxy_send_timeout          300;
        proxy_read_timeout          300;
        send_timeout                300;
    }
    
    # Serve uploaded files
    location /files/ {
        alias /var/www/ibn-al-arab/uploads/;
        expires 1d;
        add_header Cache-Control "public";
    }
    
    # Increase max upload size
    client_max_body_size 50M;
}
```

Enable the site:
```bash
# Create symbolic link to enable site
ln -s /etc/nginx/sites-available/ibn-al-arab /etc/nginx/sites-enabled/

# Remove default site (optional)
rm /etc/nginx/sites-enabled/default

# Test nginx configuration
nginx -t

# If test passes, restart nginx
systemctl restart nginx
systemctl enable nginx
```

## Step 6: SSL Certificate (Recommended)

Install Certbot for free SSL:
```bash
# Install certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace with your domain)
certbot --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com

# Test automatic renewal
certbot renew --dry-run
```

## Step 7: Firewall Configuration

Set up UFW firewall:
```bash
# Allow SSH (important: don't lock yourself out!)
ufw allow ssh

# Allow HTTP and HTTPS
ufw allow 'Nginx Full'

# Enable firewall
ufw enable

# Check status
ufw status
```

## Step 8: Create Deployment Script

Create a script for easy future deployments:
```bash
cd /var/www/ibn-al-arab
nano deploy.sh
```

Add this script:
```bash
#!/bin/bash

echo "Starting deployment..."

# Navigate to app directory
cd /var/www/ibn-al-arab

# Pull latest changes
echo "Pulling latest code..."
git pull origin with-bugs

# Install/update dependencies
echo "Installing dependencies..."
pnpm install

# Build frontend
echo "Building frontend..."
pnpm run build:client

# Build backend
echo "Building backend..."
pnpm run build:backend

# Restart backend
echo "Restarting backend..."
pm2 restart ibn-al-arab-backend

# Reload nginx (in case of config changes)
echo "Reloading nginx..."
systemctl reload nginx

echo "Deployment complete!"
echo "Frontend: https://YOUR_DOMAIN.com"
echo "API: https://YOUR_DOMAIN.com/api/"

# Show PM2 status
pm2 status
```

Make the script executable:
```bash
chmod +x deploy.sh
```

## Step 9: Domain Configuration

In your domain registrar (Namecheap, GoDaddy, etc.):
1. Create A record: `YOUR_DOMAIN.com` → `YOUR_VPS_IP`
2. Create CNAME record: `www.YOUR_DOMAIN.com` → `YOUR_DOMAIN.com`

Wait for DNS propagation (up to 24 hours, usually much faster).

## Step 10: Testing and Verification

Test your deployment:
```bash
# Check if backend is running
pm2 status

# Check backend logs
pm2 logs ibn-al-arab-backend

# Check nginx status
systemctl status nginx

# Test API endpoint
curl http://localhost:4101/api/plans

# Test frontend (replace with your domain)
curl -I https://YOUR_DOMAIN.com
```

## Monitoring Commands

Useful commands for monitoring your application:

```bash
# PM2 commands
pm2 status                    # Show all processes
pm2 logs ibn-al-arab-backend  # Show logs
pm2 restart ibn-al-arab-backend  # Restart app
pm2 stop ibn-al-arab-backend  # Stop app
pm2 delete ibn-al-arab-backend  # Remove from PM2

# Nginx commands
systemctl status nginx        # Check nginx status
systemctl restart nginx       # Restart nginx
nginx -t                     # Test configuration
tail -f /var/log/nginx/error.log  # View error logs

# System monitoring
htop                         # Process monitor
df -h                        # Disk space
free -h                      # Memory usage
```

## Future Deployments

For future updates, simply run:
```bash
ssh root@YOUR_VPS_IP
cd /var/www/ibn-al-arab
./deploy.sh
```

## Troubleshooting

Common issues and solutions:

1. **502 Bad Gateway**: Backend not running
   ```bash
   pm2 restart ibn-al-arab-backend
   ```

2. **Permission denied**: Fix file permissions
   ```bash
   chown -R www-data:www-data /var/www/ibn-al-arab
   chmod -R 755 /var/www/ibn-al-arab
   ```

3. **API calls failing**: Check backend logs
   ```bash
   pm2 logs ibn-al-arab-backend
   ```

4. **Frontend not loading**: Check nginx configuration
   ```bash
   nginx -t
   systemctl restart nginx
   ```

## Important Files Locations

- **Application**: `/var/www/ibn-al-arab/`
- **Frontend build**: `/var/www/ibn-al-arab/dist/spa/`
- **Backend build**: `/var/www/ibn-al-arab/dist/backend/`
- **Uploads**: `/var/www/ibn-al-arab/uploads/`
- **Nginx config**: `/etc/nginx/sites-available/ibn-al-arab`
- **Environment**: `/var/www/ibn-al-arab/.env`
- **PM2 config**: `/var/www/ibn-al-arab/ecosystem.config.js`
- **Deploy script**: `/var/www/ibn-al-arab/deploy.sh`

## Security Notes

1. **Keep system updated**: Run `apt update && apt upgrade` regularly
2. **Monitor logs**: Check PM2 and nginx logs regularly
3. **Backup data**: Regular backups of uploads and database
4. **Use strong passwords**: For VPS access and database
5. **Consider fail2ban**: To protect against brute force attacks

## Support Information

- **Repository**: https://github.com/mosabsayyed/ibn-al-arab
- **Branch**: with-bugs
- **Frontend Tech**: React + TypeScript + Vite
- **Backend Tech**: Node.js + Express + TypeScript
- **Database**: Supabase PostgreSQL
- **File Storage**: Local filesystem with signed URLs

This deployment setup provides a production-ready environment with:
- ✅ HTTPS encryption
- ✅ Process management with PM2
- ✅ Reverse proxy with Nginx
- ✅ Static file caching
- ✅ API routing
- ✅ File upload handling
- ✅ Automatic restarts
- ✅ Easy deployment updates