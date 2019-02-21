import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/data.service";

@Component({
  selector: "app-account-password",
  templateUrl: "./account-password.component.html",
  styleUrls: ["./account-password.component.css"]
})
export class AccountPasswordComponent implements OnInit {
  model = {
    password: "",
    passwordConfirm: ""
  };
  message: string;
  constructor(private dataService: DataService) {}

  async save() {
    await this.dataService.request({
      path: "/api/auth/changePassword",
      model: this.model,
      method: "post"
    });

    this.model = {
      password: "",
      passwordConfirm: ""
    };

    this.message = "پسورد جدید با موفقیت ثبت شد.";
  }

  ngOnInit() {}
}
