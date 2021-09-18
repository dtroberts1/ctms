import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'CTMS';
  selectedNavItem = 'dashboard';
  selectedToolbarItem = '';

  navigateNavBar(item: string){
    this.selectedNavItem = item;
  }
  navigateToolBar(item: string){
    this.selectedToolbarItem = item;
  }
}
