import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
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
import {Chart} from "chart.js";
import { PieChartComponent } from './pie-chart/pie-chart.component';

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
    DashboardComponent,
    PieChartComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
