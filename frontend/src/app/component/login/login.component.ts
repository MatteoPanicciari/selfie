import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'
import { ApiService } from '../../services/api.service';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    constructor(private apiService: ApiService, private authService : AuthService, private router: Router) {}

    loginForm = new FormGroup({ //DEBUG: da togliere i default
        username: new FormControl('matteo', Validators.required),
        password: new FormControl('12345678', [Validators.required, Validators.minLength(8), Validators.maxLength(16)])
    });
    
    onSubmit(): void {
        this.apiService.userLogin(this.loginForm.value.username!, this.loginForm.value.password!).subscribe({
            next: (response) => {
                if(response.success){
                    this.authService.login(response.user._id);
                    this.router.navigate(['']);
                }
            },
            error: (error) => {
                console.error('Errore nella chiamata API:', error);
            }
        });
    }

}
