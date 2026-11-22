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

console.log("=== INFORME USO IA ===");
console.log(informeUsoIA());

console.log("\n=== 1. CREAR PEDIDO (Estudiante > $30.000 -> 10% + 5%) ===");
console.log(servicio.crearPedido({ nombre: "Juan David", tipo: "estudiante", celular: "3001234567" }, [{ id: 2, cantidad: 2 }, { id: 1, cantidad: 2 }]));

console.log("\n=== 2. CREAR PEDIDO EXTENSION (Egresado -> 8%) ===");
console.log(servicio.crearPedido({ nombre: "Laura Gomez", tipo: "egresado", celular: "3109876543" }, [{ id: 1, cantidad: 4 }]));

console.log("\n=== 3. CONSULTAR PEDIDO #1 ===");
console.log(servicio.consultarPedido(1));

console.log("\n=== 4. CANCELAR PEDIDO #2 ===");
servicio.cancelarPedido({ nombre: "Laura Gomez" }, 2);

console.log("\n=== 5. LISTAR PEDIDOS ===");
console.log(servicio.listarPedidos());

console.log("\n=== 6. VALIDAR REGLA DE NEGOCIO (Sin stock) ===");
try {
  servicio.crearPedido({ nombre: "Carlos Ruiz", tipo: "visitante", celular: "3205554433" }, [{ id: 2, cantidad: 50 }]);
} catch (error) {
  console.error("Error controlado:", error.message);
}
