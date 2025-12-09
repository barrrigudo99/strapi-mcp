import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ USAMOS VARIABLE DE ENTORNO DE RENDER
const STRAPI_URL = process.env.STRAPI_URL;

// ✅ ENDPOINT MCP REAL PARA CHATGPT (SSE)
app.get("/mcp", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const response = await fetch(`${STRAPI_URL}/api/usuarios`);
    const data = await response.json();

    res.write(`data: ${JSON.stringify(data)}\n\n`);
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: "Error consultando Strapi" })}\n\n`);
  }
});

// ✅ TU API NORMAL (SIGUE FUNCIONANDO)
app.get("/mcp/usuarios", async (req, res) => {
  try {
    const response = await fetch(`${STRAPI_URL}/api/usuarios`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al consultar Strapi" });
  }
});

app.post("/mcp/usuarios", async (req, res) => {
  try {
    const { nombre, email } = req.body;

    const response = await fetch(`${STRAPI_URL}/api/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: { nombre, email },
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al crear usuario en Strapi" });
  }
});

// ✅ HEALTHCHECK
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Strapi MCP",
    version: "1.0.0",
  });
});

// ✅ PUERTO DINÁMICO PARA RENDER
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ MCP activo en puerto ${PORT}`);
});
