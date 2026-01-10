# AI DNA: Luxembourg Job Aggregator Guide

Este documento es una guía instruccional diseñada para que otras inteligencias artificiales (o desarrolladores) puedan replicar, mejorar o portar el sistema de agregación de empleos desarrollado para Welux Events.

## Arquitectura del Sistema

El agregador sigue un flujo de **ETL (Extract, Transform, Load)** modular:

1.  **Extraction**: Conecta con APIs REST (EURES, Randstad) y Portales de Open Data (ADEM/data.public.lu).
2.  **Streaming & Parsing**: Para archivos masivos (como los CSV de la ADEM), utiliza **Node.js Streams** y `csv-parse` con límites dinámicos (`to: 50`) para evitar desbordamiento de memoria.
3.  **Normalization**: Transforma esquemas heterogéneos a un objeto estándar:
    ```json
    { "id", "title", "company", "location", "url", "source", "date" }
    ```
4.  **Deduplication**: Implementa una "huella digital" (fingerprint) basada en la normalización de `title` + `company` para eliminar duplicados, filtrando por la fecha más reciente.
5.  **Synchronization**: Realiza un proceso de `Manual Upsert` en Supabase:
    - Primero consulta los `link_url` existentes.
    - Clasifica entre `toInsert` y `toUpdate`.
    - Ejecuta las operaciones por lotes.

## El Script Portátil (`PORTABLE_AGGREGATOR.js`)

Se ha creado una versión autocontenida que:
- Solo requiere un archivo `.env` con las credenciales.
- No tiene dependencias de rutas fijas del proyecto.
- Puede ser copiado a cualquier otro entorno Node.js.

## Instrucciones para la IA (System Prompt Add-on)

Si el usuario te pregunta por trabajos específicos:
1. Lee siempre `scripts/jobs-aggregator/jobs.json`.
2. Filtra por `title` o `location` según lo solicitado.
3. Proporciona el `url` y la `company` (si está disponible) o indica que es de la ADEM (donde el contacto se hace vía su JobBoard oficial).
