import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent implements OnInit, OnChanges {

  @Input() paginador: any;

  paginas: number[];

  desde: number;
  hasta: number;

  rangoPaginas: number; 
  paginaInicial: number;

  constructor() {
    this.rangoPaginas = 5; 
    this.paginaInicial = 1; 
   }

  ngOnInit() {

  }

  ngOnChanges(){

    this.desde = Math.min(Math.max(this.paginaInicial, this.paginador.number - (this.rangoPaginas - this.paginaInicial)), this.paginador.totalPages - this.rangoPaginas);
    console.log('Desde '+this.desde);
    this.hasta = Math.max(Math.min(this.paginador.totalPages, this.paginador.number + (this.rangoPaginas - this.paginaInicial)), (this.rangoPaginas + this.paginaInicial))
    console.log('Hasta '+this.hasta);

    if (this.paginador.totalPages > this.rangoPaginas){
      this.paginas = new Array(this.hasta - this.desde + 1).fill(0).map((_valor,indice) => 
      indice + this.desde
    );
    }else{
      this.paginas = new Array(this.paginador.totalPages).fill(0).map((_valor,indice) => 
      indice + 1 
    );
    }
    

  }

}
