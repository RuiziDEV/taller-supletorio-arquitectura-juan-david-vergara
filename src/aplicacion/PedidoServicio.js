import { Pedido } from "../dominio/entidades/Pedido.js";
import { FabricaEstrategiasDescuento } from "../dominio/estrategias/FabricaEstrategiasDescuento.js";

export class PedidoServicio {
  constructor(pedidoRepo, productoRepo, publicadorEventos) {
    this.pedidoRepo = pedidoRepo;
    this.productoRepo = productoRepo;
    this.publicadorEventos = publicadorEventos;
  }

  crearPedido(cliente, itemsSolicitados) {
    Pedido.validarCliente(cliente);
    if (!itemsSolicitados || itemsSolicitados.length === 0) {
      throw new Error("El pedido debe contener al menos un producto");
    }

    const itemsDetallados = itemsSolicitados.map((item) => {
      if (!item.cantidad || item.cantidad <= 0) {
        throw new Error("La cantidad de cada producto debe ser mayor a 0");
      }
      const producto = this.productoRepo.buscarPorId(item.id);
      if (!producto) {
        throw new Error(`El producto con id ${item.id} no existe`);
      }
      if (!producto.tieneStockSuficiente(item.cantidad)) {
        throw new Error(`Sin stock suficiente de ${producto.nombre} (disponible: ${producto.stock})`);
      }
      return {
        productoId: producto.id,
        nombre: producto.nombre,
        precioUnitario: producto.precio,
        cantidad: item.cantidad
      };
    });

    const estrategia = FabricaEstrategiasDescuento.crear(cliente.tipo);
    const pedido = new Pedido({
      id: this.pedidoRepo.siguienteId(),
      cliente,
      itemsDetallados,
      estrategiaDescuento: estrategia
    });

    this.pedidoRepo.guardar(pedido);
    this.publicadorEventos.notificar("PEDIDO_CONFIRMADO", pedido);

    return pedido;
  }

  consultarPedido(pedidoId) {
    const pedido = this.pedidoRepo.buscarPorId(Number(pedidoId));
    if (!pedido) {
      throw new Error(`Pedido #${pedidoId} no encontrado`);
    }
    return pedido;
  }

  listarPedidos() {
    return this.pedidoRepo.listarTodos();
  }

  cancelarPedido(cliente, pedidoId) {
    Pedido.validarCliente(cliente);
    const pedido = this.consultarPedido(pedidoId);
    pedido.cancelar(cliente.nombre);

    this.pedidoRepo.guardar(pedido);
    this.publicadorEventos.notificar("PEDIDO_CANCELADO", pedido);

    return pedido;
  }
}
