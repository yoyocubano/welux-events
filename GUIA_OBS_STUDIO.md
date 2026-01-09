# 🎥 Guía Definitiva: OBS Studio para Welux Events

Esta guía te enseñará a convertir tu ordenador en un estudio de televisión profesional para emitir en tu web (`weluxevents.com/live`) cualquier cosa: desde tu cámara web hasta lo que estes viendo en TikTok o Instagram.

---

## 1. Instalación Básica (El Motor)

### Descargar OBS Studio
Es el estándar mundial, gratuito y de código abierto.
1.  Ve a [obsproject.com](https://obsproject.com/es).
2.  Pulsa en **macOS** (ya que usas Mac).
3.  Descarga e instala el archivo `.dmg`.
4.  Al abrirlo por primera vez, te preguntará si quieres "Optimizar para transmisión". Dile que **SÍ**.

---

## 2. Conectar OBS con tu YouTube
Para que la señal salga hacia tu canal (y de ahí a tu web):

1.  Abre OBS > **Ajustes** (abajo a la derecha) > **Emisión**.
2.  En "Servicio", elige **YouTube - RTMPS**.
3.  Pulsa **"Conectar cuenta"** (te abrirá el navegador para loguearte con tu Google).
    *   *Opción B (Manual):* Ve a YouTube Studio > Emitir en directo > Copia la "Clave de emisión" (Stream Key) y pégala en OBS.

---

## 3. Estrategia: "El Puente Social" (Emitir TikTok/Instagram)
Como estas redes no dejan embeber sus directos, la estrategia es "grabar tu pantalla".

### Pasos en OBS:
1.  En la sección **Fuentes** (abajo), pulsa `+`.
2.  Elige **"Captura de ventana"** (Window Capture).
3.  Ponle nombre (ej: "Navegador TikTok").
4.  En el desplegable, selecciona la ventana de **Google Chrome** donde tienes abierto el directo de TikTok/Insta.
5.  **Ajuste:** Verás la ventana en tu pantalla de OBS. Puedes recortarla (mantén pulsada la tecla `Alt` mientras mueves los bordes rojos) para que solo se vea el video vertical y no los menús del navegador.

---

## 4. Plugins y Recursos "Imprescindibles"

Para que se vea profesional y no "cutre", te recomiendo estos añadidos:

### A. Para Formato Vertical (Aitum Vertical Plugin)
Si vas a emitir mucho contenido de móvil (Shorts/Reels), este plugin es oro.
*   **¿Qué hace?** Te permite tener dos lienzos a la vez: uno horizontal (para YouTube normal) y uno vertical (para Shorts).
*   **Descarga:** [Aitum Vertical](https://aitum.tv/products/vertical)

### B. Para Estética (Move Transition)
*   **¿Qué hace?** Hace que cuando cambias de escena, los elementos se muevan suavemente en lugar de cortarse de golpe. Da un toque muy "Apple".
*   **Descarga:** Busca "Move Transition OBS" en [obsproject.com/forum/resources](https://obsproject.com/forum/resources/move.913/).

### C. Música Sin Copyright (Lofi / Background)
Para rellenar silencios sin que YouTube te bloquee.
*   **StreamBeats (Harris Heller):** Música gratuita y legal para streamers. [streambeats.com](https://www.streambeats.com/).
*   **NCS (NoCopyrightSounds):** En YouTube.

---

## 5. Tu Flujo de Trabajo "Maestro"

Cuando quieras emitir algo en tu web:

1.  **En tu Web (`/admin`):** Asegúrate de que está puesto tu ID de YouTube (modo automático).
2.  **En tu Ordenador:** Abre lo que quieras mostrar (Video, web de TikTok, cámara...).
3.  **En OBS:** Prepara la escena.
4.  **En OBS:** Pulsa **"Iniciar Transmisión"**.

¡Listo! En unos 10-20 segundos, tu web estará emitiendo al mundo tu señal profesional.
