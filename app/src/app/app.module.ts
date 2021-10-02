import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarProfitsSummaryComponent } from './sidebar-profits-summary/sidebar-profits-summary.component';
import { BusinessMenuComponent } from './business-menu/business-menu.component';
import { BusinessMenuOverviewComponent } from './business-menu/business-menu-overview/business-menu-overview.component';
import { InventoryComponent } from './inventory/inventory.component';
import { SalesComponent } from './sales/sales.component';
import { EventsComponent } from './events/events.component';
import { PartnersComponent } from './partners/partners.component';
import { ReportsComponent } from './reports/reports.component';
import { LocationsComponent } from './locations/locations.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BusinessMenuTableComponent } from './business-menu/business-menu-table/business-menu-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import{MatBadgeModule} from '@angular/material/badge';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    SidebarProfitsSummaryComponent,
    BusinessMenuComponent,
    BusinessMenuOverviewComponent,
    InventoryComponent,
    SalesComponent,
    EventsComponent,
    PartnersComponent,
    ReportsComponent,
    LocationsComponent,
    DashboardComponent,
    BusinessMenuTableComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatBadgeModule,
    HttpClientModule,
    MatIconModule,
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
