import { DescuentoEstudiante } from "./DescuentoEstudiante.js";
import { DescuentoDocente } from "./DescuentoDocente.js";
import { DescuentoVisitante } from "./DescuentoVisitante.js";
import { DescuentoEgresado } from "./DescuentoEgresado.js";

export class FabricaEstrategiasDescuento {
  static crear(tipoCliente) {
    const estrategias = {
      estudiante: () => new DescuentoEstudiante(),
      docente: () => new DescuentoDocente(),
      visitante: () => new DescuentoVisitante(),
      egresado: () => new DescuentoEgresado()
    };

    const creador = estrategias[tipoCliente?.toLowerCase()];
    if (!creador) {
      throw new Error(`Tipo de cliente no soportado: ${tipoCliente}`);
    }
    return creador();
  }
}
