module.exports = {
  apps: [
    {
      name: 'cleanavenir-backend',
      script: './dist/server.js',
      instances: 'max', // Utilise tous les CPU disponibles
      exec_mode: 'cluster',
      
      // Variables d'environnement
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // Logs
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Restart automatique
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',

      // Délai entre les restarts
      restart_delay: 4000,

      // Kill timeout
      kill_timeout: 5000,

      // Configuration cluster
      listen_timeout: 3000,
      
      // Ignorer certains signaux
      ignore_watch: ['node_modules', 'logs', '*.log', '.git'],
    },
  ],
};
