# Instrucciones de Implementación - WEL Weddings & Events Luxembourg

Este documento detalla los pasos realizados para la implementación de la nueva identidad de marca "Luxury", el formulario de contacto avanzado y la configuración de idiomas.

## 1. Identidad de Marca y Favicons
Se ha generado e implementado un set completo de favicons premium en oro y negro.
*   **Archivos:** `client/public/favicon.ico`, `favicon.png`, `apple-touch-icon.png`, `site.webmanifest`.
*   **Código:** Referencias actualizadas en `client/index.html`.

## 2. Formulario de Contacto "Luxury"
El formulario ha sido refactorizado para ofrecer una experiencia de usuario premium con validación estricta y protección anti-spam.

*   **Estilos:** Clase `.luxury-form` en `client/src/index.css`.
*   **Lógica:** Validación con `Zod` y `react-hook-form` en `client/src/pages/Contact.tsx`.
*   **Anti-Spam:** Honeypot implementado + Placeholder para reCAPTCHA v3.
*   **Validación:**
    *   Nombre: Mínimo 2 caracteres.
    *   Mensaje: Mínimo 10 caracteres.
    *   Teléfono: Regex internacional flexible.
    *   Fecha: Debe ser futura.

## 3. Internacionalización (i18n)
Todos los cambios se han propagado a los 6 idiomas soportados (EN, ES, FR, DE, LB, PT).

*   **Archivos de Traducción:** `client/public/locales/[lang]/translation.json`.
*   **Marca:** El nombre de la marca se ha estandarizado a **"WEL Weddings & Events Luxembourg"** en todos los idiomas (anteriormente variaba).
*   **Mensajes de Error:** Se han añadido claves específicas (`contact.form.validation.*`) para asegurar que los errores del formulario aparezcan en el idioma del usuario.

## 4. Próximos Pasos (Netlify)
Para activar la protección reCAPTCHA completa en producción:

1.  Obtener claves de Google reCAPTCHA v3.
2.  Configurar variables de entorno en Netlify:
    *   `VITE_RECAPTCHA_SITE_KEY`
    *   `RECAPTCHA_SECRET_KEY` (si se usa backend serverless) de momento el frontend solo tiene el placeholder en `index.html`.

## 5. Verificación
El despliegue debe realizarse automáticamente al hacer push a la rama `main`.
*   Verificar que no haya errores de build (se corrigió `Footer.tsx`).
*   Probar el formulario en inglés y español para confirmar las validaciones localizadas.
