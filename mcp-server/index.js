import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ URL DE TU STRAPI
const STRAPI_URL = "http://localhost:1337";

// ✅ 1. LEER USUARIOS DESDE STRAPI
app.get("/mcp/usuarios", async (req, res) => {
  try {
    const response = await fetch(`${STRAPI_URL}/api/usuarios`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al consultar Strapi" });
  }
});

// ✅ 2. CREAR USUARIO EN STRAPI
app.post("/mcp/usuarios", async (req, res) => {
  try {
    const { nombre, email } = req.body;

    const response = await fetch(`${STRAPI_URL}/api/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          nombre,
          email,
        },
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al crear usuario en Strapi" });
  }
});

// ✅ ARRANCAR SERVIDOR MCP
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Servidor MCP activo en puerto ${PORT}`);
});

