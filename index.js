import express from "express";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import createBareServer from "@tomphttp/bare-server-node";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 1621;

const server = http.createServer();
const app = express();
const bareServer = createBareServer("/bare/");

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cosmic's pages use paths relative to the site root, so keep /cosmic without a slash.
app.use((req, res, next) => (req.path === "/cosmic/" ? res.redirect("/cosmic") : next()));

app.use(express.static(path.join(__dirname, "static")));

const page = (file) => (req, res) =>
  res.sendFile(path.join(__dirname, "static", file));

app.get("/", page("index.html")); // Thanksgiving landing page
app.get("/cosmic", page("cosmic.html")); // Cosmic home (comma, comma)
app.get("/photography", page("search.html"));
app.get("/mathematics", page("play.html"));
app.get("/forest", page("widgetbot.html"));
app.get("/go", page("go.html"));
app.get("/settings", page("settings.html"));
app.get("/donate", page("donate.html"));
app.get("/ocean", page("apps.html"));
app.get("/404", page("404.html"));
app.get("/*", (req, res) => res.redirect("/404"));

// Bare server (the proxy backend)
server.on("request", (req, res) => {
  if (bareServer.shouldRoute(req)) bareServer.routeRequest(req, res);
  else app(req, res);
});

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) bareServer.routeUpgrade(req, socket, head);
  else socket.end();
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Stop the other process or set PORT to another number.`);
  } else {
    console.error(err);
  }
  process.exit(1);
});

server.on("listening", () => {
  console.log(`Thanksgiving: http://localhost:${PORT}`);
  console.log(`Cosmic:       http://localhost:${PORT}/cosmic (or press "," twice on the landing page)`);
});

server.listen({ port: PORT });
