import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { AuthService, userToken } from "../auth.service";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "../data.service";
import * as _ from "underscore";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.less"]
})
export class AuthComponent implements OnInit {
  serversToSelect = [
    { label: "سرور ایران", value: "https://serendip.ir" },
    { label: "سرور ابری آلمان", value: "https://serendip.cloud" },
    { label: "سرور ابری لیارا", value: "https://serendip.liara.run" },
    { label: "سرور باکس سرندیپ", value: "box" },
    { label: "سرور توسعه کلاد", value: "http://dev.serendip.cloud:2040" },
    { label: "سرور توسعه محلی", value: "http://localhost:2040" }
  ];
  loading = false;
  tab = "login";
  model: any = {};

  day = true;
  username: string;
  activationMessage: string;

  message: string;
  messageTimeout: any;
  token: userToken;
  profile: any;

  states: any[] = [];
  cities: any[] = [];

  replacePersianDigits(input) {
    if (!input) {
      input = "";
    }
    const map = [
      "&#1632;",
      "&#1633;",
      "&#1634;",
      "&#1635;",
      "&#1636;",
      "&#1637;",
      "&#1638;",
      "&#1639;",
      "&#1640;",
      "&#1641;"
    ];

    return this.sanitizer.bypassSecurityTrustHtml(
      input.toString().replace(/\d(?=[^<>]*(<|$))/g, function($0) {
        return map[$0];
      })
    );
  }
  constructor(
    public snackBar: MatSnackBar,
    public router: Router,
    public authService: AuthService,
    public activatedRoute: ActivatedRoute,
    public ref: ChangeDetectorRef,
    public dataService: DataService,
    public sanitizer: DomSanitizer
  ) {}

  async login(mode?: string) {
    if (mode === "user-pass") {
      this.model.oneTimePassword = this.model.password;
    }

    try {
      this.loading = true;
      await this.authService.login(
        this.model.username,
        this.model.mobile,
        this.model.password,
        this.model.oneTimePassword
      );

      if (localStorage.getItem("lastUrl")) {
        const url = localStorage.getItem("lastUrl");

        localStorage.removeItem("lastUrl");
        this.router.navigateByUrl(url);
      } else {
        this.router.navigateByUrl("/");
      }
    } catch (error) {
      console.log(error);

      switch (error.status) {
        case 0:
          this.showMessage("ارتباط شما با سرور یا اینترنت قطع است.");
          break;
        case 400:
          this.showMessage("شماره موبایل یا رمز عبور وارد شده اشتباه است.");
          break;
        case 403:
          this.showMessage("حساب کاربری خود را فعال کنید.");
          break;
        default:
          this.showMessage("سرور قادر به پاسخگویی نیست لطفا دوباره تلاش کنید.");
          break;
      }
    }

    this.loading = false;
  }

  removeMobileZero() {
    if (typeof this.model.mobile !== "undefined") {
      this.model.mobile = this.model.mobile.replace(/^0/, "").replace(/ /, "");
    }
  }
  async sleep(timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  }
  async sendOneTimePassword() {
    if (this.model.mobile) {
      this.loading = true;
      //   await this.sleep(3000);
      try {
        await this.authService.sendOneTimePassword(this.model.mobile);
        this.router.navigate(["/auth", "code"]);
      } catch (error) {
        switch (error.status) {
          case 0:
            this.showMessage("ارتباط شما با سرور یا اینترنت قطع است.");
            break;
          case 400:
            this.showMessage("فیلدهای ورودی را بازبینی کنید.");
            break;
          default:
            this.showMessage(
              "سرور قادر به پاسخگویی نیست لطفا دوباره تلاش کنید."
            );
            break;
        }
      }
      this.loading = false;
    }
  }

  async changepw(model) {
    if (model.password.length < 8) {
      return this.showMessage("حداقل طول رمز عبور 8 کارکتر میباشد.");
    }
    if (model.password !== model.passwordConfirm) {
      return this.showMessage("رمز عبور و تکرار آن یکی نیستند.");
    }

    try {
      this.loading = true;
      await this.dataService.request({
        method: "POST",
        model: model,
        path: "/api/auth/changePassword",
        retry: false
      });
      this.loading = false;

      this.showMessage("رمز شما تغییر یافت");
    } catch (error) {
      switch (error.status) {
        case 0:
          this.showMessage("ارتباط شما با سرور یا اینترنت قطع است.");
          break;
        case 400:
          this.showMessage("فیلدهای ورودی را بازبینی کنید.");
          break;
        default:
          this.showMessage("سرور قادر به پاسخگویی نیست لطفا دوباره تلاش کنید.");
          break;
      }
      this.loading = false;
    }
  }

  async resetPassword(model) {
    try {
      this.loading = true;
      await this.authService.resetPassword(
        model.mobile,
        model.code,
        model.password,
        model.passwordConfirm
      );
      this.loading = false;

      model.username = model.mobile;

      this.showMessage("رمز شما با موفقیت تعییر یافت. درحال ورود به سیستم ...");

      setTimeout(() => {
        this.login();
      }, 3000);
    } catch (error) {
      this.showMessage("شماره موبایل یا کد وارد شده اشتباه است .");
    }
  }

