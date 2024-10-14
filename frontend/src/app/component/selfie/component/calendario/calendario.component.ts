import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})
export class CalendarioComponent implements OnInit {
    constructor(private apiService: ApiService){}

    ngOnInit(): void {
        this.getDataFromApi();
    }

    getDataFromApi(){
        this.apiService.getEvents().subscribe({
            next: (response) => {
                console.log(response);
            },
            error: (error) => {
                console.error('Errore nella chiamata API:', error);
            }
        });
    }

}
