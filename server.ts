import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // In development, Vite handles the SPA fallback automatically via its middleware
    // but for non-asset requests we want to ensure it transforms the root index.html
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      if (url.includes('.') && !url.includes('?')) return next();
      
      try {
        const htmlPath = path.resolve(process.cwd(), "index.html");
        let template = fs.readFileSync(htmlPath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static files from the dist directory
    app.use(express.static(distPath));
    
    // SPA Fallback: Serve index.html for any request that doesn't match a static file
    // but ONLY if the request doesn't look like an asset (to avoid script-as-html errors)
    app.get("*", (req, res, next) => {
      const url = req.url;
      // If it looks like a file (has an extension), don't serve index.html
      if (url.includes('.') && !url.includes('?')) {
        return next();
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
