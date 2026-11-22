# Taller supletorio · Caso B · Juan David Vergara Ruiz

## Parte 1 · Principios

| Principio violado | Líneas del código original | Qué pasa hoy (consecuencia concreta en este caso) | Cómo lo resolviste en tu código (archivo y clase) |
|---|---|---|---|
| **SRP** (Single Responsibility Principle) | Líneas 6–34 (`hacerPedido`) | Una sola función valida datos del cliente, busca productos en arreglos, calcula subtotales y descuentos, actualiza el stock, guarda el pedido, imprime mensajes para cocina y SMS, y modifica el DOM (`document.getElementById`). Si cambia el formato del SMS o la interfaz web, hay que editar la función donde se calcula el precio del almuerzo. | Se separó cada responsabilidad: reglas y cálculo en `src/dominio/entidades/Pedido.js` (`Pedido`), orquestación en `src/aplicacion/PedidoServicio.js` (`PedidoServicio`), persistencia en `src/infraestructura/persistencia/` y notificaciones en `src/infraestructura/observadores/`. |
| **OCP** (Open/Closed Principle) | Líneas 18–21 | Los descuentos por tipo de cliente están quemados con `if / else if` (`"estudiante"`, `"docente"`, `"visitante"`). Si mañana la cafetería quiere dar 8% de descuento a `"egresado"` o `"administrativo"`, hay que abrir y modificar directamente la función `hacerPedido`, arriesgando dañar el cálculo de los demás clientes. | Se aplicó el patrón Strategy en `src/dominio/estrategias/` (`EstrategiaDescuento` y sus implementaciones `DescuentoEstudiante`, `DescuentoDocente`, `DescuentoVisitante`, `DescuentoEgresado`). Agregar un cliente nuevo solo requiere crear una clase nueva. |
| **DIP** (Dependency Inversion Principle) | Líneas 2–3, 25–33, 42–50 | Las funciones de negocio dependen directamente de arreglos globales en memoria (`pedidos`, `productos`), de `console.log` y de `document.getElementById`. Es imposible ejecutar el código en Node.js sin navegador (falla por `document is not defined`) o cambiar los arreglos por una base de datos sin reescribir la lógica. | Se definieron interfaces (puertos) en `src/dominio/puertos/` (`PedidoRepositorio`, `ProductoRepositorio`) y eventos en `src/dominio/eventos/PublicadorEventosPedido.js`. `PedidoServicio` depende solo de esas abstracciones, no de la consola ni del DOM. |
| **DRY** (Don't Repeat Yourself) | Líneas 6 vs. 37 y líneas 23–27 vs. 42–46 | La validación del nombre del cliente (`!cliente || !cliente.nombre || cliente.nombre.length < 3`) está duplicada idéntica en `hacerPedido` y `cancelarPedido`. Además, el doble ciclo `for` anidado para buscar productos por `id` y modificar `stock` se repite 3 veces (validar stock, restar stock y devolver stock). | La validación del cliente se centralizó en la entidad `Pedido` (`src/dominio/entidades/Pedido.js`), y la actualización de inventario se movió a métodos únicos en `Producto` (`descontarStock` y `reponerStock` en `src/dominio/entidades/Producto.js`) y `ObservadorInventario`. |
| **KISS** (Keep It Simple, Stupid) | Líneas 10–12, 23–27, 42–46 | Para cruzar los ítems del pedido con el catálogo de productos se escriben bucles `for` anidados con variables índice (`i`, `j`, `k`, `m`) y banderas `var prod = null`, volviendo confusa una búsqueda simple por identificador y elevando la complejidad innecesariamente. | Se reemplazaron los ciclos anidados por búsquedas limpias en el repositorio (`buscarPorId` en `ProductoRepositorioMemoria.js`) y métodos expresivos como `map` y `reduce` en `PedidoServicio.js` y `Pedido.js`. |
| **Alto Acoplamiento** | Líneas 31–33 y 48–50 | El dominio está fuertemente acoplado a la capa de presentación del navegador (`document.getElementById("res").innerHTML`). Si se intenta probar la creación de un pedido desde terminal o API REST, el programa lanza una excepción en tiempo de ejecución. | Se desacopló la presentación por completo: `PedidoServicio` devuelve objetos puros de dominio y el adaptador HTTP (`src/infraestructura/entrada/http/servidor.js`) o la consola (`demo.js`) deciden cómo mostrar el resultado. |
| **Baja Cohesión** | Líneas 1–51 (`pedidos.js`) | Todo el archivo mezcla datos globales, validaciones de entrada, reglas financieras de descuentos, manejo de inventario, envío de notificaciones y renderizado HTML en un mismo módulo sin límites claros. | Cada carpeta y clase agrupa elementos estrechamente relacionados: `entidades/` para el estado y reglas del negocio, `estrategias/` para descuentos, `observadores/` para avisos y `persistencia/` para almacenamiento. |

---

## Parte 2 · Patrones de diseño

### Patrón 1 · Strategy (Cálculo de descuentos según tipo de cliente)
1. **Problema que resuelve:** En `original/pedidos.js` (líneas 18–21), las tarifas de descuento están acopladas dentro de `hacerPedido` mediante condicionales `if / else if`. Cada nuevo tipo de usuario obliga a modificar la función principal y re-testear toda la lógica del pedido.
2. **Roles del patrón (nomenclatura Refactoring.Guru):**
   - **Context (Contexto):** `Pedido` (`src/dominio/entidades/Pedido.js`) — recibe la estrategia elegida y delega el cálculo del descuento base antes de evaluar el 5% adicional por compras mayores a $30.000.
   - **Strategy (Interfaz de Estrategia):** `EstrategiaDescuento` (`src/dominio/estrategias/EstrategiaDescuento.js`) — define el contrato `calcular(subtotal)`.
   - **Concrete Strategies (Estrategias Concretas):** `DescuentoEstudiante` (10%), `DescuentoDocente` (5%), `DescuentoVisitante` (0%) y `DescuentoEgresado` (8%) en `src/dominio/estrategias/`.
   - **Client (Cliente):** `PedidoServicio` junto con `FabricaEstrategiasDescuento` (`src/dominio/estrategias/FabricaEstrategiasDescuento.js`), que selecciona la estrategia según `cliente.tipo` y la inyecta en `Pedido`.
3. **Relación con SOLID:** Cumple **OCP** (Open/Closed Principle), ya que el cálculo de precios está abierto a nuevas tarifas sin modificar la entidad `Pedido`, y **SRP**, al aislar cada fórmula matemática en su propia clase.

### Patrón 2 · Observer (Notificaciones a cocina, SMS e inventario)
1. **Problema que resuelve:** En `original/pedidos.js` (líneas 23–33 y 42–50), tanto `hacerPedido` como `cancelarPedido` tienen quemados los efectos secundarios: descontar/reponer stock, avisar a cocina y enviar SMS. Si se requiere agregar un canal nuevo (como correo al administrador), hay que tocar ambos métodos de negocio.
2. **Roles del patrón (nomenclatura Refactoring.Guru):**
   - **Publisher (Notificador):** `PublicadorEventosPedido` (`src/dominio/eventos/PublicadorEventosPedido.js`) — mantiene la lista de suscriptores y ejecuta `notificar(evento, pedido)`.
   - **Subscriber (Interfaz Suscriptor):** Contrato `actualizar(evento, pedido)` implementado por todos los observadores.
   - **Concrete Subscribers (Suscriptores Concretos):** `ObservadorCocina`, `ObservadorClienteSMS`, `ObservadorInventario` y `ObservadorCorreoAdmin` en `src/infraestructura/observadores/`.
   - **Client (Cliente):** `servidor.js` y `demo.js`, que instancian los observadores y los suscriben al publicador al iniciar la aplicación.
3. **Relación con SOLID:** Cumple **OCP** (se suscriben nuevos canales sin modificar `PedidoServicio`) y **DIP** (la capa de aplicación publica eventos sobre una abstracción sin conocer detalles de SMS, consola o inventario).

### Extensión (Beneficio sin modificar clases existentes)
1. **Nuevo tipo de cliente (`egresado` con 8% de descuento):** Se creó `src/dominio/estrategias/DescuentoEgresado.js` y se registró en `FabricaEstrategiasDescuento.js`. **No se tocó** `Pedido.js`, `PedidoServicio.js` ni las estrategias existentes.
2. **Nuevo canal de notificación (`ObservadorCorreoAdmin`):** Se creó `src/infraestructura/observadores/ObservadorCorreoAdmin.js` y se suscribió en `demo.js` y `servidor.js`. **No se tocó** `PedidoServicio.js`, `PublicadorEventosPedido.js` ni los demás observadores.
---

## Cómo ejecutar

### Requisitos
- Node.js v20 o superior (probado en Node.js v26.13.0). Sin dependencias externas.

### Ejecución rápida en consola (demostración de los 4 casos de uso y validaciones)
```bash
npm run demo