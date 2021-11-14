import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessMenuComponent } from './business-menu/business-menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventsComponent } from './events/events.component';
import { InventoryComponent } from './inventory/inventory.component';
import { LocationsComponent } from './locations/locations.component';
import { LoginComponent } from './login/login.component';
import { PartnersComponent } from './partners/partners.component';
import { ReportsComponent } from './reports/reports.component';
import { SalesComponent } from './sales/sales.component';
import { StoresComponent } from './stores/stores.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'menu', component: BusinessMenuComponent},
  {path: 'inventory', component: InventoryComponent},
  {path: 'sales', component: SalesComponent},
  {path: 'events', component: EventsComponent},
  {path: 'partners', component: PartnersComponent},
  {path: 'reports', component: ReportsComponent},
  {path: 'locations', component: LocationsComponent},
  {path: 'stores', component: StoresComponent},
  {path: '', component: LoginComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
