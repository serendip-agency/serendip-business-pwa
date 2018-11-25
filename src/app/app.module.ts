import { DashboardService } from "./dashboard.service";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { QuillModule } from "ngx-quill";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MatCheckboxModule, MatBottomSheetModule } from "@angular/material";
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

import { AuthComponent } from "./auth/auth.component";
import { DataService } from "./data.service";
import { AuthService, AuthGuard } from "./auth.service";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FormsModule, FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";

import { DynamicModule } from "ng-dynamic-component";

import * as _ from "underscore";

import { NgxChartsModule } from "@swimlane/ngx-charts";

import { DndModule } from "ngx-drag-drop";

import { IdbService } from "./idb.service";
import { ObService } from "./ob.service";

import { BusinessComponent } from "./business/business.component";

import { MapComponent } from "./map/map.component";

import { CalendarComponent } from "./calendar/calendar.component";
import { CalendarMonthComponent } from "./calendar/calendar-month/calendar-month.component";
import { CalendarDayComponent } from "./calendar/calendar-day/calendar-day.component";
import { CalendarScheduleComponent } from "./calendar/calendar-schedule/calendar-schedule.component";
import { CalendarYearComponent } from "./calendar/calendar-year/calendar-year.component";

import { TicketFormComponent } from "./support/ticket-form/ticket-form.component";
import { TicketListComponent } from "./support/ticket-list/ticket-list.component";
import { InvoicesComponent } from "./support/invoices/invoices.component";
import { SmsServiceComponent } from "./support/sms-service/sms-service.component";
import { EmailServiceComponent } from "./support/email-service/email-service.component";
import { FaxServiceComponent } from "./support/fax-service/fax-service.component";
import { AccountPasswordComponent } from "./account/account-password/account-password.component";
import { AccountSessionsComponent } from "./account/account-sessions/account-sessions.component";
import { AccountProfileComponent } from "./account/account-profile/account-profile.component";

import { RpdPipe } from "./rpd.pipe";

import { NgxMaskModule } from "ngx-mask";

import { NgxCurrencyModule } from "ngx-currency";
import { Split3Pipe } from "./split3.pipe";
import { FormTextInputComponent } from "./base/form/form-text-input/form-text-input.component";
import { FormPriceInputComponent } from "./base/form/form-price-input/form-price-input.component";
import { FormMobileInputComponent } from "./base/form/form-mobile-input/form-mobile-input.component";
import { FormTelephoneInputComponent } from "./base/form/form-telephone-input/form-telephone-input.component";
import { FormCityInputComponent } from "./base/form/form-city-input/form-city-input.component";
import { FormCountryInputComponent } from "./base/form/form-country-input/form-country-input.component";
import { FormStateInputComponent } from "./base/form/form-state-input/form-state-input.component";
import { FormLatlngInputComponent } from "./base/form/form-latlng-input/form-latlng-input.component";
import { FormChipsInputComponent } from "./base/form/form-chips-input/form-chips-input.component";
import { FormSelectInputComponent } from "./base/form/form-select-input/form-select-input.component";
import { FormCheckboxInputComponent } from "./base/form/form-checkbox-input/form-checkbox-input.component";
import { FormRadioInputComponent } from "./base/form/form-radio-input/form-radio-input.component";
import { FormAutoCompleteInputComponent } from "./base/form/form-auto-complete-input/form-auto-complete-input.component";
import { FormToggleInputComponent } from "./base/form/form-toggle-input/form-toggle-input.component";
import { FormMultipleTextInputComponent } from "./base/form/form-multiple-text-input/form-multiple-text-input.component";
import { FormComponent } from "./base/form/form.component";
import { ContactInputComponent } from "./crm/contact-input/contact-input.component";
import { CompanyViewComponent } from "./crm/company-view/company-view.component";
import { ObjectidViewComponent } from "./base/report/objectid-view/objectid-view.component";
import { ShortTextViewComponent } from "./base/report/short-text-view/short-text-view.component";
import { LongTextViewComponent } from "./base/report/long-text-view/long-text-view.component";
import { StarRatingViewComponent } from "./base/report/star-rating-view/star-rating-view.component";
import { ClubRatingViewComponent } from "./crm/club-rating-view/club-rating-view.component";
import { ReportComponent } from "./base/report/report.component";
import { ContactsViewComponent } from "./crm/contacts-view/contacts-view.component";
import { DateViewComponent } from "./base/report/date-view/date-view.component";
import { CurrencyViewComponent } from "./base/report/currency-view/currency-view.component";
import { TriggersComponent } from "./base/triggers/triggers.component";
import { FormDateInputComponent } from "./base/form/form-date-input/form-date-input.component";
import { FormRelativeDateInputComponent } from "./base/form/form-relative-date-input/form-relative-date-input.component";
import { FormDateRangeInputComponent } from './base/form/form-date-range-input/form-date-range-input.component';
import { WeatherComponent } from './weather/weather.component';
import { EmailComponent } from './email/email.component';
import { SmsComponent } from './sms/sms.component';
import { FaxComponent } from './fax/fax.component';
import { FormAutoAndSelectComponent } from './base/form/form-auto-and-select/form-auto-and-select.component';
import { FormSelectAndSelectComponent } from './base/form/form-select-and-select/form-select-and-select.component';
import { FormTextAndSelectComponent } from './base/form/form-text-and-select/form-text-and-select.component';
import { FormToggleAndSelectComponent } from './base/form/form-toggle-and-select/form-toggle-and-select.component';

