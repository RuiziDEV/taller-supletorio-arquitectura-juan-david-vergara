export class ObservadorInventario {
  constructor(productoRepositorio) {
    this.productoRepositorio = productoRepositorio;
  }

  actualizar(evento, pedido) {
    for (const item of pedido.items) {
      const producto = this.productoRepositorio.buscarPorId(item.productoId);
      if (!producto) continue;

      if (evento === "PEDIDO_CONFIRMADO") {
        producto.descontarStock(item.cantidad);
        console.log(`[INVENTARIO] Descontado ${item.cantidad} de ${producto.nombre}. Stock actual: ${producto.stock}`);
      } else if (evento === "PEDIDO_CANCELADO") {
        producto.reponerStock(item.cantidad);
        console.log(`[INVENTARIO] Repuesto ${item.cantidad} de ${producto.nombre}. Stock actual: ${producto.stock}`);
      }
    }
  }
}
