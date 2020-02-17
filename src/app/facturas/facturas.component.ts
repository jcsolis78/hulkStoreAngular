import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../clientes/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map,  flatMap} from 'rxjs/operators';
import { FacturaService } from './service/factura.service';
import { Producto } from './models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { ItemFactura } from './models/item-factura';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit {


  titulo: string = "Nueva Factura";
  factura: Factura = new Factura();
  autocompleteControl = new FormControl();
  productosFiltrados: Observable<Producto[]>;  
  cantidadProducto: number; 

  constructor(private clienteService: ClienteService,
    private facturaService: FacturaService,
    private router: Router,
    private activateRouter: ActivatedRoute) { }

  ngOnInit() {
    this.activateRouter.paramMap.subscribe(params => {
      let clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
    });

    this.productosFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string' ? value: value.nombre),
        flatMap(value => value ? this._filter(value): [])
      );    
  }




  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(value);
  }  


  mostrarNombre(producto?:Producto): string | undefined {
    return producto ? producto.nombre: undefined;
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent):void{
    let producto = event.option.value as Producto;
    console.log(producto);
    
    if(this.existeItem(producto.id)){
      this.incrementarCantidad(producto.id);
    }else{
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);  
    }

    this.cantidadProducto = producto.cantidad; 


    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }


  actualizarCantidad(id: number, event: any): void{
    let cantidad:number = event.target.value as number;

    console.log(cantidad); 
    console.log(this.cantidadProducto); 

    if(cantidad > this.cantidadProducto){
      Swal.fire(this.titulo, `La cantidad seleccionada supera a la cantidad disponible!`,'error');
      cantidad = this.cantidadProducto;             
    }

    if(cantidad == 0){
      return this.eliminarItemFactura(id);
    }

    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if(id === item.producto.id){        
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  existeItem(id: number):boolean{
    let existe = false;

    this.factura.items.forEach((item: ItemFactura) => {
      if(id === item.producto.id){
        existe = true;
      }
    });
    return existe; 
  } 


  incrementarCantidad(id: number): void{
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if(id === item.producto.id){
        ++item.cantidad;
      }
      /*console.log("Cantidad " + item.cantidad);
      console.log("Disponible " + this.cantidadProducto);
      if (item.cantidad > this.cantidadProducto){
        Swal.fire(this.titulo, `No existen productos disponibles`,'success');
        return null; 
      }*/
      return item;
    });
  }
 

  eliminarItemFactura(id: number): void{
    this.factura.items = this.factura.items.filter((item: ItemFactura) => id !== item.producto.id);
  }


  crearFactura(facturaForm): void{

    if(this.factura.items.length == 0){
      this.autocompleteControl.setErrors({'invalid': true});
    }

    if(facturaForm.form.valid && this.factura.items.length > 0){
      this.facturaService.crear(this.factura).subscribe(factura => {
        Swal.fire(this.titulo, `Factura ${factura.descripcion} creada con exito!`,'success');
        this.router.navigate(['/facturas', factura.id]);
      });
   }
  }

}
