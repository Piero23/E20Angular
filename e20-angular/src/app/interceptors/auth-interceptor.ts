import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // @ts-ignore
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // TOKEN BEARER HERE
    const token = "";
  }
}
