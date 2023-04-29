import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      const currentToken = this.authService.getToken();
      const jwtHelper = new JwtHelperService();
      let isTokenExpired = jwtHelper.isTokenExpired(currentToken);      

      if (isTokenExpired) {
        this.authService.logout();
        this.router.navigate(['/login']);
        return false;
      }

      return true;
    }
    else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}
