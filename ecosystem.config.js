// ecosystem.config.js
const os = require("os");
module.exports = {
  apps: [
    {
      port: 2567,
      name: "colyseus-proxy",
      script: "./build/index.js",
      instances: 1, // scale this up if the proxy becomes the bottleneck
      exec_mode: "cluster",
      env: {
        PORT: 2567,
        PUBLIC_ADDRESS: "ws.ugizz.store",
      },
    },
  ],
};
