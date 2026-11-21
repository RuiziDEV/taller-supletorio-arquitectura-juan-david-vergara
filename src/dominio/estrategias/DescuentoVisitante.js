import { EstrategiaDescuento } from "./EstrategiaDescuento.js";

export class DescuentoVisitante extends EstrategiaDescuento {
  calcular(subtotal) {
    return 0;
  }
}
