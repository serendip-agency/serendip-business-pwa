import { BusinessComponent } from "./business/business.component";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuthGuard } from "./auth.service";
import { AuthComponent } from "./auth/auth.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { environment } from "src/environments/environment";
import { StorageComponent } from "./storage/storage.component";
import { PanelComponent } from "./panel/panel.component";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "filemanager",
    component: StorageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "panel/:section/:tab",
    component: PanelComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "panel/:section",
    component: PanelComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "panel",
    component: PanelComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "dashboard/:section",
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { path: "home", component: HomeComponent },
  { path: "business", component: BusinessComponent },
  { path: "business/:tab", component: BusinessComponent },
  { path: "auth", component: AuthComponent },
  { path: "auth/:tab", component: AuthComponent },

  { path: "", redirectTo: environment.default, pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}
