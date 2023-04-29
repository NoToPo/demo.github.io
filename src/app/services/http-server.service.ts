import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Urlserver } from '../constants/urlserver';
import { AuthResponseData } from '../interfaces/auth-response-data';

@Injectable({
  providedIn: 'root'
})
export class HttpServerService {
  pipe = new DatePipe('en-US');

  constructor(private httpClient: HttpClient) { }

  /* User API */
  public Login(email: string, password: string): Observable<AuthResponseData> {
    let postData = {
      "email": email,
      "password": password
    };

    let jsonRequestData = JSON.stringify(postData);
    return this.httpClient.post<AuthResponseData>(Urlserver.URL_LOGIN, jsonRequestData);
  }

  public signUp(email: string, password: string, firstname: string, lastname: string, dob: string): Observable<any> {
    const dobFormatted = this.pipe.transform(dob, 'dd/MM/yyyy');

    let postData = {
      "email": email,
      "password": password,
      "first_name": firstname,
      "last_name": lastname,
      "dob": dobFormatted
    };

    let jsonRequestData = JSON.stringify(postData);
    return this.httpClient.post<any>(Urlserver.URL_SIGNUP, jsonRequestData);
  }

  public changePassword(email: string, oldpassword: string, newpassword: string, renewpassword: string): Observable<any> {
    let postData = {
      "email": email,
      "old_password": oldpassword,
      "new_password": newpassword,
      "re_new_password": renewpassword
    };
    let jsonRequestData = JSON.stringify(postData);
    return this.httpClient.post<any>(Urlserver.URL_CHANGE_PASSWORD, jsonRequestData);
  }

  public getImage(path: string): string {
    return `${Urlserver.URL_GET_IMAGE}${path}`;
  }

  public getFurnitureList(): Observable<any> {
    return this.httpClient.get<any>(Urlserver.URL_GET_FURNITURE_LIST);
  }

  public getStatusList(): Observable<any> {
    return this.httpClient.get<any>(Urlserver.URL_GET_STATUS_LIST);
  }

  public sortSearchData(data: any): Observable<any> {
    return this.httpClient.get<any>(Urlserver.getSortSearchData(data));
  }

  public getNameProject(): Observable<any> {
    return this.httpClient.get<any>(Urlserver.URL_GET_NAME_PROJECT);
  }

  public getTypeProject(): Observable<any> {
    return this.httpClient.get<any>(Urlserver.URL_GET_TYPE_PROJECT);
  }

  public getDataProperties(page: number = 1, pageLimit: number = 10, orderBy: string | null): Observable<any> {
    if (orderBy === null) {
      orderBy = "DESC";
    }
    return this.httpClient.get<any>(Urlserver.getDataProperties(page, pageLimit, orderBy));
  }

  public viewPhoneNumber(idNameProject: string, idData: string): Observable<any> {
    return this.httpClient.get<any>(Urlserver.viewPhoneNumber(idNameProject, idData));
  }

  public insertNote(idDataProperties: number, note: string): Observable<any> {
    let postData = {
      "id_data_properties": idDataProperties,
      "Note": note
    };
    let jsonRequestData = JSON.stringify(postData);
    return this.httpClient.post<any>(Urlserver.URL_INSERT_NOTE, jsonRequestData);
  }

  public uploadImage(formData: FormData): Observable<any> {
    return this.httpClient.post<any>(Urlserver.URL_UPLOAD_IMAGE, formData);
  }

  /* Mod API */
  public createDataProperties(formData: FormData): Observable<any> {
    return this.httpClient.post<any>(Urlserver.URL_CREATE_DATA_PROPERTIES, formData);
  }

  public updateDataProperties(formData: FormData): Observable<any> {
    return this.httpClient.post<any>(Urlserver.URL_UPDATE_DATA_PROPERTIES, formData);
  }

  public getModDataProperties(page: number = 1, pageLimit: number = 10, orderBy: string | null): Observable<any> {
    if (orderBy === null) {
      orderBy = "DESC";
    }
    return this.httpClient.get<any>(Urlserver.getModDataProperties(page, pageLimit, orderBy));
  }

  /* Admin API */
  public createTypeProject(type: string, note: string): Observable<any> {
    let postData = {
      "type": type,
      "note": note
    };
    let jsonRequestData = JSON.stringify(postData);
    return this.httpClient.post<any>(Urlserver.URL_CREATE_TYPE_PROJECT, jsonRequestData);
  }

  public updateTypeProject(type: string, note: string, active: string, idTypeProject: string): Observable<any> {
    let postData = {
      "type": type,
      "note": note,
      "active": active,
      "id_type_project": idTypeProject
    };
    let jsonRequestData = JSON.stringify(postData);
    return this.httpClient.post<any>(Urlserver.URL_UPDATE_TYPE_PROJECT, jsonRequestData);
  }

  public getAdminTypeProject(): Observable<any> {
    return this.httpClient.get<any>(Urlserver.URL_GET_ADMIN_TYPE_PROJECT);
  }

  public createNameProject(nameProject: string, note: string, idTypeProject: string): Observable<any> {
    let postData = {
      "name_project": nameProject,
      "note": note,
      "id_type_project": idTypeProject
    };
    let jsonRequestData = JSON.stringify(postData);
    return this.httpClient.post<any>(Urlserver.URL_CREATE_NAME_PROJECT, jsonRequestData);
  }

  public updateNameProject(idNameProject: string, nameProject: string, note: string, idTypeProject: string, active: string): Observable<any> {
    let postData = {
      "id_name_project": idNameProject,
      "name_project": nameProject,
      "note": note,
      "id_type_project": idTypeProject,
      "active": active
    };
    let jsonRequestData = JSON.stringify(postData);
    return this.httpClient.post<any>(Urlserver.URL_UPDATE_NAME_PROJECT, jsonRequestData);
  }

  public getAdminNameProject(): Observable<any> {
    return this.httpClient.get<any>(Urlserver.URL_GET_ADMIN_NAME_PROJECT);
  }

  public setStatus(idDataProperties: number, status: string): Observable<any> {
    let postData = {
      "id_data_properties": idDataProperties,
      "id_status": status
    };
    let jsonRequestData = JSON.stringify(postData);
    return this.httpClient.post<any>(Urlserver.URL_SET_STATUS, jsonRequestData);
  }
}
