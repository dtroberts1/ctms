import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'CTMS';
  selectedNavItem = 'dashboard';
  selectedToolbarItem = '';
  selectedFooterItem = '';

  constructor(private router: Router){

  }

  ngOnInit(){
    this.router.navigate(['/dashboard']);
  }

  navigateNavBar(item: string){
    this.selectedNavItem = item;
    this.router.navigate([`/${item}`]);
  }
  navigateToolBar(item: string){
    this.selectedToolbarItem = item;
    
  }
  footerBtnClicked(item: string){
    this.selectedFooterItem = item;
    console.log("selected footer is " + this.selectedFooterItem)
  }
}
