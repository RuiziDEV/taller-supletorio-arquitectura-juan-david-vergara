export class ObservadorCorreoAdmin {
  actualizar(evento, pedido) {
    console.log(`[EMAIL ADMIN] Auditoría -> Evento: ${evento} | Pedido #${pedido.id} | Cliente: ${pedido.cliente.nombre} | Total: $${pedido.total}`);
  }
}
