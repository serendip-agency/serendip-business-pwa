import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { TokenModel } from "serendip-business-model";

import { AuthService } from "../auth.service";
import { BusinessService } from "../business.service";
import { DashboardService } from "../dashboard.service";
import { DataService } from "../data.service";

import * as aesjs from "aes-js";
import * as sUtil from "serendip-utility";

import * as _ from "underscore";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-business",
  templateUrl: "./business.component.html",
  styleUrls: ["./business.component.less"]
})
export class BusinessComponent implements OnInit, OnDestroy {
  tab = "new";

  model = { title: "" };
  routerSubscription: Subscription;
  rsaKeyHexToImport;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  list: any[] = [];
  token: TokenModel;
  businessesToSelect = [];

  memberToAdd = { mobile: "", code: "+98" };

  businessModel = {};

  currentBusiness = null;
  loading = true;
  lastListReq = 0;
  offline: boolean;
  rsaKeyHex: string;
  rsaPublicKey: any;
  RsaKey: string;
  rsaKeyHexToImportValidated = false;
  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public businessService: BusinessService,
    public dashboardService: DashboardService,
    private snackBar: MatSnackBar,
    public dataService: DataService
  ) {}

  validateHexToImport(keyArea) {
    const rsaHex = keyArea.value;

    const decodedHex = aesjs.utils.utf8.fromBytes(
      aesjs.utils.hex.toBytes(rsaHex)
    );

    try {
    } catch (error) {}
    const rsaKey = window.cryptico.RSAKey.parse(decodedHex);

    console.log(
      window.cryptico.publicKeyString(rsaKey),
      this.businessService.business.publicKey
    );
    this.rsaKeyHexToImportValidated =
      window.cryptico.publicKeyString(rsaKey) ===
      this.businessService.business.publicKey;
  }

  uploadKey(fileInput, keyArea) {
    const reader = new FileReader();
    reader.onload = event => {
      keyArea.value = reader.result.toString().replace(/\n/g, "");
      this.validateHexToImport(keyArea);
    };

    reader.readAsText(fileInput.files[0]);
  }

  addMember() {
    this.loading = true;

    this.dataService
      .request({
        method: "POST",
        path: "/api/business/addMember",
        model: {
          mobile: this.memberToAdd.mobile,
          mobileCountryCode: this.memberToAdd.code
        }
      })
      .then(async res => {
        this.snackBar.open("کاربر جدید اضافه شد!", "", { duration: 3000 });

        await this.dataService.loadBusiness();
        this.memberToAdd = { code: "+98", mobile: "" };
        this.loading = false;
      })
      .catch(res => {
        if (res.error) {
          if (res.error.description === "duplicate") {
            this.snackBar.open(
              "این کاربر قبلا به کسب‌وکار اضافه شده است!",
              "",
              { duration: 3000 }
            );
          } else {
            if (res.status === 400) {
              return this.snackBar.open("موبایل و کد رو بازبینی کنید!", "", {
                duration: 3000
              });
            }

            if (res.status === 0) {
              return this.snackBar.open("اتصال شبکه شما قطع است!", "", {
                duration: 3000
              });
            } else {
              return this.snackBar.open("لطفا لحظاتی دیگر تلاش کنید!", "", {
                duration: 3000
              });
            }
          }
        }
        this.loading = false;
      });
  }

  choose(id) {
    localStorage.setItem("businessId", id);
    this.router.navigate([environment.default]);
  }

  async savePrivateKey(keyArea) {
    localStorage.setItem(
      "rsa",
      aesjs.utils.utf8.fromBytes(aesjs.utils.hex.toBytes(keyArea.value))
    );
    this.router.navigate([environment.default]);
  }
  async savePublicKey() {
    await this.dataService.loadBusiness();

    this.businessService.business = _.extend(this.businessService.business, {
      publicKey: this.rsaPublicKey
    });

    localStorage.setItem("rsa", this.RsaKey);

    await this.dataService.request({
      method: "POST",
      model: this.businessService.business,
      path: "/api/business/save",
      retry: false
    });

    this.router.navigate([environment.default]);
  }

  async updateBusiness() {
    await this.dataService.request({
      method: "POST",
      model: this.businessService.business,
      path: "/api/business/save",
      retry: false
    });
  }
  async saveBusiness() {
    await this.dataService.request({
      method: "POST",
      model: this.model,
      path: "/api/business/save",
      retry: false
    });

    this.router.navigate(["/business", "list"]);
  }

  sleep() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }
  async refresh() {
    this.loading = true;

    if ((this.tab === "new" && this.list.length === 0) || this.tab === "list") {
      if (Date.now() - this.lastListReq > 500) {
        this.lastListReq = Date.now();
        try {
          this.list = await this.dataService.request({
            method: "get",
            retry: false,
            path: "/api/business/list"
          });

          this.offline = false;
          this.loading = false;
        } catch (error) {
          this.offline = true;
          this.loading = false;
        }
      }
    }

    // await this.sleep();

    if (this.list && this.list.map) {
      this.businessesToSelect = this.list.map(item => {
        return { label: item.title, value: item._id };
      });
    }
  }
  async handleParams() {
    this.tab = this.activatedRoute.snapshot.params.tab || "list";

    await this.refresh();

    if (!this.offline && this.tab === "list" && this.list.length === 0) {
      this.router.navigate(["/business", "new"]);
    }

    if (this.tab === "encryption") {
      const rsaKey = window.cryptico.generateRSAKey(
        sUtil.text.randomAsciiString(256),
        1024
      );

      this.RsaKey = JSON.stringify(rsaKey.toJSON());

      this.rsaKeyHex = aesjs.utils.hex.fromBytes(
        aesjs.utils.utf8.toBytes(this.RsaKey)
      );

      this.rsaPublicKey = window.cryptico.publicKeyString(rsaKey);
    }

    this.loading = false;

    // if (this.tab === "choose") {
    //   if (this.list.length === 1) {
    //     localStorage.setItem("business", this.list[0]._id);
    //   }
    // }
  }
  ngOnDestroy() {
    if (this.routerSubscription && this.routerSubscription.unsubscribe) {
      this.routerSubscription.unsubscribe();
    }
  }
  downloadRsaKey() {
    this.dataService.triggerBrowserDownload(
      "data:text/plain;charset=utf-8," +
        this.rsaKeyHex.split("").reduce((prev, current, index) => {
          return prev + current + ((index + 1) % 40 === 0 ? "\n" : "");
        }),
      "business-key-کلید-کسب‌‌وکار-" +
        this.businessService.business.title +
        ".txt"
    );
  }
  async logout() {
    await this.authService.logout();

    this.router.navigate(["/auth", "login"]);
  }
  logoChanged(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      const img = document.createElement("img");
      const type = "image/jpeg";
      const quality = 0.92;

      const resizeWidth = 256;

      img.onload = () => {
        const oc = document.createElement("canvas"),
          octx = oc.getContext("2d");
        oc.width = img.width;
        oc.height = img.height;
        octx.drawImage(img, 0, 0);
        while (oc.width * 0.5 > resizeWidth) {
          oc.width *= 0.5;
          oc.height *= 0.5;
          octx.drawImage(oc, 0, 0, oc.width, oc.height);
        }

        oc.width = resizeWidth;
        oc.height = (oc.width * img.height) / img.width;
        octx.drawImage(img, 0, 0, oc.width, oc.height);

        const resizedDataUrl = oc.toDataURL(type, quality);

        // setting resized base64 to object property

        this.businessService.business.logo = resizedDataUrl;

        //    this.userForm.patchValue(toPatch);
      };
      reader.onload = (e: any) => {
        img.src = e.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }
  async ngOnInit() {
    try {
      this.token = await this.authService.token();

      if (this.router.url.indexOf("/business") !== -1) {
        await this.handleParams();
        this.routerSubscription = this.routerSubscription = this.router.events.subscribe(
          (event: any) => {
            if (event instanceof NavigationEnd) {
              this.handleParams();
            }
          }
        );
      } else {
        await this.refresh();
      }
    } catch (error) {
      this.router.navigate(["/auth"]);
    }

    this.loading = false;
  }

  /**
   * get default business
   */
  // async business(): Promise<any> {

  //   const token = await this.authService.token();

  //   const businessList = await this.http
  //     .get<any>(environment.api + "/api/business/manage/list", {
  //       headers: {
  //         Authorization: "Bearer " + token.access_token,
  //         clientid: environment.clientId
  //       }
  //     })
  //     .toPromise();

  //   if (businessList.length > 0) {
  //     localStorage.setItem("business", JSON.stringify(businessList[0]));
  //     return businessList[0];
  //   } else { return null; }
  // }
}
