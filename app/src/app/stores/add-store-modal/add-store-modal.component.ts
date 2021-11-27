import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoreService } from 'src/app/services/store-service.service';

@Component({
  selector: 'app-add-store-modal',
  templateUrl: './add-store-modal.component.html',
  styleUrls: ['./add-store-modal.component.less']
})
export class AddStoreModalComponent implements OnInit {
  storeNameFormControl = new FormControl('', [Validators.required]);
  launchDateFormControl = new FormControl('', [Validators.required]);
  addressStreet1 = new FormControl('', [Validators.required, Validators.pattern(/\d+(\s+\w+\.?){1,}\s+(?:st(?:\.|reet)?|dr(?:\.|ive)?|pl(?:\.|ace)?|ave(?:\.|nue)?|rd(\.?)|road|lane|drive|way|court|plaza|square|run|parkway|point|pike|square|driveway|trace|park|terrace|blvd)+$/i)]);
  addressStreet2 = new FormControl('', [Validators.pattern(/^(APT|APARTMENT|SUITE|STE|UNIT) *(NUMBER|NO|#)? *([0-9A-Z-]+)(.*)$/i)]);
  addressCity = new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z\u0080-\u024F]+(?:. |-| |')*([1-9a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$")]);
  addressState = new FormControl('', [Validators.required, Validators.pattern('^((A[LKZR])|(C[AOT])|(D[EC])|(FL)|(GA)|(HI)|(I[DLNA])|(K[SY])|(LA)|(M[EDAINSOT])|(N[EVHJMYCD])|(O[HKR])|(PA)|(RI)|(S[CD])|(T[NX])|(UT)|(V[TA])|(W[AVIY]))$')]);
  addressZipCode = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]);
  matcher = new MyErrorStateMatcher();
  launchDate !: Date;

  constructor(
    private storeService: StoreService,
    public dialogRef: MatDialogRef<AddStoreModalComponent>,
  ) { }

  ngOnInit(): void {
  }
  close(){
    this.dialogRef.close();   
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
  add(){
    this.storeService.addStore({
      storeId: null,
      storeName: this.storeNameFormControl.value,
      launchDate: this.launchDateFormControl.value,
      streetAddr1: this.addressStreet1.value,
      streetAddr2: this.addressStreet2.value,
      city: this.addressCity.value,
      state: this.addressState.value,
      zipcode: this.addressZipCode.value,
    })
    .subscribe((res) => {
      this.dialogRef.close(true);   
    });
  }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
