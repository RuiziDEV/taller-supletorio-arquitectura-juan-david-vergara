export class Producto {
  constructor({ id, nombre, precio, stock }) {
    if (!nombre || precio <= 0 || stock < 0) {
      throw new Error("Datos de producto inválidos");
    }
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }

  tieneStockSuficiente(cantidad) {
    return cantidad > 0 && this.stock >= cantidad;
  }

  descontarStock(cantidad) {
    if (cantidad <= 0) {
      throw new Error(`Cantidad inválida para ${this.nombre}`);
    }
    if (!this.tieneStockSuficiente(cantidad)) {
      throw new Error(`Sin stock suficiente de ${this.nombre}. Disponible: ${this.stock}`);
    }
    this.stock -= cantidad;
  }

  reponerStock(cantidad) {
    if (cantidad <= 0) {
      throw new Error(`Cantidad inválida para reponer en ${this.nombre}`);
    }
    this.stock += cantidad;
  }
}
