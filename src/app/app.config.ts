import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  browserPopupRedirectResolver,
  browserSessionPersistence,
  connectAuthEmulator,
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
  provideAuth,
} from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore,
  provideFirestore,
} from '@angular/fire/firestore';
import {
  provideFunctions,
  getFunctions,
  connectFunctionsEmulator,
} from '@angular/fire/functions';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { providePerformance, getPerformance } from '@angular/fire/performance';
import {
  provideStorage,
  getStorage,
  connectStorageEmulator,
} from '@angular/fire/storage';

import { environment } from '../environments/environment';
import { AuthService } from './core/services/auth.service';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      const auth = getAuth();
      if (environment.useEmulators) {
        connectAuthEmulator(auth, 'http://localhost:9099', {
          disableWarnings: true,
        });
      }
      return auth;
    }),
    provideFirestore(() => {
      const firestore = initializeFirestore(getApp(), {
        experimentalForceLongPolling: environment.useEmulators ? true : false,
      });

      if (environment.useEmulators) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }

      return firestore;
    }),
    provideFunctions(() => {
      const functions = getFunctions();

      if (environment.useEmulators) {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      }

      return functions;
    }),
    provideMessaging(() => getMessaging()), // not using emulators for messages
    providePerformance(() => getPerformance()), // not using emulators for checking app performance
    provideStorage(() => {
      const storage = getStorage();

      if (environment.useEmulators) {
        connectStorageEmulator(storage, 'localhost', 9199);
      }

      return storage;
    }),
  ],
};
