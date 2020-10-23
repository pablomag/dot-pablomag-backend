module.exports = {
  apps: [
    {
      name: ".pablomag imgsrv",
      script: "dist/server.js",
      node_args: "-r dotenv/config",
    },
  ],
};
