# APIs de Empleo para Luxemburgo - Guía de Referencia

## 1. APIs de Empleo con Niveles Gratuitos (Freemium)

| API | Nivel Gratuito | Parámetros para Luxemburgo | Lo mejor para... |
| :--- | :--- | :--- | :--- |
| **[Adzuna API](https://developer.adzuna.com/)** | Hasta 25,000 llamadas/mes | `country=lu` | Datos históricos y tendencias salariales |
| **[Careerjet API](https://www.careerjet.com/partners/api/)** | Acceso libre para socios (Publishers) | `locale_code=fr_LU` o `de_LU` | Gran volumen de ofertas locales |
| **[Jooble API](https://jooble.org/api/about)** | Gratuito (requiere registro) | `location=Luxembourg` | Integración rápida *(⚠️ Sin datos para LU actualmente)* |

---

## 2. Fuentes de Datos Abiertos (Open Data)

### Portal Open Data Luxemburgo (ADEM)
- **URL:** [data.public.lu](https://data.public.lu)
- Proporciona datasets en formatos abiertos (CSV, JSON) sobre vacantes declaradas a la ADEM.
- Ideal para análisis de mercado o precargar la base de datos.

### RSS Feeds de ADEM
- Suscripción a canales RSS para actualizaciones en tiempo real.
- Útil para parsear categorías de ofertas automáticamente.

---

## 3. Guía de Integración Técnica

### A. Backend (Node.js con Adzuna)

```javascript
const axios = require('axios');

async function getLuxJobs() {
  const APP_ID = 'TU_APP_ID';
  const APP_KEY = 'TU_APP_KEY';
  const url = `https://api.adzuna.com/v1/api/jobs/lu/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=10`;
  
  const response = await axios.get(url);
  return response.data.results;
}
```

### B. Sincronización con Base de Datos

**Esquema Sugerido:**
- `external_id` (UNIQUE) - ID de la fuente externa
- `title` - Título del puesto
- `company` - Empresa
- `location` - Ubicación
- `url` - Enlace a la oferta original
- `source` - Fuente (Adzuna, ADEM, etc.)
- `created_at` - Fecha de inserción

**Tarea Programada (Cron):**
Ejecutar cada 6-12 horas para:
1. Llamar a la API
2. Verificar si `external_id` ya existe
3. Insertar solo ofertas nuevas

---

## 4. Recomendación para Welux Events

| Prioridad | Fuente | Razón |
| :--- | :--- | :--- |
| 1 | **Adzuna** | Mayor cobertura de Luxemburgo, datos de salarios |
| 2 | **ADEM Open Data** | Datos oficiales del gobierno |
| 3 | **Careerjet** | Backup si Adzuna falla |

---

## 5. Claves API Requeridas

Para activar estas fuentes, necesitas registrarte en:
- **Adzuna:** [developer.adzuna.com](https://developer.adzuna.com/) → Obtener `APP_ID` y `APP_KEY`
- **Careerjet:** [careerjet.com/partners](https://www.careerjet.com/partners/api/) → Solicitar acceso como Publisher

---

*Documento de referencia para el proyecto Welux Events Job Aggregator.*
