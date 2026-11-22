# Informe de uso de IA · Caso B · Juan David Vergara Ruiz

Herramienta(s) y versión: Gemini (Google)
¿Usé IA? Sí

| Parte | Qué hizo la IA | Qué hice yo | % aprox. de la IA |
|---|---|---|---|
| Parte 1 · Principios | Ayudó a estructurar la tabla comparativa identificando las líneas exactas donde se violan SRP, OCP, DIP, DRY y KISS en `pedidos.js`. | Analicé el código espagueti del Caso B, validé cada violación frente a las reglas de negocio de cafetería y redacté las consecuencias con mis palabras. | 50% |
| Parte 2 · Patrones de diseño | Propuso la estructura base de las clases para Strategy (`EstrategiaDescuento`) y Observer (`PublicadorEventosPedido`). | Implementé las estrategias concretas (`DescuentoEgresado`), ajusté la regla del 5% adicional sobre $30.000, probé la suscripción de observadores y verifiqué que no se modificaran clases existentes. | 65% |
| Parte 3 · Patrón arquitectónico | Generó el esqueleto inicial de carpetas hexagonales y el servidor HTTP nativo en `node:http`. | Configuré el proyecto en Cursor, probé las rutas en PowerShell, ajusté validaciones de error de stock y verifiqué las 4 operaciones requeridas. | 70% |
| README y diagrama | Generó la plantilla base del diagrama Mermaid y el formato Markdown de las secciones. | Revisé que cada ruta de archivo coincidiera con mi repositorio, agregué los comandos probados en mi equipo y completé las evidencias. | 70% |

Porcentaje global estimado de la IA: 65% (calculado promediando el aporte en código estructural y documentación frente a mi trabajo de diseño, ajustes de reglas de negocio, pruebas en consola/HTTP y verificación manual).
Prompts clave (de 3 a 5):
1. "Analiza el código espagueti de pedidos de cafetería e identifica violaciones a principios SOLID, DRY, KISS y acoplamiento con sus líneas exactas."
2. "Refactoriza el cálculo de descuentos usando el patrón Strategy y las notificaciones a cocina, SMS e inventario usando Observer en Node.js."
3. "Organiza el módulo con Arquitectura Hexagonal incluyendo adaptador en memoria, casos de uso y API HTTP mínima sin dependencias externas."
4. "Genera el diagrama Mermaid de puertos y adaptadores y la estructura de documentación para el README."

Qué corregí o rechacé de lo que propuso la IA:
- Ajusté la validación de cancelación de pedido para verificar explícitamente que el pedido no estuviera ya cancelado antes de volver a reponer el stock en el inventario (evitando duplicar inventario si se llama dos veces a cancelar).
- Simplifiqué el servidor HTTP usando `node:http` nativo en lugar de instalar Express para mantener cero dependencias externas.

Qué puedo explicar sin ayuda:
- Cómo funcionan el patrón Strategy (contexto `Pedido` y estrategias de descuento) y el patrón Observer (`PublicadorEventosPedido` y observadores de cocina, SMS e inventario).
- Por qué el dominio no depende de consola, DOM ni memoria gracias a los puertos (`PedidoRepositorio` y `ProductoRepositorio`) y cómo agregar un nuevo cliente o canal sin tocar código existente.
