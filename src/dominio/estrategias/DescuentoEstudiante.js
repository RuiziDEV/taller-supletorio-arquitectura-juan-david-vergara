import { EstrategiaDescuento } from "./EstrategiaDescuento.js";

export class DescuentoEstudiante extends EstrategiaDescuento {
  calcular(subtotal) {
    return subtotal * 0.10;
  }
}
