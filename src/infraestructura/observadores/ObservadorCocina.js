export class ObservadorCocina {
  actualizar(evento, pedido) {
    if (evento === "PEDIDO_CONFIRMADO") {
      const detalle = pedido.items.map((i) => `${i.cantidad}x ${i.nombre}`).join(", ");
      console.log(`[COCINA] Preparar pedido #${pedido.id}: ${detalle}`);
    } else if (evento === "PEDIDO_CANCELADO") {
      console.log(`[COCINA] Cancelar preparación de pedido #${pedido.id}`);
    }
  }
}
