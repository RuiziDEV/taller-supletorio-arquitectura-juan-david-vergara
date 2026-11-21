export class Pedido {
  constructor({ id, cliente, itemsDetallados, estrategiaDescuento, estado = "confirmado" }) {
    Pedido.validarCliente(cliente);
    if (!itemsDetallados || itemsDetallados.length === 0) {
      throw new Error("El pedido no puede estar vacío");
    }

    this.id = id;
    this.cliente = {
      nombre: cliente.nombre.trim(),
      tipo: cliente.tipo,
      celular: cliente.celular || "Sin celular"
    };
    this.items = itemsDetallados;
    this.estado = estado;

    this.subtotal = this.calcularSubtotal();
    this.descuento = this.calcularDescuento(estrategiaDescuento);
    this.total = this.subtotal - this.descuento;
  }

  static validarCliente(cliente) {
    if (!cliente || !cliente.nombre || cliente.nombre.trim().length < 3) {
      throw new Error("Cliente inválido: el nombre debe tener al menos 3 caracteres");
    }
  }

  calcularSubtotal() {
    return this.items.reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0);
  }

  calcularDescuento(estrategiaDescuento) {
    let descuento = estrategiaDescuento.calcular(this.subtotal);
    if (this.subtotal > 30000) {
      descuento += this.subtotal * 0.05;
    }
    return descuento;
  }

  cancelar(nombreCliente) {
    if (this.cliente.nombre.toLowerCase() !== nombreCliente.trim().toLowerCase()) {
      throw new Error("El cliente no coincide con el titular del pedido");
    }
    if (this.estado === "cancelado") {
      throw new Error(`El pedido #${this.id} ya se encuentra cancelado`);
    }
    this.estado = "cancelado";
  }
}
