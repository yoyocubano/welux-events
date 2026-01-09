import os
import time
from textblob import TextBlob
import sys

def colored(text, color_code):
    return f"\033[{color_code}m{text}\033[0m"

def type_effect(text, delay=0.03):
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay)
    print("")

def speak_with_emotion(text):
    """
    Analiza el sentimiento y ajusta la voz y velocidad para reflejar la emoción.
    Utiliza el motor TTS nativo de macOS ('say').
    """
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity # -1.0 (Negativo) a 1.0 (Positivo)
    
    # Configuración por defecto (Neutra)
    voice = "Samantha"
    rate = 175
    emotion_label = "NEUTRAL 😐"
    color = "1;37" # Blanco

    # Lógica de Mapeo Emocional
    if polarity > 0.5:
        # Entusiasmo / Felicidad
        voice = "Victoria" # Voz femenina brillante
        rate = 200        # Más rápido por la energía
        emotion_label = "ENTUSIASMO 😃"
        color = "1;32"    # Verde
    elif polarity < -0.3:
        # Tristeza / Seriedad / Preocupación
        voice = "Ralph"   # Voz grave y profunda
        rate = 140        # Lento y solemne
        emotion_label = "SERIEDAD/PREOCUPACIÓN 😔"
        color = "1;31"    # Rojo
    elif polarity > 0:
        # Ligeramente positivo / Agradable
        voice = "Samantha"
        rate = 180
        emotion_label = "AGRADABLE 🙂"
        color = "1;36"    # Cyan

    print(colored(f"\n   [🧠 Análisis de Sentimiento] Score: {polarity:.2f} -> {emotion_label}", color))
    print(colored(f"   [🗣️ Ajuste Vocal] Voz: {voice} | Velocidad: {rate} wpm", "0;33"))
    print(f"   > 🔊 Reproduciendo: '{text}'")
    
    # Ejecutar comando de voz en macOS
    # -v: Voz
    # -r: Rate (palabras por minuto)
    os.system(f'say -v {voice} -r {rate} "{text}"')
    time.sleep(0.5)

def run_test():
    print(colored("\n🧪 INICIANDO PRUEBA DE TTS CON INTELIGENCIA EMOCIONAL", "1;35"))
    print(colored("=====================================================", "1;35"))
    time.sleep(1)

    # Caso 1: Alegría extrema
    print(colored("\n--- CASO 1: NOTICIAS EXCELENTES ---", "1;34"))
    speak_with_emotion("OMG! This is absolutely amazing! I am so happy with the results, everything is perfect!")

    # Caso 2: Noticia triste/seria
    print(colored("\n--- CASO 2: REPORTE DE ERROR CRíTICO ---", "1;34"))
    speak_with_emotion("I have bad news. The system failed completely and we lost all the data. It is a disaster.")

    # Caso 3: Información técnica neutra
    print(colored("\n--- CASO 3: REPORTE TÉCNICO ---", "1;34"))
    speak_with_emotion("The server is running at normal capacity. All diagnostics are within standard parameters.")

    print(colored("\n✅ Prueba finalizada.", "1;32"))

if __name__ == "__main__":
    run_test()
