import { DashboardService } from "./dashboard.service";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";


import {
  MatCheckboxModule,
  MatNativeDateModule,
  MatBottomSheetModule
} from "@angular/material";
import { MatButtonModule } from "@angular/material";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSliderModule } from "@angular/material/slider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTabsModule } from "@angular/material/tabs";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";

import { MatMomentDateModule } from "@angular/material-moment-adapter";

import { DpDatePickerModule } from "ng2-jalali-date-picker";
import { AuthComponent } from "./auth/auth.component";
import { DataService } from "./data.service";
import { AuthService, AuthGuard } from "./auth.service";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FormsModule, FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";

import { DynamicModule } from "ng-dynamic-component";

import { IdbService } from "./idb.service";
import { SyncService } from "./sync.service";
import { MessagingService } from "./messaging.service";

import * as _ from "underscore";



import { PeopleTableComponent } from "./people/people-table/people-table.component";
import { PeopleSearchComponent } from "./people/people-search/people-search.component";
import { PeopleFormComponent } from "./people/people-form/people-form.component";
import { PeopleDeleteComponent } from "./people/people-delete/people-delete.component";
import { PeopleListComponent } from "./people/people-list/people-list.component";
import { CompanyDeleteComponent } from "./company/company-delete/company-delete.component";
import { CompanyListComponent } from "./company/company-list/company-list.component";
import { CompanyTableComponent } from "./company/company-table/company-table.component";
import { CompanyFormComponent } from "./company/company-form/company-form.component";
import { ComplaintDeleteComponent } from "./complaint/complaint-delete/complaint-delete.component";
import { ComplaintFormComponent } from "./complaint/complaint-form/complaint-form.component";
import { ComplaintTableComponent } from "./complaint/complaint-table/complaint-table.component";
import { ComplaintListComponent } from "./complaint/complaint-list/complaint-list.component";
import { ServiceDeleteComponent } from "./service/service-delete/service-delete.component";
import { ServiceTableComponent } from "./service/service-table/service-table.component";
import { ServiceListComponent } from "./service/service-list/service-list.component";
import { ServiceFormComponent } from "./service/service-form/service-form.component";
import { ProductDeleteComponent } from "./product/product-delete/product-delete.component";
import { ProductListComponent } from "./product/product-list/product-list.component";
import { ProductFormComponent } from "./product/product-form/product-form.component";
import { ProductTableComponent } from "./product/product-table/product-table.component";
import { CompanySearchComponent } from "./company/company-search/company-search.component";
import { ComplaintSearchComponent } from "./complaint/complaint-search/complaint-search.component";
import { ProductSearchComponent } from "./product/product-search/product-search.component";
import { InteractionFormComponent } from "./interaction/interaction-form/interaction-form.component";
import { InteractionTableComponent } from "./interaction/interaction-table/interaction-table.component";
import { InteractionListComponent } from "./interaction/interaction-list/interaction-list.component";
import { InteractionDeleteComponent } from "./interaction/interaction-delete/interaction-delete.component";
import { CrmComponent } from './crm/crm.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MapComponent } from './map/map.component';

import { NgxChartsModule } from '@swimlane/ngx-charts'

