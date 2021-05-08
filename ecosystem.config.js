module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    // First application
    {
      name: "jpvn",
      script: "jpvn.js",
      env: {
        COMMON_VARIABLE: "true",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    evg: {
      user: "evg",
      host: "evg.lehuy.co",
      ref: "origin/lhv",
      repo: "git@github.com:lehuyco/jpvn.git",
      path: "/var/www/luathungviet",
      "post-deploy":
        "yarn install && NODE_PATH=. pm2 startOrRestart ecosystem.config.js --env production",
      env: {
        NODE_ENV: "production",
      },
    },
  },
};
