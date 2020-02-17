import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Bienvenido a mi primera aproximación a Angular';

  curso: string = 'Tomado el curso de sping y angular';
  profesor: string = 'Andres Guzman';
}
