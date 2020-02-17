import { Component, OnInit, Input } from '@angular/core';
import {Cliente} from '../cliente';
import {ClienteService} from '../cliente.service';
//import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import { FacturaService } from 'src/app/facturas/service/factura.service';
import { Factura } from 'src/app/facturas/models/factura';
import Swal from 'sweetalert2';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  titulo: string = "Detalle Cliente";
  fotoSeleccionada: File;
  progreso: number = 0;

  constructor(private clienteService: ClienteService, 
    private facturaService: FacturaService,
    public authService: AuthService,
    public modalService: ModalService
    ) { }

  ngOnInit() { // Se elimina por que no es necesario ya que se recibe el id del cliente cohn el decorador Input
    /*this.activateRoute.paramMap.subscribe(params => {
      let id:number = +params.get('id');
      if (id){
        this.clienteService.getCliente(id).subscribe(cliente => {
          this.cliente = cliente;
        }); 
      }
    });*/
  }

  seleccionarFoto(event){
  /*  this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      swal.fire('Error al seleccionar imagen: ','El archivo debe ser una imagen.','error');
      this.fotoSeleccionada = null;
    }*/

  }

  subirFoto(){
  /*  if(!this.fotoSeleccionada){
      swal.fire('Error al subir archivo: ','Debe seleccionar una foto.','error');
    }else{
    this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id )
      .subscribe(event => {

        if(event.type === HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded/event.total)*100);
        }else if(event.type === HttpEventType.Response){
          let response:any = event.body;
          this.cliente = response.cliente as Cliente; 
          //swal.fire('La foto se ha subido completamente!',`La foto ha subido con exíto: ${this.cliente.foto}`,'success');
          this.modalService.notificarCarga.emit(this.cliente);
          swal.fire('La foto se ha subido completamente!',response.mensaje,'success');
        }

        //this.cliente = cliente;
        
      });
    }*/
  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }


  delete(factura: Factura): void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    })
    /**/
    swalWithBootstrapButtons.fire({
      title: 'Esta seguro?',
      text: `¿Seguro que desea eliminar la factura ${factura.descripcion}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.facturaService.delete(factura.id)
          .subscribe(
            response => {
              this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura)
              swalWithBootstrapButtons.fire(
                'Factura eliminada',
                `Factura ${factura.descripcion} ha sido eliminada satisfactoriamente.`,
                'success'
              )
            }
          )
      }
    })
  }

}
