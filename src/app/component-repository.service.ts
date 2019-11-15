import { Injectable } from "@angular/core";
import { AccountPasswordComponent } from "./account/account-password/account-password.component";
import { AccountProfileComponent } from "./account/account-profile/account-profile.component";
import { AccountSessionsComponent } from "./account/account-sessions/account-sessions.component";
import { FormDialogComponent } from "./base/form/form-dialog/form-dialog.component";
import { FormComponent } from "./base/form/form.component";
import { ReportComponent } from "./base/report/report.component";
import { TriggersComponent } from "./base/triggers/triggers.component";
import { BusinessComponent } from "./business/business.component";
import { HelpComponent } from "./help/help.component";
import { ImportComponent } from "./import/import.component";
import { ConnectDatabaseComponent } from "./wizard/connect-database/connect-database.component";
@Injectable({
  providedIn: "root"
})
export class ComponentRepositoryService {
  constructor() {}
  dynamicComponents = {
    FormComponent,
    ReportComponent,
    BusinessComponent,
    TriggersComponent,
    AccountProfileComponent,
    AccountPasswordComponent,
    AccountSessionsComponent,
    ImportComponent,
    FormDialogComponent,
    HelpComponent,
    ConnectDatabaseComponent
  };
}
