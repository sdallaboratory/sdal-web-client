import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const httpReq = req.clone({
      url: `${environment.backendOrigin}${req.url}`,
    });

    console.log(httpReq.url, environment);


    return next.handle(httpReq);
  }

  constructor() { }
}
