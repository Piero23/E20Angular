// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Uniamo i provider esistenti (se presenti) con HttpClientModule
const mergedConfig = {
  ...appConfig,
  providers: [
    ...(appConfig?.providers ?? []),
    importProvidersFrom(HttpClientModule) // <-- fornisce HttpClient per i standalone components
  ]
};

bootstrapApplication(App, mergedConfig)
  .catch((err) => console.error(err));
