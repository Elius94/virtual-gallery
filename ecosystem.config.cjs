module.exports = {
    apps: [{
        name: "virtual-gallery",
        script: "serve",
        env: {
            PM2_SERVE_PATH: '/opt/web/srv.eliusoutdoor.com/virtual-gallery/public',
            PM2_SERVE_PORT: 3001,
            PM2_SERVE_SPA: 'true'
        }
    }]
}