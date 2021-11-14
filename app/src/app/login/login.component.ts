import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router){ 

  }

  ngOnInit(): void {
    
  }
  attemptLogin(){
    this.router.navigate(['/dashboard']);

  }
}
