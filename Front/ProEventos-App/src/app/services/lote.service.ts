import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lote } from '@app/models/Lote';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoteService {

  baseUrl = 'https://localhost:7055/api/Lotes';

  constructor(private http : HttpClient) { }
  
    public getLotesByEventoId(eventoId : number): Observable<Lote>{
      return this.http
        .get<Lote>(`${this.baseUrl}/${eventoId}`)
        .pipe(take(1));
    }
  
  
    public saveLote(eventoId : number, lotes : Lote[]): Observable<Lote[]>{
      return this.http
        .put<Lote[]>(`${this.baseUrl}/${eventoId}`, lotes)
        .pipe(take(1));;
    }
  
    public deleteLote(eventoId: number, loteId : number): Observable<any>{
      return this.http
        .delete(`${this.baseUrl}/${eventoId}/${loteId}`)
        .pipe(take(1));;
    }

}
