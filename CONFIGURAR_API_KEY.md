# 🔐 Cómo Configurar Permanentemente tu API Key en HolyVerse

## Problema Actual
HolyVerse te pide la API key cada vez que recargas la página. Esto sucede porque:
- La API key se guarda en `localStorage`
- Pero no se está recuperando automáticamente en cada recarga

## ✅ Solución Definitiva

### Paso 1: Obtén tu API Key de Google
1. Ve a: **https://makersuite.google.com/app/apikey**
2. Inicia sesión con tu cuenta Google
3. Copia tu API key (empieza con `AIzaSy...`)

### Paso 2: Guarda tu API Key Permanentemente
1. **Abre esta página en tu navegador:**
   ```
   http://localhost:8000/save-api-key.html
   ```

2. **Pega tu API key** en el campo "Ingresa tu API Key"

3. **Haz click en "✅ Guardar Permanentemente"**

4. **Verifica** que aparezca el mensaje ✅ verde

5. **Haz click en "✨ Ir a HolyVerse con API configurada"**

### Paso 3: Verifica que Funciona
1. Abre **http://localhost:8000**
2. Haz click en el botón ⚡ del robot
3. **NO debería pedirte la API key más**
4. Escribe algo en el chat y verifica que el bot responde

## 🛡️ Protecciones Implementadas

Ahora HolyVerse tiene estas protecciones:

1. **Protección de localStorage**
   - La API key no puede ser borrada accidentalmente
   - Si un script intenta limpiar localStorage, la API key se restaura automáticamente

2. **Auto-carga en cada recarga**
   - Cuando cargas index.html, la API key se carga automáticamente
   - El modal de configuración NO aparece si ya hay API key guardada

3. **Validación de localStorage**
   - Se verifica que la API key exista antes de mostrar el modal
   - Se evita mostrar el modal múltiples veces

## ✨ Que Sucede Ahora

### Primera vez (Sin API key):
```
1. Cargas http://localhost:8000
2. Vés el modal pidiendo API key
3. La configuras (una sola vez)
4. Se guarda en localStorage con protección
```

### Siguientes veces (Con API key guardada):
```
1. Cargas http://localhost:8000
2. La API key se carga automáticamente desde localStorage
3. NO aparece el modal
4. El bot funciona directamente
5. Todo funciona sin que hagas nada
```

## 🔧 Si Aún No Funciona

Si después de seguir estos pasos aún te pide la API key, intenta:

1. **Abre DevTools** (F12)
2. **Ve a la pestaña "Console"**
3. **Escribe esto:**
   ```javascript
   localStorage.getItem('gemini_api_key')
   ```
4. Si ves tu API key (empieza con `AIzaSy...`), está guardada correctamente
5. Si ves `null`, vuelve a guardarla en `save-api-key.html`

## 📝 Notas

- Tu API key se guarda **localmente en tu navegador**
- No se envía a ningún servidor (es completamente local)
- Solo tú tienes acceso a ella
- Si borras el historial/cache del navegador, se borrará la API key
- En ese caso, vuelve a `save-api-key.html` y guárdala de nuevo
