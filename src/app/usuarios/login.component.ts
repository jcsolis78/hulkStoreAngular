import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo: string = 'Iniciar Sesión';
  usuario: Usuario;

  constructor(private authService: AuthService, private router: Router) { 
    this.usuario = new Usuario();
  }

  ngOnInit() {
    if(this.authService.isAuthenticated()){
      Swal.fire('Inicio de Sesión',`Hola ${this.authService.usuario.username} ya estas autenticado!`,'info');     
      this.router.navigate(['/clientes']);
    }
  }

  login(): void{  
     console.log(this.usuario);
     if(this.usuario.username == null || this.usuario.password == null){
      Swal.fire('Error al iniciar sesión','Usuario o Constraseña son requeridos!','error');
       return;
     }


     this.authService.login(this.usuario).subscribe(response => {

      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      let usuario = this.authService.usuario;

      this.router.navigate(['/clientes']);
      Swal.fire('Inicio de Sesión',`Hola ${usuario.username}, has iniciado sesión con éxito!`,'success');
     },
     error => {
       if(error.status == 400){
        Swal.fire('Error al iniciar sesión','Usuario o clave invalidos!','error');
       }
     });

  }

}
