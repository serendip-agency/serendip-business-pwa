import { Injectable } from "@angular/core";
import { BusinessModel } from "serendip-business-model";

@Injectable({
  providedIn: "root"
})
export class BusinessService {
  _business: BusinessModel;

  get business(): BusinessModel {
    if (this._business) {
      return this._business;
    } else if (localStorage.getItem("businessModel")) {
      return JSON.parse(localStorage.getItem("businessModel"));
    }
  }

  set business(val) {
    this._business = val;
    localStorage.setItem("businessModel", JSON.stringify(val));
  }
  constructor() {}

  getActiveBusinessId() {
    const business = localStorage.getItem("business");

    if (typeof business !== "undefined" && business !== "undefined") {
      return business;
    } else {
      return undefined;
    }
  }
}
