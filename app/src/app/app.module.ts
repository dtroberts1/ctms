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
import {FormsModule} from '@angular/forms';
import{MatBadgeModule} from '@angular/material/badge';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import {MatSelectModule} from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input'
import { MenuItemModalComponent } from './business-menu/menu-item-modal/menu-item-modal.component';

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
    BusinessMenuTableComponent,
    MenuItemModalComponent
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
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    MatTooltipModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
