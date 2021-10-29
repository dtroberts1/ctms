import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Store } from '../interfaces/store';
import { StoreService } from '../services/store-service.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.less']
})
export class StoresComponent implements OnInit {
  store!: Store;
  stores!: Array<Store>;
  constructor(
    private storeService: StoreService,
  ) { 

  }

  item = this;

  ngOnInit(): void {
    this.storeService.getStores()
    .subscribe(
      res => {
        console.log({"res":res})
        if (Array.isArray(res)){
          this.stores = res;
        }
        else{
          this.stores = [];
        }
      },
      err => {

      }
    );
  }
  storeChanged(event : any, store: Store){

  }
}
