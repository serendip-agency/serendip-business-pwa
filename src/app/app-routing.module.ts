import { CrmComponent } from './crm/crm.component';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AuthGuard } from './auth.service';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';



const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/:section', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/:section/:tab', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/:section/:tab/:id', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'auth', component: AuthComponent },
  { path: 'auth/:tab', component: AuthComponent },
  { path: 'crm', component: CrmComponent },
  { path: 'crm/:tab', component: CrmComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {


}
