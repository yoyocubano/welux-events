# 🟢 WhatsApp Features Roadmap (Rebeca AI)

Este documento define la hoja de ruta para transformar el Chat Widget en una experiencia nativa similar a WhatsApp.

## 🎯 Objetivo
Lograr una paridad visual y funcional del 99% con WhatsApp para transmitir profesionalismo y familiaridad.

## ✅ Fase 1: Feedback Visual (Ticks)
El usuario necesita saber el estado de su mensaje.
- [ ] **Enviado:** 1 Tick Gris (✓) al enviar.
- [ ] **Entregado:** 2 Ticks Grises (✓✓) cuando el servidor responde (simulado).
- [ ] **Leído:** 2 Ticks Azules (✓✓) cuando Rebeca empieza a "escribir" o responde.
- [ ] **Diseño:** SVG optimizados, tamaño exacto (16px), alineados al lado de la hora.

## 🔊 Fase 2: Feedback Auditivo (Sonidos)
La experiencia WhatsApp es multisensorial.
- [ ] **Sonido "Pop" (Outgoing):** Al enviar un mensaje.
- [ ] **Sonido "Notificación" (Incoming):** Al recibir respuesta de Rebeca.
- [ ] **Toggle Mute:** Opción para silenciar (opcional, por defecto on).

## 🎨 Fase 3: UI & Estética
Detalles sutiles que marcan la diferencia.
- [ ] **Separadores de Fecha:** "Hoy", "Ayer" flotando en el centro.
- [ ] **Burbujas con "Colita" (Tails):** SVG Tails en las esquinas de los mensajes para efecto de globo de texto real.
- [ ] **Fondo (Wallpaper):** Patrón sutil estilo "WhatsApp Doodle" en el fondo oscuro (#0F0F0F).

## ⚡ Fase 4: Comportamiento (Ya Implementado)
- [x] **Agrupación (Ladrillos):** Mensajes seguidos juntos.
- [x] **Hora Exacta:** Timestamp en cada mensaje.
- [x] **Scroll Inteligente:** No molestar si se lee historial.

---

## 🛠 Plan de Implementación
1. Implementar componente `MessageStatus` (Ticks).
2. Añadir archivos de audio a `public/sounds`.
3. Crear Hook `useChatSound` para gestión de audio.
4. Actualizar `ChatWidget.tsx` para integrar Ticks y Sonidos.
