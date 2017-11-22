import { Component } from '@angular/core';
import { routerTransition } from './router.transition';

@Component({
  selector: 'tus-schedule',
  animations: [ routerTransition ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { 
  getState(outlet) {
    return outlet.activatedRouteData.state;
  }
}