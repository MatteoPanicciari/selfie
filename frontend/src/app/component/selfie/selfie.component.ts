import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { CalendarioComponent } from './component/calendario/calendario.component';
import { AuthService } from '../../auth/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-selfie',
  standalone: true,
  imports: [RouterOutlet, CalendarioComponent, HomeComponent],
  templateUrl: './selfie.component.html',
  styleUrl: './selfie.component.css'
})
export class SelfieComponent implements OnInit {
    constructor(private authService: AuthService, private router: Router, private apiService: ApiService){}
    logout() {
        this.authService.logout();
        this.router.navigate(['login']);        
    }
    ngOnInit(): void {
        // Controlla se la sessione è attiva quando il componente viene inizializzato
        this.apiService.checkSession().subscribe(
          (response) => {
            console.log('jaja')
          },
          (error) => {
            console.log('jeje')
            console.error('Errore nella verifica della sessione:', error);
          }
        );
      }
}
