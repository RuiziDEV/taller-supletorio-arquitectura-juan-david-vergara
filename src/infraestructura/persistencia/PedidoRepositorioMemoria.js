import { PedidoRepositorio } from "../../dominio/puertos/PedidoRepositorio.js";

export class PedidoRepositorioMemoria extends PedidoRepositorio {
  constructor() {
    super();
    this.pedidos = [];
  }

  siguienteId() {
    return this.pedidos.length + 1;
  }

  guardar(pedido) {
    const idx = this.pedidos.findIndex((p) => p.id === pedido.id);
    if (idx >= 0) this.pedidos[idx] = pedido;
    else this.pedidos.push(pedido);
    return pedido;
  }

  buscarPorId(id) {
    return this.pedidos.find((p) => p.id === Number(id)) || null;
  }

  listarTodos() {
    return [...this.pedidos];
  }
}
