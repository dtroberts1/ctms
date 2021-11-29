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
  overallServiceRating!: string;
  likelihoodToRecommend!: string;
  mostPopularItemSold!: string;
  leastPopularItemSold!: string;
  leadPerformer!: string;
  worstPerformer!: string;
  revenueYTD!: string;
  productQtySold!: string;

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
    this.launchDateFormControl.setValue(this.store?.launchDate);
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
    this.getStores();
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

  saveStoreDetails(){
    if (this.store){
      this.storeService.putStoreDetails({
        storeId: this.store.storeId,
        storeName: this.storeNameFormControl.value,
        launchDate: this.launchDateFormControl.value,
        streetAddr1: this.addressStreet1.value,
        streetAddr2: this.addressStreet2.value,
        city: this.addressCity.value,
        state: this.addressState.value,
        zipcode: this.addressZipCode.value,
      })
      .subscribe(
        res => {
          this.getStores();
          this.detailChangesPending = false;
          this.addressEditMode = false;
          this.storeNameEditMode = false;
        },
        err => {
          this.cancelDetailChanges();
        }
      );
    }
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

  setStoreMetrics(storeId: number){
    this.storeService.getStoreMetrics(storeId ?? -1)
    .subscribe(
      (res : any) => {
        if (res.averageServiceRating && Array.isArray(res.averageServiceRating) && res.averageServiceRating.length){
          this.overallServiceRating = `${res.averageServiceRating[0].averageRating.toFixed(2)} of 10`;
        }
        if (res.likelyHoodToRecommendStore && Array.isArray(res.likelyHoodToRecommendStore) && res.likelyHoodToRecommendStore.length){
          this.likelihoodToRecommend = `${res.likelyHoodToRecommendStore[0].likelyToRecommend.toFixed(2)} of 10`;
        }

        if (Array.isArray(res.mostLeastPopularStoreMenuItem) && res.mostLeastPopularStoreMenuItem.length){
          let lastItem = res.mostLeastPopularStoreMenuItem[res.mostLeastPopularStoreMenuItem.length - 1];
          this.mostPopularItemSold = `${res.mostLeastPopularStoreMenuItem[0].name} ${res.mostLeastPopularStoreMenuItem[0].qtySold}`;
          this.leastPopularItemSold = `${lastItem.name} ${lastItem.qtySold}`;
        }

        if (Array.isArray(res.averageEmployeeRating) && res.averageEmployeeRating.length){
          let lastItem = res.averageEmployeeRating[res.averageEmployeeRating.length - 1];
          this.leadPerformer = `${res.averageEmployeeRating[0].employeeName}  ${res.averageEmployeeRating[0].averageRating.toFixed(2)} of 10`;
          this.worstPerformer = `${lastItem.employeeName}  ${lastItem.averageRating.toFixed(2)} of 10`;
        }

        if (Array.isArray(res.productsSoldWithRevenueStoreYtd) && res.productsSoldWithRevenueStoreYtd.length){
          this.revenueYTD = `$${res.productsSoldWithRevenueStoreYtd[0].revenueYTD}`;
          this.productQtySold = res.productsSoldWithRevenueStoreYtd[0].qtySoldYTD;
        }
      },
      err => {

      }
    );
  }

  storeChanged(event : any, store: Store | null){
    if (store){
      this.setFormControlInputs();
      this.updateMap(`${store.streetAddr1}${(store.streetAddr1 ? ', ' : ' ')}
        ${store.streetAddr2}${(store.streetAddr2 ? ', ' : ' ')}
        ${store.city}${(store.city ? ', ' : ' ')}
        ${store.state}${(store.state ? ', ' : ' ')}
        ${store.zipcode}${(store.zipcode ? ', ' : ' ')}`);

      this.setStoreMetrics(store.storeId ?? -1);

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
