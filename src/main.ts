import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import 'bootstrap';


(window as any).__zone_symbol__ignoreConsoleErrorUncaughtError = true;

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));  