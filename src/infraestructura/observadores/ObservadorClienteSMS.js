export class ObservadorClienteSMS {
  actualizar(evento, pedido) {
    if (evento === "PEDIDO_CONFIRMADO") {
      console.log(`[SMS a ${pedido.cliente.celular}] Tu pedido #${pedido.id} fue confirmado. Total: $${pedido.total}`);
    } else if (evento === "PEDIDO_CANCELADO") {
      console.log(`[SMS a ${pedido.cliente.celular}] Tu pedido #${pedido.id} fue cancelado.`);
    }
  }
}