  async sendResetPasswordToken(model) {
    try {
      this.loading = true;
      await this.authService.sendResetPasswordToken(model.mobile);

      this.tab = "reset";
    } catch (error) {
      switch (error.status) {
        case 0:
          this.showMessage("ارتباط شما با سرور یا اینترنت قطع است.");
          break;
        case 400:
          this.showMessage("شماره موبایل یا کد وارد شده اشتباه است.");
          break;
        default:
          this.showMessage("سرور قادر به پاسخگویی نیست لطفا دوباره تلاش کنید.");
          break;
      }
    }

    this.loading = false;
  }

  async activate(model) {
    try {
      this.loading = true;
      await this.authService.verifyMobile(model.mobile, model.code);
      this.tab = "login";
      this.showMessage("حساب شما فعال شد.وارد اکانت خود شوید.");
    } catch (error) {
      switch (error.status) {
        case 0:
          this.showMessage("ارتباط شما با سرور یا اینترنت قطع است.");
          break;
        case 400:
          this.showMessage("شماره موبایل یا کد وارد شده اشتباه است.");
          break;
        default:
          this.showMessage("سرور قادر به پاسخگویی نیست لطفا دوباره تلاش کنید.");
          break;
      }
    }

    this.loading = false;
  }

  async sendVerify(model) {
    try {
      this.loading = true;
      await this.authService.sendVerify(model.mobile);

      this.showMessage("کد تایید ارسال شد.");
      this.loading = false;
    } catch (error) {
      switch (error.status) {
        case 0:
          this.showMessage("ارتباط شما با سرور یا اینترنت قطع است.");
          break;
        case 400:
          this.showMessage("شماره موبایل وارد شده اشتباه است.");
          break;
        default:
          this.showMessage("سرور قادر به پاسخگویی نیست لطفا دوباره تلاش کنید.");
          break;
      }
    }

    this.loading = false;
  }

  showMessage(msg) {
    const snackRef = this.snackBar.open(msg, "بستن", {
      duration: 3000
    });
    snackRef.onAction().subscribe(() => {
      snackRef.dismiss();
    });
  }

  validateLogin(model) {
    if (!model.username || !model.password) {
      return "وارد کردن تمامی فیلد ها الزامیست.";
    }

    return "";
  }

  validateRegister(model) {
    if (
      !model.name ||
      !model.username ||
      !model.password ||
      !model.passwordConfirm
    ) {
      return "وارد کردن تمامی فیلد ها الزامیست.";
    }

    if (
      !model.username.startsWith("09") ||
      // tslint:disable-next-line:radix
      parseInt(model.username).toString().length !== 10
    ) {
      return "شماره موبایل وارد شده معتبر نیست. مثال : 09120129887";
    }

    if (model.password.length < 8) {
      return "حداقل طول رمز عبور 8 کارکتر میباشد.";
    }
    if (model.password !== model.passwordConfirm) {
      return "رمز عبور و تکرار آن یکی نیستند.";
    }

    return "";
  }

  async register(model) {
    this.loading = true;
    this.model.mobile = model.username;
    try {
      await this.authService.register(model.username, model.password);
      //  await this.dataService.post({ name: model.name }, 'profile', 'save', true);
      this.loading = false;

      this.tab = "activate";
      this.ref.detectChanges();
    } catch (errRes) {
      const err = errRes.error;

      if (err.message === "mobile already exists") {
        this.showMessage("شماره وارد شده قبلا ثبت نام شده است.");
      } else if (err.code === 400) {
        this.showMessage("شماره موبایل و رمز وارد شده را بازبینی کنید.");
      }

      if (err.code === 500) {
        this.showMessage("لطفا مجددا تلاش کنید.");
      }

      if (err.code === 0) {
        this.showMessage("لطفا مجددا تلاش کنید.");
      }

      this.loading = false;
    }
  }

  loginWithCode() {}
  logout() {
    this.authService.logout();
    this.router.navigate(["/auth", "login"]);
  }

  handleParams(params) {
    this.tab = params.tab || "login";
  }
  async ngOnInit() {
    try {
      await this.authService.token();
    } catch (error) {}

    this.handleParams(this.activatedRoute.snapshot.params);

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.handleParams(this.activatedRoute.snapshot.params);
      }
    });
    console.log(this.authService.loggedIn);
    if (this.authService.loggedIn) {
      if (localStorage.getItem("lastUrl")) {
        this.router.navigateByUrl(localStorage.getItem("lastUrl"));
      } else {
        this.router.navigateByUrl("/");
      }

      console.log("has valid token no need to login");
    } else {
      if (!this.model.mobile && this.tab !== "user-pass") {
        this.router.navigate(["/auth", "login"]);
      }
    }
  }
}
