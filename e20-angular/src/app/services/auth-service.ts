import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';


/*
 * LEGGI: creare environment con ng generate environments
 *
 * inserire l'URL dell'issuer sia in environment.ts che in environment.development.ts
 *
 */

export const authConfig: AuthConfig = {

  issuer: environment.issuer, // LEGGI SOPRA
  redirectUri: window.location.origin + '/login/oauth2/code/angular-client',
  responseType: 'code', // PKCE code flow
  scope: 'openid profile',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false
};



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userProfile: any = null;
  constructor(private oauthService: OAuthService) {
    // Configura OAuth
    this.oauthService.configure(authConfig);

    // Carica metadata OIDC e prova login automatico
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        this.loadUserProfile(); // carica info utente al login
      }
    });
  }

  /** Avvia il login */
  login() {
    this.oauthService.initCodeFlow();
  }

  /** Logout */
  logout() {
    this.oauthService.logOut();
    this._userProfile = null;
  }

  /** Access Token JWT */
  get token(): string | null {
    return this.oauthService.getAccessToken();
  }

  /** Ritorna true se l’utente è autenticato */
  get isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  /** Carica il profilo utente da ID Token */
  async loadUserProfile(): Promise<void> {
    const claims = this.oauthService.getIdentityClaims();
    if (claims) {
      this._userProfile = claims;
    }
  }

  /** Accesso pubblico al profilo utente */
  get userProfile(): any {
    return this._userProfile;
  }
}
