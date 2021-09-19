import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarProfitsSummaryComponent } from './sidebar-profits-summary/sidebar-profits-summary.component';
import { BusinessMenuComponent } from './business-menu/business-menu.component';
import { InventoryComponent } from './inventory/inventory.component';
import { SalesComponent } from './sales/sales.component';
import { EventsComponent } from './events/events.component';
import { PartnersComponent } from './partners/partners.component';
import { ReportsComponent } from './reports/reports.component';
import { LocationsComponent } from './locations/locations.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    SidebarProfitsSummaryComponent,
    BusinessMenuComponent,
    InventoryComponent,
    SalesComponent,
    EventsComponent,
    PartnersComponent,
    ReportsComponent,
    LocationsComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
