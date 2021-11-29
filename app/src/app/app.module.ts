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
import { MatFormFieldModule } from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import{MatBadgeModule} from '@angular/material/badge';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import {MatSelectModule} from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input'
import {MatSortModule} from '@angular/material/sort';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule} from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MenuItemModalComponent } from './business-menu/menu-item-modal/menu-item-modal.component';
import { SalesOverviewComponent } from './sales/sales-overview/sales-overview.component';
import { SalesTableComponent } from './sales/sales-table/sales-table.component';
import { DatePipe } from '@angular/common';
import { StoresComponent } from './stores/stores.component';
import { SimulatorComponent } from './stores/simulator/simulator.component';
import { SimulatorPipePipe } from './stores/simulator/simulator-pipe.pipe';
import { AddInventoryModalComponent } from './stores/add-inventory-modal/add-inventory-modal.component';
import { StoreSalesChartsComponent } from './stores/store-sales-charts/store-sales-charts.component';
import { LoginComponent } from './login/login.component';
import { AddStoreModalComponent } from './stores/add-store-modal/add-store-modal.component';
import { AgmCoreModule } from '@agm/core';
import { GeocodeService } from './geocode.service';
import { SidebarServiceSummaryComponent } from './sidebar/sidebar-service-summary/sidebar-service-summary.component';

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
    MenuItemModalComponent,
    SalesOverviewComponent,
    SalesTableComponent,
    StoresComponent,
    SimulatorComponent,
    SimulatorPipePipe,
    AddInventoryModalComponent,
    StoreSalesChartsComponent,
    LoginComponent,
    AddStoreModalComponent,
    SidebarServiceSummaryComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatFormFieldModule,
    AppRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatBadgeModule,
    HttpClientModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatSortModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDi1ThRy79APlO8SXvSHFnpRlphTFvgRTc',
    }),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    DatePipe,
    GeocodeService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
