import { Component, OnInit } from '@angular/core'
import { Cliente } from './cliente'
import { ClienteService } from './cliente.service'
import { Router, ActivatedRoute } from '@angular/router'
import swal from 'sweetalert2'
import { Region } from './Region';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  regiones: Region[];
  titulo: string = "Crear Cliente";
  errores: string[];


  constructor(private clienteService: ClienteService,
    private router: Router,
    private activateRoute : ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
  }

  cargarCliente(): void{
    this.activateRoute.params.subscribe(
      params => {
        let id = params['id']
        if(id){
          this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)
        }
      }
    )
  }

  public create(): void {
    console.log(this.cliente);
    this.clienteService.create(this.cliente)
    .subscribe(cliente => {
        this.router.navigate(['/clientes'])        
        swal.fire('Nuevo Cliente',`Cliente ${cliente.nombre + ' ' + cliente.apellido} ha sido creado satisfactoriamente!`,'success')
      } ,
      err => {
        this.errores = err.error.errors as string[];
        console.error('Codigo de error desde el backend: '+err.status);
        console.error(err.error.errors);
      }
    )
  }

update(): void{
  console.log(this.cliente);
  this.cliente.facturas = null;
  this.clienteService.update(this.cliente)
  .subscribe(
    cliente => {
      this.router.navigate(['/clientes'])
      swal.fire('Cliente Actualizado',`Cliente ${cliente.nombre + ' ' + cliente.apellido} ha sido actualizado satisfactoriamente!`,'success')
    },
    err => {
      this.errores = err.error.errors as string[];
      console.error('Codigo de error desde el backend: '+err.status);
      console.error(err.error.errors);
    }
  )
}

compararRegion(o1: Region, o2: Region): boolean{
  return o1 == null || o2 == null ? false : o1.id === o2.id; 
}

}
