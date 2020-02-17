import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { of,Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {HttpClient, HttpRequest, HttpEvent} from '@angular/common/http';
import { Router } from '@angular/router';

import { Region } from './Region';
import { URL_BACKEND } from '../config/config';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint:string =  URL_BACKEND + '/api/clientes';


  constructor(private http: HttpClient, private route: Router) { }

 

 

  getRegiones(): Observable<Region[]>{
    return null; //this.http.get<Region[]>(this.urlEndPoint + '/regiones');
  }

  //opcion con paginación
  getClientes(page: number): Observable<any> { 
    //return of(CLIENTES);
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response:any) =>{
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        });
      }),
      map((response: any) => {
        
         (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();          
          //cliente.createAt = formatDate(cliente.createAt,'EEEE dd, MMMM yyyy','es-CO');
          return cliente;
        });
        return response;      
      }),
      tap(response => {
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        });
      })

    );
  }

  create(cliente: Cliente) :  Observable<Cliente>{
    return this.http.post(this.urlEndPoint, cliente).pipe(
      map((response: any)  => response.cliente as Cliente),
      catchError( e=> {

        if(e.status == 400){
          return throwError(e);  
        }

        if (e.error.mensaje){
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError( e => {

        if(e.status != 401 && e.error.mensaje){
        this.route.navigate(['/clientes']);
        console.error(e.error.mensaje);
      }
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<Cliente>{
      return this.http.put(`${this.urlEndPoint}/${cliente.id}`,cliente).pipe(
        map((response: any) => response.cliente as Cliente),
        catchError( e=> {

          if(e.status == 400){
            return throwError(e);  
          }
          if (e.error.mensaje){
          console.error(e.error.mensaje);
        }
          return throwError(e);
        })        
      );
  }

  delete(id: number) : Observable<Cliente>{
    return this.http.delete(`${this.urlEndPoint}/${id}`).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError( e=> {


        if (e.error.mensaje){
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })      
    );
  }

  subirFoto(archivo: File, id ): Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);


    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`,formData, {
      reportProgress: true
    });


    return this.http.request(req);
  }

}
