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
  constructor(private dataService: DataService) { }

  async save() {

    try {
      await this.dataService.request({
        path: "/api/auth/changePassword",
        model: this.model,
        method: "post"
      });

      this.message = "پسورد جدید با موفقیت ثبت شد";

    } catch (error) {

      if (error.status == 400) {
        this.message = "ورودی‌ها را بازبینی کنید";
      } else if (error.status == 500) {
        this.message = "خطای سرور";
      } else {
        this.message = "ارتباط با سرور برقرار نشد";
      }

    }


    this.model = {
      password: "",
      passwordConfirm: ""
    };

  }

  ngOnInit() { }
}
