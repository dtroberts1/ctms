import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarProfitsSummaryComponent } from './sidebar-profits-summary/sidebar-profits-summary.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    SidebarProfitsSummaryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
