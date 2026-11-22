import { Producto } from "../../dominio/entidades/Producto.js";
import { ProductoRepositorio } from "../../dominio/puertos/ProductoRepositorio.js";

export class ProductoRepositorioMemoria extends ProductoRepositorio {
  constructor(productosIniciales = null) {
    super();
    const base = productosIniciales || [
      { id: 1, nombre: "Empanada", precio: 3500, stock: 20 },
      { id: 2, nombre: "Almuerzo", precio: 14000, stock: 8 }
    ];
    this.productos = base.map((p) => new Producto(p));
  }

  buscarPorId(id) {
    return this.productos.find((p) => p.id === Number(id)) || null;
  }

  listarTodos() {
    return [...this.productos];
  }
}
