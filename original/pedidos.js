// pedidos.js
var pedidos = [];
var productos = [{ id: 1, nombre: "Empanada", precio: 3500, stock: 20 },
                 { id: 2, nombre: "Almuerzo", precio: 14000, stock: 8 }];

function hacerPedido(cliente, items) {
  if (!cliente || !cliente.nombre || cliente.nombre.length < 3) { console.log("Error: cliente invalido"); return; }
  if (!items || items.length == 0) { console.log("Error: pedido vacio"); return; }
  var subtotal = 0;
  for (var i = 0; i < items.length; i++) {
    var prod = null;
    for (var j = 0; j < productos.length; j++) { if (productos[j].id == items[i].id) prod = productos[j]; }
    if (!prod) { console.log("Error: producto no existe"); return; }
    if (items[i].cantidad <= 0) { console.log("Error: cantidad invalida"); return; }
    if (prod.stock < items[i].cantidad) { console.log("Error: sin stock de " + prod.nombre); return; }
    subtotal = subtotal + prod.precio * items[i].cantidad;
  }
  var descuento = 0;
  if (cliente.tipo == "estudiante") descuento = subtotal * 0.10;
  else if (cliente.tipo == "docente") descuento = subtotal * 0.05;
  else if (cliente.tipo == "visitante") descuento = 0;
  if (subtotal > 30000) descuento = descuento + subtotal * 0.05;
  var total = subtotal - descuento;
  for (var k = 0; k < items.length; k++) {
    for (var m = 0; m < productos.length; m++) {
      if (productos[m].id == items[k].id) productos[m].stock = productos[m].stock - items[k].cantidad;
    }
  }
  var pedido = { id: pedidos.length + 1, cliente: cliente.nombre, items: items, total: total, estado: "confirmado" };
  pedidos.push(pedido);
  console.log("COCINA: preparar pedido #" + pedido.id);
  console.log("SMS a " + cliente.celular + ": tu pedido #" + pedido.id + " cuesta $" + total);
  document.getElementById("res").innerHTML = "<b>Pedido #" + pedido.id + " total $" + total + "</b>";
}

function cancelarPedido(cliente, pedidoId) {
  if (!cliente || !cliente.nombre || cliente.nombre.length < 3) { console.log("Error: cliente invalido"); return; }
  for (var i = 0; i < pedidos.length; i++) {
    if (pedidos[i].id == pedidoId && pedidos[i].cliente == cliente.nombre) {
      pedidos[i].estado = "cancelado";
      for (var k = 0; k < pedidos[i].items.length; k++) {
        for (var m = 0; m < productos.length; m++) {
          if (productos[m].id == pedidos[i].items[k].id) productos[m].stock = productos[m].stock + pedidos[i].items[k].cantidad;
        }
      }
      console.log("COCINA: cancelar pedido #" + pedidoId);
      console.log("SMS a " + cliente.celular + ": tu pedido #" + pedidoId + " fue cancelado");
      document.getElementById("res").innerHTML = "<b>Pedido cancelado</b>";
    }
  }
}
