# NimbleGravity-VictorGandarillas

Challenge técnico de Nimble Gravity implementado con React + Vite.

## Estado actual

- Step 2: obtención de candidato por email
- Step 3: obtención de lista de posiciones
- Step 4: listado de posiciones con input de repo URL y botón submit por posición
- Step 5: envío de postulación con manejo de estados de carga y error

## Cómo ejecutar

```bash
cp .env.example .env
npm install
npm run dev
```

## Flujo de uso

1. Ingresar email y presionar **Cargar datos**.
2. Verificar que aparezcan datos del candidato y posiciones.
3. Completar URL del repositorio GitHub en la posición elegida.
4. Presionar **Submit** para enviar postulación.

## Configuración de entorno

La aplicación usa estas variables en `.env`:

- `BASE_URL`: URL base de la API.
- `DEBUG_API`: `true` o `false` para activar/desactivar logs de requests y responses en consola del navegador.