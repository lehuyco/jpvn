module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'jpvn',
      script    : 'jpvn.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    do : {
      user : 'cloud',
      host : 'do.lehuy.co',
      ref  : 'origin/master',
      repo : 'git@github.com:anhlhv/jpvn.git',
      path : '/var/www/jpvn',
      'post-deploy' : 'yarn install && NODE_PATH=. pm2 startOrRestart ecosystem.config.js --env production',
      env  : {
        NODE_ENV: "production"
      }
    }
  }
};
