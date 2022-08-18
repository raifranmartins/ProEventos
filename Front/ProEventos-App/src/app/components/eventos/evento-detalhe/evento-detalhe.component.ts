import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PerfilComponent } from '@app/components/user/perfil/perfil.component';

import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';
import { EventoService } from '@app/services/evento.service';
import { LoteService } from '@app/services/lote.service';
import { formatDate } from 'ngx-bootstrap/chronos';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {
  
  bsValue = new Date();
  public form: FormGroup = new FormGroup({});
  public evento = {} as Evento; 
  estadoSalvar: any = 'post';

  public eventoId: number = 0;
  public modalRef?: BsModalRef;

  public loteAtual = {id: 0, nome : '', indice: 0};
  


  public get f() : any {
    return this.form.controls;
  }

  public get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

  public get modoEditar(): boolean {
    return this.estadoSalvar === 'put'
  }

  constructor(private fb : FormBuilder, 
    private localeService: BsLocaleService, 
    private activatedRouter : ActivatedRoute, 
    private eventoService : EventoService,
    private loteService : LoteService,
    private spinner : NgxSpinnerService,
    private toastr : ToastrService,
    private router: Router,
    private modalService : BsModalService
    ) {this.localeService.use('pt-br') }

  ngOnInit() : void {
    
    this.carregarEvento();
    this.validation();
     
  }

  carregarEvento() {
    this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id')!;

    if(this.eventoId !== null && this.eventoId !== 0){
      this.estadoSalvar = 'put'
      this.spinner.show();
      this.eventoService.getEventoById(this.eventoId)
      .subscribe({
        next: (_evento: any) => {          
          this.evento = {..._evento};
          this.form.patchValue(this.evento);          
          this.evento.lotes.forEach(lote => {
            //lote.datainicio = formatDate(new Date(lote.dataFim), 'yyyy-MM-dd', 'en');
            this.lotes.push(this.criarLote(lote));
          })
        },
        error: () => {
          console.log(console.error);
          this.spinner.hide();
          this.toastr.error('Error ao tentar carregar evento...', 'Error')
        },       
        complete: () => {
          this.spinner.hide();
        }
      })
    }
  }

  public cssValidator(campoForm: FormControl | AbstractControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }


  public validation() : void{
      this.form = this.fb.group({
        local: ['', [Validators.required]],
        dataEvento: ['', Validators.required],
        tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
        imageUrl: ['', Validators.required],
        telefone: ['', Validators.required],
        email : ['', [Validators.required, Validators.email]],
        lotes : this.fb.array([])

      })
  }

  adicionarLote(){
    this.lotes.push(this.criarLote({id : 0} as Lote));
  }

  criarLote(lote: Lote) : FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      preco: [lote.preco, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim]
    })
  }

  public resetForm() : void{
    this.form.reset();
  }

  public salvarEvento() : void {    
    if(this.form.valid){
      this.spinner.show();
      if(this.estadoSalvar === 'post'){
        this.evento = {...this.form.value}
        this.addEvento();
      }else{
        this.evento = {id: this.evento.id, ...this.form.value}
        this.editEvento();
      };
    }
  }


  addEvento() : void {    
    this.eventoService.post(this.evento).subscribe({
      next: (eventoRetorno: Evento) => {
        this.toastr.success('Evento adicionado com sucesso', 'Sucesso')
        this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`])
      },
      error: (error:any) =>{        
        this.toastr.error('Error ao cadastrar evento', 'Error')
      }
    }).add(() => this.spinner.hide());
  }


  editEvento() : void {    
    this.eventoService.put(this.evento).subscribe({
      next: (eventoRetorno: Evento) => {
        this.toastr.success('Evento adicionado com sucesso', 'Sucesso')
        this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`])
      },
      error: (error:any) =>{        
        this.toastr.error('Error ao editar evento', 'Error')
      }
    }).add(() => this.spinner.hide());
  }

  public salvarLotes() : void{
    this.spinner.show();    
   if(this.form.controls['lotes'].status){
        this.loteService.saveLote(this.eventoId, this.form.value.lotes)
        .subscribe({
          next : () =>{
            this.toastr.success('Lotes salvo com sucesso!!!', 'Sucesso!');
            //this.lotes.reset();

          },
          error: (error) => {
            this.toastr.error('Error ao tentar salvar lotes!!!', 'Erro!');
            console.log(error);
          }
        }).add(() => this.spinner.hide())
   }

  }

  removerLotes(template: TemplateRef<any>, indice : number) : void {

    this.loteAtual.id = this.lotes.get(indice + '.id')?.value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome')?.value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    
 
  }

  confirmarDeleteLote(): void {
    this.modalRef?.hide();
    this.spinner.show();
    this.loteService.deleteLote(this.eventoId, this.loteAtual.id)
    .subscribe({
      next: () => {                
        this.toastr.success('Lote deletado com sucesso !!!', 'Deletado');        
        this.lotes.removeAt(this.loteAtual.indice);
      },
      error: (error) => {        
        this.toastr.error(`Error ao tentar deletar o lote ${this.loteAtual.nome}`, 'Error');
        console.log(error);        
      }
    }).add(()=> this.spinner.hide())
    
  }

  declineDeleteLote(): void {
    this.modalRef?.hide();
  }

  retornaTituloLote(nome : string) : string{
    return nome == null || nome == ''
    ? 'Nome do lote'
    : nome
  }

}
