export class PublicadorEventosPedido {
  constructor() {
    this.observadores = [];
  }

  suscribir(observador) {
    this.observadores.push(observador);
  }

  desuscribir(observador) {
    this.observadores = this.observadores.filter((obs) => obs !== observador);
  }

  notificar(evento, pedido) {
    for (const observador of this.observadores) {
      observador.actualizar(evento, pedido);
    }
  }
}
