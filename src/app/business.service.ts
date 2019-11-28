import { Injectable } from "@angular/core";
import { BusinessModel } from "serendip-business-model";
import { ObService } from "./ob.service";
import { MatSnackBar } from "@angular/material";

@Injectable({
  providedIn: "root"
})
export class BusinessService {
  _business: BusinessModel;

  get business(): BusinessModel {
    if (this._business) {
      return this._business;
    } else if (localStorage.getItem("business")) {
      try {
        return JSON.parse(localStorage.getItem("business"));
      } catch (error) {
        localStorage.removeItem("business");
        return undefined;
      }
    }
  }
  set business(val) {
    this._business = val;
    localStorage.setItem("business", JSON.stringify(val));
  }

  private _privateKey;
  public get privateKey() {
    if (this._privateKey) {
      return this._privateKey;
    }

    if (localStorage.getItem("rsa")) {
      this._privateKey = window.cryptico.RSAKey.parse(
        localStorage.getItem("rsa")
      );
    }

    return this._privateKey;
  }

  constructor(private obService: ObService, private snackBar: MatSnackBar) {
    this.obService.listen("_business").subscribe(msg => {
      this.snackBar.open("Business info updated !", "ok", {
        duration: 1000
      });
    });
  }

  getActiveBusinessId() {
    const business = localStorage.getItem("businessId");

    if (
      typeof business !== "undefined" &&
      business !== "null" &&
      business !== "undefined"
    ) {
      return business;
    } else {
      return undefined;
    }
  }
}
