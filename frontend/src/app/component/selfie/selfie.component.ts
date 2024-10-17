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
        //DEBUG: controlli già fatti, forse rimuovibile ormai sennò siamo ridondanti
        // Controlla se la sessione è attiva quando il componente viene inizializzato
        this.apiService.checkSession().subscribe({
          next:(success) => {
            console.log('Sessione attiva : '+ success);
          },
          error: (error) => {
            console.log('Sessione non attiva : '+ error);
          }
        });
    }
}
