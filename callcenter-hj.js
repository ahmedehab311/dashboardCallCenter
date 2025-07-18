import { createServer } from "http";
import { parse } from "url";
import next from "next";
import dotenv from "dotenv";
dotenv.config();
const port = parseInt(process.env.PORT || "5000", 10);
const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port);

  console.log(
    `> Server listening at https://${hostname}:${port} as ${
      dev ? "development" : process.env.NODE_ENV
    }`
  );
});
