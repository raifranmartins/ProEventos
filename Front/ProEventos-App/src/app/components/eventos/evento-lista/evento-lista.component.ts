import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {

  public eventos : Evento[] = [];
  public eventosFiltrados : Evento[] = []
  public larguraImagem : any = 150;
  public margemImagem : any = 2;
  public exibirImagem : boolean = true;
  private _filtroLista : string = '';

  modalRef?: BsModalRef;
  message?: string;

  public get filtroLista() : string{
    return this._filtroLista;
  }

  public set filtroLista(value : string){
   this._filtroLista = value;
   this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos
  }

  public filtrarEventos(filtrarPor : string) : Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento:any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    )
  }


  constructor(private eventoService : EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router : Router
    ) { }

  public ngOnInit() {
    this.spinner.show();
    this.getEventos();
  }

  public getEventos() {
    this.eventoService.getEvento()
      .subscribe({
        next: (_eventos: Evento[]) => {
          this.eventos = _eventos;
          this.eventosFiltrados = this.eventos;
        },
        error: (e) => {
          this.spinner.hide();
          this.toastr.error('Error ao carregar eventos !', 'Error!');
          console.error(e)
        },
        complete: () => this.spinner.hide()
      }
      )
  }

  public alterarImagem(){
    this.exibirImagem = !this.exibirImagem;
  }

  openModal(template: TemplateRef<any>) : void {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.modalRef?.hide();
    this.showSuccess();
  }

  decline(): void {
    this.modalRef?.hide();
  }

  showSuccess() {
    this.toastr.success('Evento deletado com sucesso !', 'Deletado!');
  }

  detalheEvento(id : number){
    this.router.navigate([`eventos/detalhe/${id}`])
  }



}
