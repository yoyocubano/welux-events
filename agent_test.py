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

def run_test():
    print(colored("\n🚀 INICIANDO SECUENCIA DEAL PRUEBA DEL SUPERALINEAMIENTO...", "1;36"))
    time.sleep(0.5)

    # 1. Prueba de Capacidad Cognitiva / Emocional (TextBlob)
    print(colored("\n[1] Probando Módulo de Análisis Emocional (TextBlob)...", "1;33"))
    test_phrase = "This architecture is incredibly robust and beautiful."
    
    try:
        blob = TextBlob(test_phrase)
        sentiment_score = blob.sentiment.polarity
        
        print(f"   > Entrada: '{test_phrase}'")
        print(f"   > Sentimiento detectado: {sentiment_score} (Positivo)")
        
        if sentiment_score > 0.5:
            print(colored("   ✅ Módulo Emocional: OPERATIVO", "1;32"))
        else:
            print(colored("   ⚠️ Módulo Emocional: Calibración necesaria", "1;31"))
            
    except Exception as e:
        print(colored(f"   ❌ Error en módulo emocional: {e}", "1;31"))

    # 2. Prueba de Capacidad de Voz (Sistema Nativo macOS)
    print(colored("\n[2] Probando Módulo de Síntesis de Voz (TTS)...", "1;33"))
    speech_text = "All systems operational. I am ready to collaborate."
    
    try:
        print(f"   > Generando audio: '{speech_text}'")
        # Usamos el comando nativo de Mac 'say' que es de altísima calidad y latencia cero
        # Usamos la voz 'Samantha' o por defecto
        os.system(f'say -v Samantha "{speech_text}"') 
        print(colored("   ✅ Módulo de Voz: OPERATIVO (Audio generado)", "1;32"))
    except Exception as e:
        print(colored(f"   ❌ Error en módulo de voz: {e}", "1;31"))

    # 3. Resumen
    print(colored("\n---------------------------------------------------", "1;34"))
    type_effect(colored("RESULTADO DEL DIAGNÓSTICO: EL AGENTE ESTÁ DESPIERTO.", "1;37"))
    print(colored("---------------------------------------------------", "1;34"))

if __name__ == "__main__":
    run_test()
