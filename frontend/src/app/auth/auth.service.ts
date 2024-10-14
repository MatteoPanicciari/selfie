import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    login(token: string) {
        localStorage.setItem('authToken', token);
    }

    getIsLoggedIn(): boolean {
        //Controllo se esiste un token di autenticazione nel localStorage
        return !!localStorage.getItem('authToken');
    }

    logout() {
        localStorage.removeItem('authToken');
    }
}
