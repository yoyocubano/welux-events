# Manual de Administración - Welux Events

Bienvenido al Panel de Administración de Welux Events. Este documento sirve como guía operativa para gestionar el sitio web, los clientes y los contenidos de la plataforma.

## 1. Acceso y Seguridad

Para acceder al panel de administración, navegue a `/admin` en su navegador.

- **Autenticación**: Se requiere un código de acceso único.
- **Bloqueo de Seguridad**: Tras varios intentos fallidos, el sistema puede bloquear temporalmente el acceso.

### Cambio de Contraseña de Administrador
Para cambiar la contraseña de administración, debe dirigirse a la sección **"Security Settings"** en el panel.

**Requisito Obligatorio**: Necesitará su **Código Maestro de Seguridad** (Master Security Code). Este código es diferente a la contraseña diaria y sirve como llave maestra para cambios críticos.

## 2. Descripción General del Dashboard

Al iniciar sesión, verá el panel principal organizado en tarjetas inteligentes:
- **System Health**: Monitor en tiempo real de la base de datos, IA y servicios de correo.
- **Supervisión Total**: Acceso a diagnósticos profundos y logs del servidor.
- **Client Leads (CRM)**: Gestión de clientes interesados.
- **Módulos de Contenido**: Streaming, Vlog, Jobs, Deals, Servicios, Tips Locales.

---

## 3. Módulos Operativos

### A. CRM de Clientes (Leads)
Este módulo centraliza todas las solicitudes recibidas a través del sitio web y el Chatbot IA "Rebeca".
- **Visualización**: Lista cronológica de solicitudes.
- **Datos**: Nombre, Correo/Teléfono, Tipo de Evento, y Mensaje original.
- **Origen**: Indica si el cliente llegó por formulario web o chat.

### B. Streaming & TV
Gestione las transmisiones en vivo y videos destacados de la página "Live".
- **Plataforma**: Elija entre **YouTube** o **Embed Personalizado**.
- **YouTube Automático**: Pegue un enlace completo de YouTube y el sistema extraerá automáticamente el ID.
- **Vista Previa**: Verifique en tiempo real cómo se ve el video en la tarjeta de "Live Preview".
- **Programación (Schedule)**: Campo de texto libre para anunciar próximas transmisiones (Formato: `Fecha - Título`).

### C. Gestores de Contenido (Vlog, Jobs, Deals, Services, Tips)
Todos estos módulos funcionan de manera idéntica para facilitar su uso:
1. **Crear**: Pulse el botón "+" para añadir una nueva entrada.
2. **Campos**:
   - *Título*: El encabezado principal.
   - *Subtítulo*: Categoría o información secundaria.
   - *Descripción*: El cuerpo del contenido.
   - *Badge/Etiqueta*: Un texto corto para resaltar (ej. "Nuevo", "-20%", "4.5 Estrellas").
   - *Imagen*: URL de la imagen (opcional).
   - *Enlace*: URL externa (opcional).
3. **Gestión**: Puede editar o eliminar entradas existentes al instante.

### D. Centro de Supervisión
Diseñado para el control técnico total.
- **Matriz de Servicios**: Muestra el estado (Online/Offline) y latencia de Database, AI Brain, Email, etc.
- **Pulso del Negocio**: Métricas clave como Total de Leads y estado del Calendario.
- **Logs del Sistema**: Una terminal virtual que muestra mensajes de diagnóstico del servidor backend.

---

## 4. Notas Técnicas Importantes

- **Actualización**: Los cambios de contenido (texto/ofertas) son inmediatos.
- **Imágenes**: Se recomienda usar enlaces directos a imágenes optimizadas o alojadas en el bucket público.

---
*Documento generado automáticamente por Welux AI System - 2026*
