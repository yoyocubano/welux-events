# 📋 MASTER MISSION ORDER: Jobs Integration Finalization

Este documento unifica las investigaciones de Antigravity y Comet para la puesta en marcha definitiva del Jobs Aggregator.

## 🔴 ESTADO URGENTE: Supabase Pausado
- **Proyecto**: "viayoyo"
- **Acción**: El usuario debe **REANUDAR** el proyecto en el Dashboard de Supabase antes de cualquier sincronización real. Sin esto, el script fallará al intentar insertar datos.

---

## 🔍 FASE 1: Fuentes de Datos (EURES & Randstad)

### 1. EURES (Portal Europeo) ⚠️ 
- **Hallazgo**: La API oficial es solo para socios registrados (EURES Partners).
- **Solución Sugerida**:
    - **Opción A**: Seguir usando el Portal de ADEM (que ya agrega muchas ofertas de EURES/Luxemburgo).
    - **Opción B**: Implementar un Scraping ligero del portal público [EURES Search](https://europa.eu/eures/portal/jv-se/home?lang=en).
- **Tarea para Comet**: Investigar si existe un endpoint interno JSON en el sitio público que no requiera API Key.

### 2. Randstad Luxemburgo ✅
- **Estado**: Requiere registro en el [Developer Portal](https://developer.randstad.com).
- **Tarea**: Crear cuenta corporativa, obtener `Client ID` y `Client Secret`.
- **Rotación**: Recordar que las llaves expiran cada 90 días.

---

## 🗄️ FASE 2: Optimizaciones de Base de Datos (SQL)

Una vez que Supabase esté activo, ejecuta este script en el SQL Editor:

```sql
-- Limpiar duplicados accidentales
DELETE FROM content_items 
WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY link_url ORDER BY created_at DESC) as row_num
        FROM content_items
        WHERE section = 'jobs'
    ) t
    WHERE t.row_num > 1
);

-- Garantizar unicidad (Crucial para el comando UPSERT)
ALTER TABLE public.content_items 
ADD CONSTRAINT unique_job_link_url UNIQUE (link_url);
```

---

## 💻 FASE 3: Despliegue del Script

El script `jobs-aggregator.js` ya incluye:
- **ADEM Directo**: Funcionando con datos reales.
- **Contacto Único**: Cada oferta tiene su ID de vacante en el link.
- **Deduplicación Local**: Protege contra colisiones de datos.

### Próximos pasos de codificación:
- Cambiar el orquestador a un `upsert` nativo de Supabase una vez aplicada la restricción SQL.
- Configurar las variables `EURES_API_KEY` y `RANDSTAD_CLIENT_ID` en el entorno de producción (GitHub Secrets).
