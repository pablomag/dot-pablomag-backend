module.exports = {
  apps: [
    {
      name: ".pablomag server",
      script: "dist/server.js",
      node_args: "-r dotenv/config",
    },
  ],
};
