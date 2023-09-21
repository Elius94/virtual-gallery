module.exports = {
    apps: [{
        name: "virtual-gallery",
        script: "serve",
        env: {
            PM2_SERVE_PATH: '/opt/web/srv.eliusoutdoor.com/virtual-gallery/public',
            PM2_SERVE_PORT: 3001,
            PM2_SERVE_SPA: 'true'
        }
    }],
    deploy: {
        production: {
            user: 'elius',
            host: '194.163.139.154',
            key: 'deploy.key',
            ref: 'origin/main',
            repo: 'https://github.com/Elius94/virtual-gallery',
            path: '/opt/web/srv.eliusoutdoor.com/virtual-gallery',
            'post-deploy':
                'npm install && npm run build && pm2 reload ecosystem.config.js --env production && pm2 save',
            env: {
                NODE_ENV: 'production',
            },
        },
    },
}