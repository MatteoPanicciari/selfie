import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    private urlServer = 'http://localhost:3000/api';  // URL base dell'API
  
    constructor(private http: HttpClient) {}
  
    // Metodo per fare una GET all'API
    getEvents(): Observable<any> {
        return this.http.get(`${this.urlServer}/events/user/66b8e9856efc670a1cc7d098/912f7a5e2c1bfd3495564238cb1e81cf`);
    }

    userLogin(username: string, password: string): Observable<any> {
        const cryptedPwd = CryptoJS.MD5(password+'prova').toString();
        const body = { username, password: cryptedPwd };

        return this.http.post(`${this.urlServer}/auth/login`, body, {withCredentials: true});
    }

    // Metodo per controllare se la sessione è ancora attiva
    checkSession(): Observable<any> {
        return this.http.get(`${this.urlServer}/auth/profile`, { withCredentials: true }); // `withCredentials` include il cookie di sessione
    }
}