import { DndModule } from 'ngx-drag-drop';
import { CalendarComponent } from './calendar/calendar.component';
import { UserActivityBySectionComponent } from './charts/user-activity-by-section/user-activity-by-section.component';
import { OutcomeByCampaignComponent } from './charts/outcome-by-campaign/outcome-by-campaign.component';
import { CalendarMonthComponent } from './calendar/calendar-month/calendar-month.component';
import { CalendarDayComponent } from './calendar/calendar-day/calendar-day.component';
import { CalendarScheduleComponent } from './calendar/calendar-schedule/calendar-schedule.component';
import { SaleFormComponent } from './sale/sale-form/sale-form.component';
import { SaleListComponent } from './sale/sale-list/sale-list.component';
import { SaleTableComponent } from './sale/sale-table/sale-table.component';
import { CampaignFormComponent } from './campaign/campaign-form/campaign-form.component';
import { CampaignListComponent } from './campaign/campaign-list/campaign-list.component';
import { CampaignTableComponent } from './campaign/campaign-table/campaign-table.component';
import { TicketFormComponent } from './support/ticket-form/ticket-form.component';
import { TicketListComponent } from './support/ticket-list/ticket-list.component';
import { InvoicesComponent } from './support/invoices/invoices.component';
import { SmsServiceComponent } from './support/sms-service/sms-service.component';
import { EmailServiceComponent } from './support/email-service/email-service.component';
import { FaxServiceComponent } from './support/fax-service/fax-service.component';
import { AccountPasswordComponent } from './account/account-password/account-password.component';
import { AccountSessionsComponent } from './account/account-sessions/account-sessions.component';
import { AccountProfileComponent } from "./account/account-profile/account-profile.component";
import { ServiceTypesComponent } from './settings/service-types/service-types.component';
import { PiplineLeadComponent } from './pipline/pipline-lead/pipline-lead.component';
import { PiplineDealComponent } from './pipline/pipline-deal/pipline-deal.component';
import { PiplineSaleComponent } from './pipline/pipline-sale/pipline-sale.component';
import { ProductCategoriesComponent } from './settings/product-categories/product-categories.component';
import { RpdPipe } from './rpd.pipe';

import { NgxMaskModule } from 'ngx-mask'

import { NgxCurrencyModule } from "ngx-currency";
import { Split3Pipe } from './split3.pipe';
import { PeopleSelectSingleComponent } from './people/people-select-single/people-select-single.component';
import { PeopleSelectMultipleComponent } from './people/people-select-multiple/people-select-multiple.component';
import { CalendarYearComponent } from './calendar/calendar-year/calendar-year.component';


const dynamicComponents = [
  PeopleFormComponent,
  PeopleTableComponent,
  PeopleSearchComponent,
  PeopleDeleteComponent,
  PeopleListComponent,
  CompanyDeleteComponent,
  CompanyListComponent,
  CompanyTableComponent,
  CompanyFormComponent,
  ComplaintDeleteComponent,
  ComplaintFormComponent,
  ComplaintTableComponent,
  ComplaintListComponent,
  ServiceDeleteComponent,
  ServiceTableComponent,
  ServiceListComponent,
  ServiceFormComponent,
  ProductDeleteComponent,
  ProductListComponent,
  ProductFormComponent,
  ProductTableComponent,
  CompanySearchComponent,
  ComplaintSearchComponent,
  ProductSearchComponent,
  InteractionFormComponent,
  InteractionTableComponent,
  InteractionListComponent,
  InteractionDeleteComponent,
  UserActivityBySectionComponent,
  OutcomeByCampaignComponent,
  CalendarMonthComponent,
  CalendarDayComponent,
  CalendarScheduleComponent,
  SaleFormComponent,
  SaleListComponent,
  SaleTableComponent,
  CampaignFormComponent,
  CampaignListComponent,
  CampaignTableComponent,
  TicketFormComponent,
  TicketListComponent,
  AccountProfileComponent,
  AccountPasswordComponent,
  AccountSessionsComponent,
  InvoicesComponent,
  SmsServiceComponent,
  EmailServiceComponent,
  FaxServiceComponent,
  ServiceTypesComponent,
  PiplineLeadComponent,
  PiplineDealComponent,
  PiplineSaleComponent,
  ProductCategoriesComponent

];

var primaryComponents = [AppComponent,
  AuthComponent,
  DashboardComponent,
  CrmComponent,
  MapComponent,
  CalendarComponent];

@NgModule({
  declarations: [
    ...primaryComponents,
    ...dynamicComponents,
    RpdPipe,
    Split3Pipe,
    PeopleSelectSingleComponent,
    PeopleSelectMultipleComponent,
    CalendarYearComponent,
  ],
  entryComponents: [PeopleDeleteComponent],
  imports: [
    NgxMaterialTimepickerModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgxCurrencyModule,
    DynamicModule.withComponents(dynamicComponents),
    BrowserModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    DndModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatMomentDateModule,
    MatBottomSheetModule,
    DpDatePickerModule
  ],
  providers: [
    DataService,
    AuthService,
    AuthGuard,
    FormBuilder,
    IdbService,
    SyncService,
    MessagingService,
    DashboardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
