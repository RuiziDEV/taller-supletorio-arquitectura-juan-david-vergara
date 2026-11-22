import http from "node:http";
import { informeUsoIA } from "../../../dominio/informeIA.js";
import { PublicadorEventosPedido } from "../../../dominio/eventos/PublicadorEventosPedido.js";
import { PedidoServicio } from "../../../aplicacion/PedidoServicio.js";
import { PedidoRepositorioMemoria } from "../../persistencia/PedidoRepositorioMemoria.js";
import { ProductoRepositorioMemoria } from "../../persistencia/ProductoRepositorioMemoria.js";
import { ObservadorCocina } from "../../observadores/ObservadorCocina.js";
import { ObservadorClienteSMS } from "../../observadores/ObservadorClienteSMS.js";
import { ObservadorInventario } from "../../observadores/ObservadorInventario.js";
import { ObservadorCorreoAdmin } from "../../observadores/ObservadorCorreoAdmin.js";

const productoRepo = new ProductoRepositorioMemoria();
const pedidoRepo = new PedidoRepositorioMemoria();
const publicador = new PublicadorEventosPedido();

publicador.suscribir(new ObservadorInventario(productoRepo));
publicador.suscribir(new ObservadorCocina());
publicador.suscribir(new ObservadorClienteSMS());
publicador.suscribir(new ObservadorCorreoAdmin());

const servicio = new PedidoServicio(pedidoRepo, productoRepo, publicador);

function responderJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload, null, 2));
}

function leerBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error("JSON invalido"));
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const ruta = new URL(req.url, `http://${req.headers.host}`).pathname;
  try {
    if (req.method === "GET" && ruta === "/salud") return responderJson(res, 200, { estado: "ok", informeIA: informeUsoIA() });
    if (req.method === "GET" && ruta === "/productos") return responderJson(res, 200, productoRepo.listarTodos());
    if (req.method === "GET" && ruta === "/pedidos") return responderJson(res, 200, servicio.listarPedidos());
    if (req.method === "GET" && ruta.startsWith("/pedidos/")) return responderJson(res, 200, servicio.consultarPedido(ruta.split("/")[2]));
    if (req.method === "POST" && ruta === "/pedidos") {
      const body = await leerBody(req);
      return responderJson(res, 201, servicio.crearPedido(body.cliente, body.items));
    }
    if (req.method === "PATCH" && ruta.endsWith("/cancelar")) {
      const body = await leerBody(req);
      return responderJson(res, 200, servicio.cancelarPedido(body.cliente, ruta.split("/")[2]));
    }
    responderJson(res, 404, { error: "Ruta no encontrada" });
  } catch (error) {
    responderJson(res, 400, { error: error.message });
  }
});

server.listen(3000, () => console.log("Servidor de Cafeteria escuchando en http://localhost:3000"));
