import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatBottomSheetModule,
  MatButtonModule,
  MatCheckboxModule
} from "@angular/material";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { DynamicModule } from "ng-dynamic-component";
import { NgxCurrencyModule } from "ngx-currency";
import { DndModule } from "ngx-drag-drop";
import { NgxMaskModule } from "ngx-mask";
import { QuillModule } from "ngx-quill";

import { AccountPasswordComponent } from "./account/account-password/account-password.component";
import { AccountProfileComponent } from "./account/account-profile/account-profile.component";
import { AccountSessionsComponent } from "./account/account-sessions/account-sessions.component";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthGuard, AuthService } from "./auth.service";
import { AuthComponent } from "./auth/auth.component";
import { FormAutoCompleteInputComponent } from "./base/form/form-auto-complete-input/form-auto-complete-input.component";
import { FormCheckboxInputComponent } from "./base/form/form-checkbox-input/form-checkbox-input.component";
import { FormChipsInputComponent } from "./base/form/form-chips-input/form-chips-input.component";
import { FormCityInputComponent } from "./base/form/form-city-input/form-city-input.component";
import { FormCountryInputComponent } from "./base/form/form-country-input/form-country-input.component";
import { FormDateInputComponent } from "./base/form/form-date-input/form-date-input.component";
import { FormLatlngInputComponent } from "./base/form/form-latlng-input/form-latlng-input.component";
import { FormMobileInputComponent } from "./base/form/form-mobile-input/form-mobile-input.component";
import { FormMultipleTextInputComponent } from "./base/form/form-multiple-text-input/form-multiple-text-input.component";
import { FormPriceInputComponent } from "./base/form/form-price-input/form-price-input.component";
import { FormRadioInputComponent } from "./base/form/form-radio-input/form-radio-input.component";
import { FormRelativeDateInputComponent } from "./base/form/form-relative-date-input/form-relative-date-input.component";
import { FormSelectInputComponent } from "./base/form/form-select-input/form-select-input.component";
import { FormStateInputComponent } from "./base/form/form-state-input/form-state-input.component";
import { FormTelephoneInputComponent } from "./base/form/form-telephone-input/form-telephone-input.component";
import { FormTextInputComponent } from "./base/form/form-text-input/form-text-input.component";
import { FormToggleInputComponent } from "./base/form/form-toggle-input/form-toggle-input.component";
import { FormComponent } from "./base/form/form.component";
import { CurrencyViewComponent } from "./base/report/currency-view/currency-view.component";
import { DateViewComponent } from "./base/report/date-view/date-view.component";
import { LongTextViewComponent } from "./base/report/long-text-view/long-text-view.component";
import { ObjectidViewComponent } from "./base/report/objectid-view/objectid-view.component";
import { ReportComponent } from "./base/report/report.component";
import { ShortTextViewComponent } from "./base/report/short-text-view/short-text-view.component";
import { StarRatingViewComponent } from "./base/report/star-rating-view/star-rating-view.component";
import { TriggersComponent } from "./base/triggers/triggers.component";
import { BusinessComponent } from "./business/business.component";
import { CalendarDayComponent } from "./calendar/calendar-day/calendar-day.component";
import { CalendarMonthComponent } from "./calendar/calendar-month/calendar-month.component";
import { CalendarScheduleComponent } from "./calendar/calendar-schedule/calendar-schedule.component";
import { CalendarYearComponent } from "./calendar/calendar-year/calendar-year.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { ClubRatingViewComponent } from "./crm/club-rating-view/club-rating-view.component";
import { ContactInputComponent } from "./crm/contact-input/contact-input.component";
import { ContactsViewComponent } from "./crm/contacts-view/contacts-view.component";
import { DashboardService } from "./dashboard.service";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DataService } from "./data.service";
import { EmailComponent } from "./email/email.component";
import { FaxComponent } from "./fax/fax.component";
import { IdbService } from "./idb.service";
import { MapComponent } from "./map/map.component";
import { ObService } from "./ob.service";
import { RpdPipe } from "./rpd.pipe";
import { SmsComponent } from "./sms/sms.component";
import { Split3Pipe } from "./split3.pipe";
import { EmailServiceComponent } from "./support/email-service/email-service.component";
import { FaxServiceComponent } from "./support/fax-service/fax-service.component";
import { InvoicesComponent } from "./support/invoices/invoices.component";
import { SmsServiceComponent } from "./support/sms-service/sms-service.component";
import { TicketFormComponent } from "./support/ticket-form/ticket-form.component";
import { TicketListComponent } from "./support/ticket-list/ticket-list.component";
import { WeatherComponent } from "./weather/weather.component";
import { FormFileInputComponent } from "./base/form/form-file-input/form-file-input.component";
import { ListComponent } from "./base/list/list.component";
import { PriceViewComponent } from "./base/report/price-view/price-view.component";
import { PersianPipe } from "./persian.pipe";
import { StorageComponent } from "./storage/storage.component";
import { StorageFilesComponent } from "./storage/storage-files/storage-files.component";
import { FormPartsComponent } from "./base/form/form-parts/form-parts.component";
import { SyncComponent } from "./sync/sync.component";
import { FormIconInputComponent } from "./base/form/form-icon-input/form-icon-input.component";
import { ChartComponent } from "./base/chart/chart.component";
import { FormCodeInputComponent } from "./base/form/form-code-input/form-code-input.component";
import { IconViewComponent } from "./base/report/icon-view/icon-view.component";
import { FormStorageInputComponent } from "./base/form/form-storage-input/form-storage-input.component";
import { FormHtmlInputComponent } from "./base/form/form-html-input/form-html-input.component";
import { SafePipe } from "./safe.pipe";
import { FormFieldValueCompareComponent } from "./base/form/form-field-value-compare/form-field-value-compare.component";
import { NoteComponent } from "./note/note.component";
import { JsonViewComponent } from "./base/report/json-view/json-view.component";

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
  FormFileInputComponent,
  FormIconInputComponent,
  FormCodeInputComponent,
  FormCodeInputComponent,
  FormStorageInputComponent,
  FormHtmlInputComponent,
  FormFieldValueCompareComponent,

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
  ContactsViewComponent,
  PriceViewComponent,
  IconViewComponent,
  JsonViewComponent,

  // Other services
  WeatherComponent,
  EmailComponent,
  SmsComponent,
  FaxComponent,

  BusinessComponent
];

export const primaryComponents = [
  AppComponent,
  AuthComponent,
  DashboardComponent,
  MapComponent,
  CalendarComponent,
  RpdPipe,
  Split3Pipe,
  PersianPipe,
  CalendarYearComponent,
  ListComponent,
  StorageComponent,
  StorageFilesComponent,
  FormPartsComponent,
  SyncComponent,
  ChartComponent,
  SafePipe,
  NoteComponent
];

@NgModule({
  declarations: [...primaryComponents, ...dynamicComponents],
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
