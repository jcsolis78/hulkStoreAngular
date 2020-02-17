import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  
  constructor(private authService: AuthService,
    private router: Router){}
  

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if(this.authService.isAuthenticated()){
      if(this.isTokenExpired()){
        this.authService.logout();
        this.router.navigate(['/login']);
        return false;

      }
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }


  isTokenExpired(): boolean{
    let token = this.authService.token;
    let peyload = this.authService.obtenerDatosToken(token);
    let now = new Date().getTime() / 1000; //convierte en segundos la fecha actual 

    if(peyload.exp < now){
      return true;
    }
    return false;
  }

}
