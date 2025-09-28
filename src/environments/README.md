# Configuración de Environments

## Archivos de Environment

- `environment.ts` - Configuración para desarrollo (se incluye en el repo)
- `environment.prod.ts` - Configuración para producción (se incluye en el repo)
- `environment.local.ts` - Configuración local del desarrollador (NO se incluye en el repo)
- `environment.staging.ts` - Configuración para staging (NO se incluye en el repo)

## Variables de Environment

### Ejemplo de environment.local.ts (crear si es necesario):

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7001/api', // Tu URL local específica
  apiKey: 'tu-api-key-local',
  appName: 'Frontend App - Local',
  version: '1.0.0-dev'
};
```

### Configuración en angular.json

Asegúrate de agregar la configuración local en `angular.json` si necesitas un environment específico:

```json
"configurations": {
  "local": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.local.ts"
      }
    ]
  }
}
```

## Seguridad

⚠️ **IMPORTANTE**: 
- Nunca subas API keys reales al repositorio
- Usa variables de environment para configuración sensible
- Los archivos `.local.ts` y `.staging.ts` están en `.gitignore`