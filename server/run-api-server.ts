/**
 * Standalone API server for development. Run with: npx tsx server/run-api-server.ts
 * Vite proxies /server to this server when using the dev script.
 */
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

// Load .env from project root (same folder as package.json)
try {
  const dotenv = await import("dotenv");
  dotenv.config({ path: path.join(projectRoot, ".env") });
} catch {
  // dotenv optional
}

let PORT = Number(process.env.API_PORT) || 3001;
const PORT_MAX = 3010;

const routes: Record<string, string> = {
  "/server/api/authenticate-certificate": path.join(__dirname, "api", "authenticate-certificate.ts"),
  "/server/api/list-certificate": path.join(__dirname, "api", "list-certificate.ts"),
  "/server/api/marketplace-listings": path.join(__dirname, "api", "marketplace-listings.ts"),
};

const server = createServer(async (req, res) => {
  const url = req.url?.split("?")[0] ?? "";
  const handlerPath = routes[url];
  if (!handlerPath) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Not found" }));
    return;
  }

  try {
    const mod = await import(pathToFileURL(handlerPath).href);
    const handler = mod?.default;
    if (typeof handler !== "function") {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ success: false, error: "Invalid handler" }));
      return;
    }
    await Promise.resolve(handler(req, res));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: (err as Error).message }));
  }
});

function tryListen(port: number): void {
  server.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
    if (port !== (Number(process.env.API_PORT) || 3001)) {
      console.log(`(Port ${port} used because ${port - 1} was in use. Set API_PORT in .env to match Vite proxy.)`);
    }
  });
}

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE" && PORT < PORT_MAX) {
    PORT += 1;
    tryListen(PORT);
  } else {
    console.error(`Port ${PORT} is in use. Set API_PORT to another port (e.g. ${PORT + 1}) in .env and restart.`);
    throw err;
  }
});

tryListen(PORT);
