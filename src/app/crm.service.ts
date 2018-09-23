import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class CrmService {
  constructor() {}

  getActiveCrmId() {
    return localStorage.getItem("crm");
  }

}
