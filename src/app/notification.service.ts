import { Injectable } from "@angular/core";
import { ObService } from "./ob.service";
import { EntityModel } from "serendip-business-model";
import { DataService } from "./data.service";
import { AuthService } from "./auth.service";
import { MatSnackBar } from "@angular/material";

@Injectable({
  providedIn: "root"
})
export class NotificationService {
  localCacheKey = "cache_notification_latest";
  _latest: any[];

  get latest() {
    return this._latest || JSON.parse(localStorage.getItem(this.localCacheKey));
  }

  set latest(input: any[]) {
    this._latest = input;

    localStorage.setItem(this.localCacheKey, JSON.stringify(input));
  }

  constructor(
    private obService: ObService,
    private authService: AuthService,
    private dataService: DataService,
    private snackBar: MatSnackBar
  ) {
    (async () => {
      const token = await this.authService.token();

      this.obService.listen("_notification").subscribe(msg => {
        if (msg.model.userId === token.userId) {
          if (msg.model.flash) {
            this.snackBar.open(msg.model.text, "OK", {
              duration: 1000
            });
          } else {
            this._latest.unshift(msg.model);
            if (this._latest.length > 10) this._latest.pop();
          }
        }
      });

      this.latest = await this.dataService.aggregate("_notification", [
        {
          $match: {
            viewed: false,
            userId: token.userId,
            flash: false
          }
        },
        {
          $sort: {
            _cdate: -1
          }
        },
        {
          $limit: 10
        }
      ]);
    })()
      .then(() => {})
      .catch(console.warn);
  }
}
