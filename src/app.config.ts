import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { RedisPresence } from "@colyseus/redis-presence";
import { RedisDriver } from "@colyseus/redis-driver";
import expressBasicAuth from "express-basic-auth";
/**
 * Import your Room files
 */
import { MyRoom } from "./rooms/MyRoom";

export default config({
  //   initializeTransport: function () {
  //     return new WebSocketTransport({
  //       /* ...options */
  //     });
  //   },
  options: {
    presence: new RedisPresence({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    }),
    driver: new RedisDriver({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    }),
    // publicAddress: "ws.ugizz.store",
  },

  initializeGameServer: (gameServer) => {
    /**
     * Define your room handlers:
     */
    gameServer.define("my_room", MyRoom);
  },

  initializeExpress: (app) => {
    /**
     * Bind your custom express routes here:
     * Read more: https://expressjs.com/en/starter/basic-routing.html
     */
    app.get("/hello_world", (req, res) => {
      res.send("It's time to kick ass and chew bubblegum!");
    });

    /**
     * Use @colyseus/playground
     * (It is not recommended to expose this route in a production environment)
     */
    if (process.env.NODE_ENV !== "production") {
      // app.use("/", playground);
    }

    /**
     * Use @colyseus/monitor
     * It is recommended to protect this route with a password
     * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
     */
    app.use(
      "/colyseus",
      expressBasicAuth({
        challenge: true,
        users: {
          [process.env.SUPER_USER]: process.env.SUPER_PASSWORD, // 지정된 ID/비밀번호
          ["user"]: "password",
        },
      }),
      monitor()
    );
    app.use("/friend/request", (req, res) => {});
    // 명령줄에서 포트 번호를 읽어오기
    // app.listen(parseInt(port));
  },

  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  },
});
