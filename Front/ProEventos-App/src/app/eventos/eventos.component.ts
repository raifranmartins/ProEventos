import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  public eventos : any = []

  constructor(private http : HttpClient) { }

  ngOnInit() {
    this.getEventos();
  }

  public getEventos() {
    this.http.get(`https://localhost:7055/api/Eventos`)
    .subscribe({
      next : (response) => {this.eventos = response},
      error : (e) => console.error(e)
    }
    )
  }

}
