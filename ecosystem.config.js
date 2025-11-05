module.exports = {
  apps: [
    {
      name: '4004-btech-nestjs-subscription-service',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
      },
      env_local: {
        NODE_ENV: 'local',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