export const dynamicComponents = [
  CalendarMonthComponent,
  CalendarDayComponent,
  CalendarScheduleComponent,
  TicketFormComponent,
  TicketListComponent,
  AccountProfileComponent,
  AccountPasswordComponent,
  AccountSessionsComponent,
  InvoicesComponent,
  SmsServiceComponent,
  EmailServiceComponent,
  FaxServiceComponent,

  // Base components
  TriggersComponent,
  FormComponent,
  ReportComponent,

  // views

  CompanyViewComponent,

  // Form Parts

  FormTextInputComponent,
  FormMultipleTextInputComponent,
  FormPriceInputComponent,
  FormMobileInputComponent,
  FormTelephoneInputComponent,
  FormCityInputComponent,
  FormCountryInputComponent,
  FormStateInputComponent,
  FormLatlngInputComponent,
  FormChipsInputComponent,
  FormSelectInputComponent,
  FormCheckboxInputComponent,
  FormRadioInputComponent,
  FormToggleInputComponent,
  FormAutoCompleteInputComponent,
  FormDateInputComponent,
  FormRelativeDateInputComponent,
  FormDateRangeInputComponent,
  // Business related form parts

  ContactInputComponent,

  // report views

  ObjectidViewComponent,
  ShortTextViewComponent,
  LongTextViewComponent,
  StarRatingViewComponent,
  DateViewComponent,
  CurrencyViewComponent,
  // Business related  report views
  ClubRatingViewComponent,
  ContactsViewComponent
];

export const primaryComponents = [
  AppComponent,
  AuthComponent,
  DashboardComponent,
  BusinessComponent,
  MapComponent,
  CalendarComponent,
  RpdPipe,
  Split3Pipe,
  CalendarYearComponent
];

@NgModule({
  declarations: [...primaryComponents, ...dynamicComponents, WeatherComponent, EmailComponent, SmsComponent, FaxComponent, FormAutoAndSelectComponent, FormSelectAndSelectComponent, FormTextAndSelectComponent, FormToggleAndSelectComponent],
  entryComponents: [],
  imports: [
    QuillModule,
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
    MatBottomSheetModule
  ],
  providers: [
    DataService,
    AuthService,
    AuthGuard,
    FormBuilder,
    IdbService,
    ObService,
    DashboardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
