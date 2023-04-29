import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { catchError, delay, mergeMap, Observable, of, retryWhen, throwError } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from '../services/auth.service';
import { Urlserver } from '../constants/urlserver';

export const maxRetries = 2;
export const delayMs = 2000;

@Injectable()
export class Interceptor implements HttpInterceptor {

  constructor(public authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.makeRequest(request)).pipe(
      retryWhen((error) => {        
        return error.pipe(
          mergeMap((error, index) => {
            if (index < maxRetries && error.status == 500) {
              return of(error).pipe(delay(delayMs));
            }
            return throwError(error);
          })
        )
      })
    )
  }

  private makeRequest(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.authService.getToken();

    if (token) {
      if (request.url === Urlserver.URL_UPLOAD_IMAGE ||
        request.url === Urlserver.URL_CREATE_DATA_PROPERTIES ||
        request.url === Urlserver.URL_UPDATE_DATA_PROPERTIES) {
        const heardersUpload = new HttpHeaders()
          .set('enctype', 'multipart/form-data')
          .set('x-access-token', token);

        return request.clone({ headers: heardersUpload })
      }
      else {
        const heardersHasToken = new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('x-access-token', token);

        return request.clone({ headers: heardersHasToken })
      }
    }
    else {
      const heardersNotToken = new HttpHeaders().set('Content-Type', 'application/json');
      return request.clone({ headers: heardersNotToken });;
    }
  }
}
