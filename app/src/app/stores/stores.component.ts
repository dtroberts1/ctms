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
import { FormControl, Validators } from '@angular/forms';

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
  @ViewChild('storeNameInput') storeNameInput!: ElementRef;

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
  launchDateFormControl = new FormControl('', [Validators.required]);
  addressStreet1 = new FormControl('', [Validators.required, Validators.pattern(/\d+(\s+\w+\.?){1,}\s+(?:st(?:\.|reet)?|dr(?:\.|ive)?|pl(?:\.|ace)?|ave(?:\.|nue)?|rd(\.?)|road|lane|drive|way|court|plaza|square|run|parkway|point|pike|square|driveway|trace|park|terrace|blvd)+$/i)]);
  addressStreet2 = new FormControl('', [Validators.pattern(/^(APT|APARTMENT|SUITE|STE|UNIT) *(NUMBER|NO|#)? *([0-9A-Z-]+)(.*)$/i)]);
  addressCity = new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z\u0080-\u024F]+(?:. |-| |')*([1-9a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$")]);
  addressState = new FormControl('', [Validators.required, Validators.pattern('^((A[LKZR])|(C[AOT])|(D[EC])|(FL)|(GA)|(HI)|(I[DLNA])|(K[SY])|(LA)|(M[EDAINSOT])|(N[EVHJMYCD])|(O[HKR])|(PA)|(RI)|(S[CD])|(T[NX])|(UT)|(V[TA])|(W[AVIY]))$')]);
  addressZipCode = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]);
  storeNameFormControl = new FormControl('', [Validators.required]);
  launchDate !: Date;
  addressEditMode !: boolean;
  detailChangesPending : boolean = false;
  storeNameEditMode: boolean = false;

  constructor(
    private storeService: StoreService,
    private ingredientService: IngredientService,
    public dialog: MatDialog,
    private geocodeService: GeocodeService,
    private ref: ChangeDetectorRef,
      ) { 
  }
  setFormControlInputs(){
    this.addressStreet1.setValue(this.store?.streetAddr1);
    this.addressStreet2.setValue(this.store?.streetAddr2);
    this.addressCity.setValue(this.store?.city);
    this.addressState.setValue(this.store?.state);
    this.addressZipCode.setValue(this.store?.zipcode);
    this.storeNameFormControl.setValue(this.store?.storeName);
  }

  getInputErrorMessage(inputField : any){
    
    if (inputField.hasError('required')) {
      return 'You must enter a value';
    }
    if (inputField.hasError(inputField)){
        return "Not a valid entry";
    }
    return "";
  }

  enableStoreNameEditMode(){
    this.storeNameEditMode = true;
    this.storeNameInput.nativeElement.focus();
  }

  setupForecastChart(){

  }

  detailDataChanged(){
    this.detailChangesPending = true;
  }

  cancelDetailChanges(){
    this.detailChangesPending = false;
    this.addressEditMode = false;
    this.storeNameEditMode = false;
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
          this.setFormControlInputs();
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

  updateMap(newAddress: string){
    this.loading = true;
    this.geocodeService.geocodeAddress(newAddress)
    .subscribe((location: Location) => {
        this.location = location;
        this.loading = false;
        this.ref.detectChanges();  
      }      
    );
  }

  ngAfterViewInit() {  
    this.updateMap('47725 W 1st St, Oakridge, OR, 97463');
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
          this.setFormControlInputs();

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
      this.setFormControlInputs();
      this.updateMap(`${store.streetAddr1}${(store.streetAddr1 ? ', ' : ' ')}
        ${store.streetAddr2}${(store.streetAddr2 ? ', ' : ' ')}
        ${store.city}${(store.city ? ', ' : ' ')}
        ${store.state}${(store.state ? ', ' : ' ')}
        ${store.zipcode}${(store.zipcode ? ', ' : ' ')}`);

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
