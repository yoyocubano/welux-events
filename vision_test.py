import cv2
import os
import time
import numpy as np

def colored(text, color_code):
    return f"\033[{color_code}m{text}\033[0m"

def analyze_vision():
    print(colored("\n👁️ INICIANDO PRUEBA DE VISIÓN ARTIFICIAL (REINTENTO)", "1;36"))
    print(colored("=====================================================", "1;36"))
    
    img_path = "vision_sample.png"
    target_img = img_path
    source_type = "PANTALLA"

    # 1. Intentar Capturar Pantalla
    print(colored(f"\n[1] Intentando acceder a la retina digital (Screenshot)...", "1;33"))
    os.system(f"screencapture -x {img_path}")
    
    # Verificación de fallo de captura
    if not os.path.exists(img_path) or os.path.getsize(img_path) == 0:
        print(colored("   ⚠️ Acceso a pantalla bloqueado por macOS.", "1;31"))
        print(colored("   🔄 Cambiando objetivo a: Archivo Local (QR Code)", "1;34"))
        
        # Fallback: Usar una imagen real del proyecto
        fallback_img = "client/public/whatsapp-qr.png"
        if os.path.exists(fallback_img):
            target_img = fallback_img
            source_type = "ARCHIVO LOCAL"
        else:
            print(colored("   ❌ No se encontró imagen de respaldo.", "1;31"))
            return
    else:
        print(colored("   ✅ Captura de pantalla exitosa.", "1;32"))

    # 2. Procesar con OpenCV
    print(colored(f"[2] Procesando {source_type} con OpenCV...", "1;33"))
    try:
        # Leer imagen
        img = cv2.imread(target_img)
        
        if img is None:
            print(colored("   ❌ Error: OpenCV no pudo leer la imagen.", "1;31"))
            return

        # Análisis
        height, width, channels = img.shape
        pixel_count = height * width
        
        # Detección simple: Búsqueda de códigos QR (patrones cuadrados de alto contraste)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        detector = cv2.QRCodeDetector()
        data, bbox, _ = detector.detectAndDecode(gray)

        print(colored("\n✅ ANÁLISIS VISUAL COMPLETADO", "1;32"))
        print(f"      📐 Dimensiones: {width}x{height}")
        print(f"      👁️ Píxeles procesados: {pixel_count:,}")
        
        if data:
            print(colored(f"\n   🔍 ¡OBJETO INTELIGENTE DETECTADO!", "1;35"))
            print(f"      Tipo: Código QR")
            print(f"      Contenido decodificado: '{data}'")
        elif bbox is not None:
             print(colored(f"\n   🔍 Patrón QR detectado (pero no decodificado)", "1;35"))
        else:
            print(colored(f"\n   ℹ️ No se detectaron códigos, analizando estructura general.", "0;37"))

        # Análisis de color dominante
        avg_color_per_row = np.average(img, axis=0)
        avg_color = np.average(avg_color_per_row, axis=0)
        print(f"      🎨 Color promedio (BGR): {avg_color.astype(int)}")

    except Exception as e:
        print(colored(f"   ❌ Error crítico de visión: {e}", "1;31"))
    
    finally:
        # Limpieza solo si se creó una captura temporal
        if source_type == "PANTALLA" and os.path.exists(img_path):
            os.remove(img_path)

if __name__ == "__main__":
    analyze_vision()
