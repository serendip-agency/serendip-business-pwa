import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class BusinessService {
  constructor() {}

  getActiveBusinessId() {
    var business = localStorage.getItem("business");

    if (typeof business !== "undefined" && business !== "undefined") {
      return business;
    } else return undefined;
  }
}
