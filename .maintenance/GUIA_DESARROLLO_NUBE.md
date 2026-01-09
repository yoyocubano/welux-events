# 🚀 Guía Completa: Desarrollo en la Nube

## 📋 Tus Proyectos en GitHub

### ✅ Proyectos Subidos

1. **Welux Events**: <https://github.com/yoyocubano/welux-events>
2. **Luxelectro Web**: <https://github.com/yoyocubano/luxelectricweb1>

### 📦 Backup en Google Drive

- Ubicación: `~/Library/CloudStorage/GoogleDrive-yucolaguilar@gmail.com/Mi unidad/agentegravity/`
- Proyectos respaldados: 5 proyectos completos
- Tamaño total: ~616 MB

---

## 🌐 Opción 1: GitHub Codespaces (RECOMENDADO)

### **Ventajas:**

- ✅ 60 horas gratis al mes
- ✅ 4 cores, 8GB RAM (mejor que tu Mac)
- ✅ Todo en el navegador
- ✅ Sincronización automática con GitHub
- ✅ No consume recursos de tu Mac

### **Cómo usarlo:**

#### **Paso 1: Abrir Codespace**

1. Ve a: <https://github.com/yoyocubano/welux-events>
2. Click en el botón verde **"Code"**
3. Pestaña **"Codespaces"**
4. Click **"Create codespace on main"**

#### **Paso 2: Esperar instalación** (2-3 minutos)

- Se instalará Node.js, npm y todas las dependencias automáticamente

#### **Paso 3: Ejecutar el proyecto**

```bash
npm run dev
```

#### **Paso 4: Ver tu app**

- Click en "Open in Browser" cuando aparezca el puerto 5173
- O usa el panel "PORTS" en VS Code

### **Comandos útiles en Codespaces:**

```bash
# Ver estado
git status

# Hacer cambios
git add .
git commit -m "tu mensaje"
git push

# Instalar dependencias
npm install

# Ejecutar desarrollo
npm run dev

# Build producción
npm run build
```

---

## 🔧 Opción 2: Replit (Alternativa Simple)

### **Ventajas:**

- ✅ Más simple que Codespaces
- ✅ Colaboración en tiempo real
- ✅ Hosting gratuito incluido

### **Cómo usarlo:**

1. **Ir a**: <https://replit.com>
2. **Crear cuenta** (usa tu GitHub)
3. **Importar desde GitHub:**
   - Click "Create Repl"
   - "Import from GitHub"
   - Pega: `https://github.com/yoyocubano/welux-events`
4. **Ejecutar**: Click "Run"

---

## ⚡ Opción 3: StackBlitz (Más Rápido)

### **Ventajas:**

- ✅ Instantáneo (sin instalación)
- ✅ Funciona offline
- ✅ Hot reload ultra rápido

### **Cómo usarlo:**

**URL directa:**

```
https://stackblitz.com/github/yoyocubano/welux-events
```

Solo abre esa URL y listo. Todo funciona en segundos.

---

## 📊 Comparación de Servicios

| Característica | Codespaces | Replit | StackBlitz |
|---------------|------------|--------|------------|
| **Gratis** | 60h/mes | Ilimitado | Ilimitado |
| **RAM** | 8GB | 4GB | 2GB |
| **Velocidad** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Setup** | 2-3 min | 1-2 min | Instantáneo |
| **Hosting** | ❌ | ✅ | ❌ |
| **Mejor para** | Desarrollo serio | Prototipado | Ediciones rápidas |

---

## 🎯 Recomendación Personal

### **Para desarrollo diario:**

1. **GitHub Codespaces** - Proyecto principal (weluxevents)
2. **StackBlitz** - Ediciones rápidas y pruebas

### **Workflow sugerido:**

1. Abre Codespace al empezar el día
2. Trabaja normalmente
3. Haz commits regularmente
4. Cierra Codespace al terminar (ahorra horas gratis)

---

## 🔐 Configuración de Secretos

### **Variables de entorno en Codespaces:**

1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Codespaces
3. Agrega tus secretos:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - etc.

---

## 💡 Tips Pro

### **Ahorrar horas gratis de Codespaces:**

```bash
# Detener Codespace cuando no lo uses
# Settings → Stop codespace

# O configura auto-stop después de 30 min de inactividad
```

### **Sincronizar configuración:**

- Tu configuración de VS Code se sincroniza automáticamente
- Extensiones instaladas se guardan en `.devcontainer/devcontainer.json`

### **Acceso desde cualquier lugar:**

- Desde tu Mac: <https://github.com/codespaces>
- Desde iPad: <https://vscode.dev>
- Desde cualquier PC: Solo necesitas un navegador

---

## 🚨 En Caso de Emergencia

### **Si pierdes cambios:**

```bash
# Ver historial
git log

# Recuperar versión anterior
git checkout <commit-hash> -- <archivo>
```

### **Si el Codespace falla:**

1. Ciérralo
2. Crea uno nuevo
3. Tus cambios en GitHub están seguros

---

## 📞 Recursos Útiles

- **Docs Codespaces**: <https://docs.github.com/codespaces>
- **Replit Docs**: <https://docs.replit.com>
- **StackBlitz Docs**: <https://developer.stackblitz.com>

---

## ✅ Checklist Post-Reinicio

Después de reiniciar tu Mac:

- [ ] Ejecutar `~/optimize_mac.sh`
- [ ] Abrir GitHub Codespaces para weluxevents
- [ ] Verificar que todo funciona
- [ ] Trabajar solo en la nube (no local)
- [ ] Hacer commits frecuentes

---

**¡Tu Mac ahora solo necesita un navegador!** 🎉
