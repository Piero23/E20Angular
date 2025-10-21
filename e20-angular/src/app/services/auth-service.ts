import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';


/*
 * LEGGI: creare environment con `ng generate environments`
 *
 * inserire l'URL dell'issuer sia in environment.ts che in environment.development.ts
 * `issuer: https://...`
 *
 */

export const authConfig: AuthConfig = {

  issuer: environment.issuer, // LEGGI SOPRA
  clientId: 'angular-client',
  redirectUri: window.location.origin + '/login/oauth2/code/angular-client',
  postLogoutRedirectUri: window.location.origin,
  responseType: 'code',
  scope: 'openid profile',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false
};


@Injectable({
  providedIn: 'root'
})
export class AuthService {
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

  private _userProfile: any = null;

  /** Accesso pubblico al profilo utente */
  get userProfile(): any {
    return this._userProfile;
  }

  /** Access Token JWT */
  get token(): string | null {
    return this.oauthService.getAccessToken();
  }

  /** Ritorna true se l’utente è autenticato */
  get isLoggedIn(): boolean {
    return this.getUser()?.roles;
  }

  /** Avvia il login */
  login() {
    this.oauthService.initCodeFlow();
  }

  /** Logout */
  logout() {
    sessionStorage.clear();
    /*this.oauthService.logOut();*/
    this._userProfile = null;
  }

  /** Carica il profilo utente da ID Token */
  async loadUserProfile(): Promise<void> {
    const claims = this.oauthService.getIdentityClaims();
    if (claims) {
      this._userProfile = claims;
    }
  }

  getUser() {
    const token = this.oauthService.getAccessToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1])); // decodifica manuale
    const roles = payload.roles || payload['roles']?.roles || [];

    return {
      username: payload.sub,
      roles: roles
    };
  }

  getUserId(): string | null {
    return this._userProfile?.id ?? null;
  }
}
