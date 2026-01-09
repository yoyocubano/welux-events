# 🧪 Prueba de VS Code AI Toolkit

## Objetivo

Demostrar cómo las herramientas instaladas pueden ayudar en el desarrollo de Welux Events.

## 🎯 Caso de Uso: Generar un Mapa Mental de la Arquitectura

### Paso 1: Usar Markmap

1. Abre este archivo en VS Code
2. Presiona `Cmd+Shift+P`
3. Escribe "Markmap: Open"
4. Verás un mapa mental interactivo de este contenido

### Arquitectura del Proyecto

```markdown
# Welux Events Architecture

## Frontend Layer
- Vite Build System
- React Components
  - Home
  - Contact
  - Protocol
  - Jobs
- TypeScript Strict Mode

## Internationalization (i18n)
- 6 Languages
  - Spanish (es)
  - English (en)
  - French (fr)
  - German (de)
  - Luxembourgish (lb)
  - Portuguese (pt)
- Translation Files
  - Schema SEO
  - Hero Sections
  - Services
  - Testimonials

## Backend Services
- Meta Pixel Tracking
- Google Business Schema
- WhatsApp Integration

## Agentic Layer
- BRAIN.md (Memory)
- Orchestrator (Integrity)
- OMNI_CONTEXT.md (Knowledge)
- Toolkit 2026 (Resources)

## Build & Deploy
- Production Build
- Client/Server Split
- Asset Optimization
```

## 🤖 Caso de Uso: Continue para Code Review

### Prompt para Continue (Cmd+L)

```
Analiza el archivo client/src/App.tsx y sugiere mejoras para:
1. Rendimiento (lazy loading de rutas)
2. Accesibilidad (ARIA labels)
3. SEO (meta tags dinámicas)

Usa el contexto de .agent/OMNI_CONTEXT.md
```

## 📊 Caso de Uso: Code Time Metrics

Code Time ya está midiendo:

- ⏱️ Tiempo en "Flow State"
- 📈 Productividad por hora del día
- 🎯 Líneas de código activas vs pasivas

Presiona el ícono de Code Time en la barra de estado para ver tus métricas.

## 🔍 Caso de Uso: GitLens para Auditoría

1. Abre cualquier archivo (ej: `scripts/orchestrator.js`)
2. Verás anotaciones inline de quién editó cada línea
3. Click en una línea → "Show Commit Details"
4. Ve el histórico completo de cambios

## ✨ Demo en Vivo

**Voy a crear un componente React simple para que veas Continue en acción:**
