// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://localhost:7101/api', // Cambia esta URL por la de tu API .NET Core
  apiKey: 'd3c1f9a0-7b34-4c1a-9a3b-91b0c1e6e7a8', // Tu API Key
  appName: 'Grimat Labs',
  version: '1.0.0',
  // Configuraciones específicas para desarrollo
  enableDebugMode: true,
  tokenExpirationBuffer: 300000, // 5 minutos en ms
  autoRefreshToken: true,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
