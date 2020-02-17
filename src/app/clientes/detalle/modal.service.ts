import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal: boolean = false;

  private _notificarCarga = new EventEmitter<any>();

  constructor() { }

  get notificarCarga():  EventEmitter<any>{
    return this._notificarCarga;
  }
  
  abrirModal(){
    this.modal = true;
  }

  cerrarModal(){
    this.modal = false;
  }
}
