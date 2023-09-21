#!/bin/bash

# Define variables
WEB_ROOT="/var/www/html"  # Change this to your web server's document root
REPO_URL="https://github.com/cheval-constipe/Partiet-nettside.git"  # Replace with your GitHub repository URL
BRANCH="main"  # Replace with the branch you want to deploy

# Go to the web root directory
cd "$WEB_ROOT" || exit

# Pull the latest code from the repository
git pull origin "$BRANCH"

# Perform any necessary build or dependency installation steps
# For example, if you use Composer for PHP projects:
# composer install --no-dev --optimize-autoloader

# Restart the web server to apply changes
# Replace these commands with the appropriate server restart commands for your setup
# For Apache:
systemctl restart apache2
# For Nginx:
# systemctl restart nginx

# Clean up unnecessary files or caches, if applicable
# For example, if you use a PHP caching mechanism like OPCache, you may want to clear it:
php -r 'opcache_reset();'

# Run database migrations, if applicable
# For example, if you use Laravel, you might run:
# php artisan migrate --force

# Optionally, run any other necessary post-deployment tasks
# ...

echo "Deployment completed."
