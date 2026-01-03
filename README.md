# 🌟 HolyVerse - Interactive Biblical Universe

Un ecosistema digital que transforma cómo explorar las historias sagradas. No se trata solo de leer versículos, sino de **vivir el universo bíblico** con un toque de tecnología moderna, respeto profundo y cero sermones.

## 🎯 Características Principales

### ✨ Versículo del Día
- Nuevo versículo cada día con caché local
- Disponible en Español e Inglés
- Compartir en redes sociales
- Guardar favoritos

### ⚡ Bible Bot - Guía Inteligente
- Responde preguntas sobre la Biblia
- Contextualiza versículos según tu estado de ánimo
- Explica conexiones entre pasajes
- Base de conocimiento en ambos idiomas

### 🎭 Selector de Emociones
6 moods diferentes con versículos específicos:
- 🌅 Esperanzado/Hopeful
- 🌪️ Ansioso/Anxious
- 🌧️ Dolido/Grieving
- ✨ Alegre/Joyful
- 🌀 Confundido/Confused
- 🌿 Tranquilo/Peaceful

### 🎨 Diseño Moderno
- **CSS Grid System** para layouts responsivos
- Gradientes y animaciones suaves
- Modo oscuro nativo
- Interfaz minimalista pero memorable
- Totalmente responsive

### 🌍 Multiidioma
- Español e Inglés
- Sistema i18n completo
- Persiste preferencia en localStorage

## 🚀 Estructura del Proyecto

```
holy_verse/
├── index.html              # HTML principal
├── css/
│   ├── styles.css         # Estilos globales
│   ├── grid.css           # Sistema de grillas CSS
│   └── bot.css            # Estilos del Bible Bot
├── js/
│   ├── i18n.js            # Sistema de idiomas
│   ├── api.js             # Integración con APIs
│   ├── bot.js             # Lógica del Bible Bot
│   └── main.js            # Aplicación principal
├── data/                   # Datos futuros (mapas, líneas de tiempo)
└── assets/
    ├── images/            # Imágenes
    └── icons/             # Iconos SVG
```

## 🛠️ Instalación y Uso

### Opción 1: Abrirlo localmente
1. Clona o descarga el proyecto
2. Abre `index.html` en tu navegador
3. ¡Listo! Funciona offline

### Opción 2: Servir con un servidor local
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (http-server)
npx http-server

# Con PHP
php -S localhost:8000
```

Luego abre `http://localhost:8000`

## 🔌 Integración con APIs Reales

### Para usar una Bible API real:

1. **Opción A: Scripture.api.bible**
   - Ve a https://api.scripture.api.bible/
   - Obtén una API key gratuita
   - Reemplaza `YOUR_API_KEY_HERE` en `js/api.js`

2. **Opción B: BibleBase API**
   - Usa endpoint público de BibleBase
   - Modifica `API.BIBLE_API_URL` en `js/api.js`

### Ejemplo de integración:
```javascript
// En api.js, dentro de getRandomVerse()
const response = await fetch(`${this.BIBLE_API_URL}?key=${this.BIBLE_API_KEY}`);
const data = await response.json();
// Procesar respuesta
```

## 🎨 Sistema de Colores

```css
--primary: #1a1a2e      /* Azul oscuro principal */
--secondary: #16213e    /* Azul más oscuro */
--accent: #0f3460       /* Azul profundo */
--highlight: #e94560    /* Rosa/Rojo para acciones */
--gold: #d4af37         /* Dorado para acentos */
```

## 🚀 Funcionalidades Futuras

- [ ] Mapas interactivos de Tierra Santa
- [ ] Línea de tiempo completa de la Biblia
- [ ] Galería de personajes bíblicos
- [ ] Conexiones entre libros (grafo interactivo)
- [ ] Búsqueda avanzada de versículos
- [ ] Historial de lecturas personales
- [ ] Comentarios de expertos
- [ ] PWA (Progressive Web App)
- [ ] Sincronización en la nube
- [ ] Notas personales y resaltados

## 🎮 Cómo Expandir

### Agregar nuevos versículos:
En `js/api.js`, expande el array `fallbackVerses`:
```javascript
{
    es: {
        text: 'Tu versículo aquí',
        reference: 'Libro Capítulo:Verso',
        book: 'Nombre del libro',
        chapter: 1,
        verse: 1
    },
    en: { /* mismo formato en inglés */ }
}
```

### Agregar temas al Bible Bot:
En `js/bot.js`, expande `knowledgeBase`:
```javascript
'tu-tema': 'Tu respuesta detallada aquí...',
```

### Crear nuevos selectoresmood:
En `index.html`, copia un `.mood-btn` y ajusta:
- `data-mood="nuevo-mood"`
- Emoji
- Texto i18n

Luego en `js/api.js`, agrega a `moodVerses`:
```javascript
'nuevo-mood': [0, 2, 5], // Índices de versículos
```

## 🛡️ Buenas Prácticas

- Los textos bíblicos están completamente verificados
- Respetar el contexto original de cada pasaje
- Las explicaciones son accesibles pero no simplistas
- No hay presión evangelística, solo educación

## 📱 Compatibilidad

- ✅ Chrome/Edge (último)
- ✅ Firefox (último)
- ✅ Safari (último)
- ✅ Mobile browsers
- ✅ Sin dependencias externas

## 📝 Licencia

Libre para usar, modificar y distribuir. Los textos bíblicos son de dominio público (Reina-Valera, KJV).

## 🤝 Contribuciones

Si quieres mejorar HolyVerse:
1. Agrega más versículos
2. Mejora las respuestas del Bot
3. Diseña nuevas secciones
4. Sugiere features

---

**HolyVerse** - Donde la tecnología sirve al significado ✦
