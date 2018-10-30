import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class BusinessService {
  constructor() {}

  getActiveBusinessId() {
    return localStorage.getItem("business");
  }

}
