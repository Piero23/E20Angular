import {Injectable} from '@angular/core';
import {AuthConfig, OAuthService} from 'angular-oauth2-oidc';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';


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

export interface UtenteRegistrationDTO {
  username: string;
  password: string;
  email: string;
  dataNascita: string; // e.g., '1990-01-01'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = '/auth'
  constructor(private oauthService: OAuthService, private http: HttpClient) {
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
    this.oauthService.logOut();
    this._userProfile = null;
    window.location.reload();
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

  register(user: UtenteRegistrationDTO): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, user, { responseType: 'text' });
  }
}
