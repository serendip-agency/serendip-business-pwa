import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import { TokenModel } from "serendip-business-model";

import { BusinessService } from "./business.service";
import { IdbDeleteAllDatabases } from "./idb.service";
import { environment } from "src/environments/environment";
import { querystring } from 'serendip-utility';

@Injectable()
export class AuthService {
  profileValid = false;

  loggedIn = false;
  _apiUrl: string;
  qs: any;

  get apiUrl() {
    return localStorage.server;
  }

  profile: any = {};

  constructor(private http: HttpClient, private router: Router) {



  }
  async logout() {
    localStorage.clear();
    await IdbDeleteAllDatabases();
    window.location.reload();
  }
  async token(): Promise<TokenModel> {
    let token: TokenModel;
    if (localStorage.getItem("token")) {
      token = JSON.parse(localStorage.getItem("token"));
    }

    if (token) {
      if (token.expires_at - Date.now() < 60000) {
        token = await this.refreshToken(token);
      }
    }

    if (!token) {
      localStorage.removeItem("token");
    }

    // console.log('token()',token);

    if (token && token.access_token) {
      this.loggedIn = true;
      return token;
    } else {
      this.loggedIn = false;
      throw new Error("cant get token");
    }
  }

  async register(mobile: string, password: string): Promise<any> {
    return this.http
      .post<TokenModel>(this.apiUrl + "/api/auth/register", {
        username: mobile,
        mobile: mobile,
        password: password
      })
      .toPromise();
  }

  async sendVerify(mobile: string): Promise<any> {
    return this.http
      .post(this.apiUrl + "/api/auth/sendVerifySms", {
        mobile: mobile
      })
      .toPromise();
  }

  async sendOneTimePassword(
    mobile: string,
    mobileCountryCode: string,
    timeout?: number
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject({ status: 0 });
      }, timeout || 3000);

      this.http
        .post(this.apiUrl + "/api/auth/oneTimePassword", {
          mobile,
          mobileCountryCode
        })
        .toPromise()
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  async sendResetPasswordToken(mobile: string): Promise<any> {
    return this.http
      .post(this.apiUrl + "/api/auth/sendResetPasswordToken", {
        mobile: mobile
      })
      .toPromise();
  }

  async verifyMobile(mobile: string, code: string): Promise<any> {
    return this.http
      .post(this.apiUrl + "/api/auth/verifyMobile", {
        mobile: mobile,
        code: code
      })
      .toPromise();
  }

  async resetPassword(
    mobile: string,
    code: string,
    password: string,
    passwordConfirm: string
  ): Promise<any> {
    return this.http
      .post(this.apiUrl + "/api/auth/resetPassword", {
        mobile: mobile,
        code: code,
        password: password,
        passwordConfirm: passwordConfirm
      })
      .toPromise();
  }

  async login(
    username: string,
    mobile: string,
    password: string,
    oneTimePassword: string
  ): Promise<TokenModel> {
    console.log(this.apiUrl);
    const newToken = await this.http
      .post<TokenModel>(this.apiUrl + "/api/auth/token", {
        username,
        mobile,
        password,
        oneTimePassword,
        grant_type: "password"
      })
      .toPromise();

    if (!newToken) {
      throw new Error("empty token");
    }

    // console.log("newToken", newToken);

    this.loggedIn = true;

    localStorage.setItem("token", JSON.stringify(newToken));

    return newToken;
  }

  async refreshToken(token: TokenModel): Promise<TokenModel> {
    try {
      const newToken = await this.http
        .post<TokenModel>(this.apiUrl + "/api/auth/refreshToken", {
          refresh_token: token.refresh_token,
          access_token: token.access_token
        })
        .toPromise();

      localStorage.setItem("token", JSON.stringify(newToken));
      return newToken;
    } catch (res) {
      if (res.status === 401 || res.status === 400) {
        this.logout();
      } else {
        return token;
      }
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private businessService: BusinessService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const url: string = state.url;

    if (this.authService.loggedIn) {
      return true;
    } else {
      // Store the attempted URL for redirecting
      localStorage.setItem("lastUrl", url);
      // Navigate to the login page with extras
      this.router.navigate(['/auth', 'login']);
    }
  }
}
