# INFORME DE TAREA 03: PRUEBAS DE INTEGRACIÓN (QA)
## Asignado a: Junior Developer C (Testing & QA)

**Objetivo**: Validar que la "conexión espejo" entre la App y la Web funcione perfectamente.

### Descripción Detallada:
Debemos certificar que la App no es solo un diseño, sino un control remoto real. Probarás el flujo de datos bidireccional.

### Pasos a Ejecutar:
1.  **Prueba de Login**:
    *   Intenta entrar con una contraseña incorrecta (ej: `1234`). Debe dar error.
    *   Entra con la Master Key correcta (`lux_master_2026`). Debe acceder.
2.  **Prueba de CRM (Leads)**:
    *   Ve a la web `weluxevents.com` -> Contacto.
    *   Envía un formulario de prueba (Nombre: "Test Mobile", Email: "test@qa.com").
    *   **Acción**: Abre la App -> Pantalla Leads -> Haz "Pull to Refresh" (arrastrar hacia abajo).
    *   **Resultado esperado**: El lead "Test Mobile" debe aparecer instantáneamente en la lista.
3.  **Prueba de Streaming**:
    *   En la App -> Pantalla Control TV.
    *   Cambia la plataforma a "YouTube" y pon un ID cualquiera (ej: `dQw4w9WgXcQ`).
    *   Dale a "ACTUALIZAR SITIO WEB".
    *   **Resultado esperado**: Ve a `weluxevents.com/live` en tu navegador. El video debe haber cambiado.

---
**Idioma del Reporte**: Español (Texto plano)
**Entrega Esperada**: Un documento `QA_REPORT.md` con checkmarks (✅) para cada prueba exitosa o descripción de fallos.
