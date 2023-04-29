import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserRole } from '../constants/user-role';
import { HttpServerService } from './http-server.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router,
    private httpServer: HttpServerService,
    private message: NzMessageService,) { }

  public setToken(token: string) {
    if (!token) {
      this.removeToken();
      return;
    }

    const jwtHelper = new JwtHelperService()
    const decodedToken = jwtHelper.decodeToken(token);
    let userRole = this.GetUserRole(decodedToken);

    localStorage.setItem('token', token);
    localStorage.setItem('userRole', userRole);

    const expirationDate = jwtHelper.getTokenExpirationDate(token);
    const isExpired = jwtHelper.isTokenExpired(token);
  }

  public setInfoUser(data: any) {    
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('userFirstName', data.first_name);
    localStorage.setItem('userLastName', data.last_name);
  }

  public removeInfoUser() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
  }

  public getInfoUser(): any {
    return { email: localStorage.getItem('userEmail'), first_name: localStorage.getItem('userFirstName'), last_name: localStorage.getItem('userLastName') };
  }

  public removeToken() {
    localStorage.removeItem('token');
  }

  public removeUserRole() {
    localStorage.removeItem('userRole');
  }

  public getToken() {
    return localStorage.getItem('token');
  }

  public getUserRole() {
    return localStorage.getItem('userRole');
  }

  public isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  public logout() {
    this.removeToken();
    this.removeUserRole();
    this.removeInfoUser();
  }

  public login(username: string, password: string, backUrl: string): void {
    this.httpServer.Login(username, password).subscribe((data: any) => {
      if (data && data.status === true) {
        const token = data?.token;
        if (!!username && !!password && !!token) {
          this.setToken(token);
          this.setInfoUser(data);
          this.router.navigate([backUrl]);
        }
        this.message.success('Đăng nhập thành công!');
      } else {
        this.message.error('Đăng nhập thất bại!');
        this.login(username, password, backUrl);
      }
    },
      erorr => {
        this.message.error('Đăng nhập thất bại!');
      });
  }

  private GetUserRole(decodedToken: any): string {
    if (!decodedToken) {
      return '';
    }
    if (decodedToken.is_administrator) {
      return UserRole.ADMIN_ROLE;
    }
    else if (decodedToken.is_moderator) {
      return UserRole.MOD_ROLE;
    }
    return UserRole.USER_ROLE;
  }
}
