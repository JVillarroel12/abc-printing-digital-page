import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AlertsService } from '../services/alerts.service';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  constructor(
    public apiService: ApiService,
    public authService: AuthService,
    public alertService: AlertsService,
    public router: Router,
    public navController: NavController
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): import('rxjs').Observable<import('@angular/common/http').HttpEvent<any>> {
    const headers = new HttpHeaders({
      //user: this.authService.user.user.username,
      //user: 'jaimev',
      token: this.authService.user.token,
      //token: 'newToken'
    });

    const reqClone = req.clone({ headers, responseType: 'json' });

    return next.handle(reqClone).pipe(
      tap(
        (httpEvent: HttpEvent<any>) => {
          if (httpEvent instanceof HttpResponse) {
            //this.servAuth.resetSessionDurationWatcher();

            if (httpEvent.headers.has('token')) {
              this.authService.user.token =
                httpEvent.headers.get('token') || '';
            }

            // if (httpEvent.headers.has('version')) {
            //   this.authService.user.versions.api = httpEvent.headers.get('version') || '';
            // }
          }
        },
        (error: any) => {
          console.log('error =>', error);

          if (error.status === 0) {
            //this.servAuth.serverNotFound();
            this.alertService.modalError(
              'Ha ocurrido un error',
              'Error de conexion'
            );
            return;
          }
          // if(error.error.message){
          //   const e: {
          //     error: Boolean;
          //     message: String;
          //     code: String;
          //   } = JSON.parse(error.error.message);

          //   this.alertService.modalError(
          //     'Ha ocurrido un error',
          //     e.message.toString(),
          //   )
          //   return;
          // }

          switch (error.error.message) {
            case ' Unauthorized, El token es obligatorio':
              this.alertService.modalError(
                'Ha ocurrido un error',
                error.error.message
              );
              this.router.navigate(['/login']);
              break;
            case ' Unauthorized, TOKEN INVALIDO O EXPIRADO, VUELVA A INICIAR SESION Y ACTUALICE EL TOKEN':
              this.alertService.modalError(
                'Ha ocurrido un error',
                error.error.message
              );
              this.router.navigate(['/login']);
              break;

            default:
              this.alertService.modalError(
                'Ha ocurrido un error',
                error.error.message
              );
              break;
          }
        }
      )
      //catchError(this.interceptError)
    );
  }
}
