import { EstrategiaDescuento } from "./EstrategiaDescuento.js";

export class DescuentoEgresado extends EstrategiaDescuento {
  calcular(subtotal) {
    return subtotal * 0.08;
  }
}
