import { MapsAPILoader } from '@agm/core';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store, StoreIngredient } from '../interfaces/store';
import { IngredientService } from '../services/ingredient-service.service';
import { StoreService } from '../services/store-service.service';
import { AddInventoryModalComponent } from './add-inventory-modal/add-inventory-modal.component';
import { AddStoreModalComponent } from './add-store-modal/add-store-modal.component';
import { SimulatorComponent } from './simulator/simulator.component';
import {} from '@angular/google-maps';
import { Observable } from 'rxjs';
import { GeocodeService } from '../geocode.service';

const pal = ["#001464", "#26377B", "#404F8B", "#59709A"]
export interface Location {
  lat: number; 
  lng: number;
}

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.less']
})
export class StoresComponent implements OnInit {
  @ViewChild('map') mapElement: any;
  map!: google.maps.Map;

  store!: Store | null;
  coordinates: any;

  stores!: Array<Store>;
  storeIngredients!: Array<StoreIngredient> | any;
  title: string = 'AGM project';
  address : string = 'London';
  location!: Location;
  loading!: boolean;

  constructor(
    private storeService: StoreService,
    private ingredientService: IngredientService,
    public dialog: MatDialog,
    private geocodeService: GeocodeService,
    private ref: ChangeDetectorRef,
      ) { 
        /*
    this.platform = new H.service.Platform({
      "app_id": "API key 1",
      "app_code": "AIzaSyDi1ThRy79APlO8SXvSHFnpRlphTFvgRTc"
  });
  this.geoCoder = this.platform.getGeocodingService();
  */
  }



  item = this;

  setupForecastChart(){

  }

  openAddInventoryModal(){
    const dialogRef = this.dialog.open(AddInventoryModalComponent, {
      width: '550px',
      height: '640px',
      data: {
        storeId: (this.store && this.store.storeId) ?? -1,
        storeIngredients: JSON.parse(JSON.stringify(this.storeIngredients)),
      },
      panelClass: 'modal-class'
    });

    dialogRef.afterClosed().subscribe(
      res => {
        this.ingredientService.getStoreIngredients((this.store && this.store.storeId) ?? -1)
        .subscribe(
          res => {
            this.storeIngredients = res;
            let i = 0;
            this.storeIngredients.forEach((item : any) => {
              item.backgroundColor = this.getColors(this.storeIngredients.length, pal)[i];
              i++;
            });
          },
          err => {

          }
        );
      },
      err => {

      }
    )
  }

  openSimModal(){

    const dialogRef = this.dialog.open(SimulatorComponent, {
      width: '550px',
      height: '640px',
      data: {
        storeId: (this.store && this.store.storeId) ?? -1,
        storeIngredients: JSON.parse(JSON.stringify(this.storeIngredients)),
      },
      panelClass: 'modal-class'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getGeoLocation(address: string): Observable<any> {
    let geocoder = new google.maps.Geocoder();
    return Observable.create((observer : any) => {
        geocoder.geocode({
            'address': address
        }, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
              if (results){
                observer.next(results[0].geometry.location);
              }
                observer.complete();
            } else {
                observer.error();
            }
        });
    });
}

  ngOnInit(): void {
    this.storeService.getStores()
    .subscribe(
      res => {
        if (Array.isArray(res)){
          this.stores = res;

          this.store = this.stores[0];
          this.storeChanged(null, this.store);
        }
        else{
          this.stores = [];
        }
      },
      err => {

      }
    );

/*
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result

          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          if (place.geometry.location){
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
          }
          this.zoom = 12;
        });
      });
    });
    */

  }

  ngAfterViewInit() {
    this.loading = true;
    this.geocodeService.geocodeAddress('47725 W 1st St, Oakridge, OR, 97463')
    .subscribe((location: Location) => {
        this.location = location;
        this.loading = false;
        this.ref.detectChanges();  
      }      
    );  
  }


  deleteStore(){
    this.storeService.deleteStore((this.store && this.store.storeId) ?? -1)
      .subscribe((res) => {
        this.getStores();
      },
      err => {
        this.getStores();
      }
      
      );
  }

  getStores(){
    this.storeService.getStores()
    .subscribe(
      res => {
        if (Array.isArray(res)){
          let prevStoreId = (this.store && this.store.storeId) ?? -1;
          this.stores = res;
          let store = this.stores.find(store => store.storeId === prevStoreId);
          if (store){
            this.store = store;
          }
          else{
            this.store = null;
          }
          this.storeChanged(null, this.store);
        }
        else{
          this.stores = [];
        }
      },
      err => {

      }
    );
  }

  addStore(){
    const dialogRef = this.dialog.open(AddStoreModalComponent, {
      width: '550px',
      height: '640px',
      panelClass: 'modal-class'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.getStores();
      }
    });
  }

  storeChanged(event : any, store: Store | null){
    if (store){
      this.ingredientService.getStoreIngredients(store.storeId ?? -1)
        .subscribe(
          res => {
            this.storeIngredients = res;
            let i = 0;
            this.storeIngredients.forEach((item : any) => {
              item.backgroundColor = this.getColors(this.storeIngredients.length, pal)[i];
              i++;
            });
          },
          err => {

          }
        );
    }
  }

  getColors(length: number, pallet: string[]){
    let colors = [];

    for(let i = 0; i < length; i++) {
      colors.push(pallet[i % pallet.length]);
    }

    return colors;
  }
}
