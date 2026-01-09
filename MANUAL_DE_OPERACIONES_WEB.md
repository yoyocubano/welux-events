# Manual de Operaciones: Panel de Administración

Este documento explica cómo utilizar el nuevo Panel de Administración (`/admin`) para gestionar el contenido de la web y la seguridad.

## 1. Acceso al Panel
*   **URL:** `https://tudominio.com/admin` (o `/admin`).
*   **Contraseña Inicial:** `lux2026` (Si no la has cambiado).

---
## 2. Gestión de Seguridad (Contraseñas)
Ahora puedes cambiar tu contraseña de administrador directamente desde el panel.

### Cómo cambiar la contraseña
1.  Inicia sesión con tu código actual.
2.  Desplázate al final de la página, a la sección roja **"Security Settings"**.
3.  Escribe tu **Nueva Contraseña** en el campo de texto.
4.  Pulsa el botón rojo **"Update Password"**.
5.  El sistema te pedirá que vuelvas a iniciar sesión con la nueva clave.
    *   *Nota:* ¡No olvides tu nueva contraseña! Si la pierdes, tendrás que pedir ayuda técnica para resetearla en la base de datos.
    *   *Nota 2:* Este cambio es inmediato y afecta a todos los administradores.

---
## 3. Gestión de "En Vivo" (Streaming)
Controla la página `/live` y la cartelera `/streaming`.

### YouTube Channel ID
1.  Ve a tu canal de YouTube y copia tu **Channel ID** (empieza por `UC...`).
2.  Pégalo en el campo "YouTube Channel ID".
3.  Pulsa **"Save Streaming Settings"**.
    *   La página `/live` mostrará automáticamente tu directo.

### Upcoming Broadcasts (Cartelera)
Lista de futuros eventos en `/streaming`.
*   Formato JSON estricto: `[{"date": "...", "title": "..."}]`
*   Pulsa **"Save Streaming Settings"** para guardar.

---
## 4. Gestión del Vlog (Noticias)
Añade artículos a `/vlog`.

1.  **Title:** Título del post.
2.  **Category:** Categoría (ej: "Trends").
3.  **Image URL:** Link de la foto (recomendado: Unsplash).
4.  Pulsa **"Publish Post"**.
    *   Aparecerá el primero en la lista.

---
## 5. Instalación Inicial (Técnico)
Si es la primera vez que usas esto, asegura que has ejecutado los scripts en Supabase:
1.  Abre Supabase SQL Editor.
2.  Ejecuta el script `supabase_admin_schema.sql` (que ahora incluye la clave de seguridad).
3.  Ejecuta el script `supabase_vlog_schema.sql`.
