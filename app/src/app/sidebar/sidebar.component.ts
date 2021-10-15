import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit {
  selectedMenuItem = 'profits';
  constructor() { 

  }

  ngOnInit(): void {

  }
  selectItem(item: string){
    this.selectedMenuItem = item;
}
}
