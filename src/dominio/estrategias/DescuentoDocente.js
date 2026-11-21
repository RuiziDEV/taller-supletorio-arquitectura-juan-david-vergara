import { EstrategiaDescuento } from "./EstrategiaDescuento.js";

export class DescuentoDocente extends EstrategiaDescuento {
  calcular(subtotal) {
    return subtotal * 0.05;
  }
}
