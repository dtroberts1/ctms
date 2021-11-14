import { Component } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';



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
  name = 'Get Current Url Route Demo';
  currentRoute!: string;
  isLoginPage: boolean = false;

  constructor(private router: Router){
    
    router.events.subscribe(
      (event: any) => {
        if(event instanceof NavigationEnd) {
          this.currentRoute = event.url;          
          if (event.url.includes('login')){
            this.isLoginPage = true;
          }
          else{
            this.isLoginPage = false;
          }
        }
      });
  }

  ngOnInit(){
    this.router.navigate(['login']);
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
  }
}
