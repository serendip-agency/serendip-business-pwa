import { BusinessService } from "./business.service";
import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";

export interface userToken {
  // Request
  grant_type?: string;
  username?: string;
  useragent?: string;
  userId?: string;
  // Response
  token_type?: string;
  expires_in?: number;
  expires_at?: number;
  refresh_token?: string;
  access_token?: string;
  groups?: string[];
}

@Injectable()
export class AuthService {
  profileValid = false;

  logout(): void {
    localStorage.clear();
    window.location.reload();
  }

  loggedIn = false;
  apiUrl: string;
  http: HttpClient;
  router: Router;
  profile: any = {};

  constructor(private _http: HttpClient, private _router: Router) {
    this.router = _router;

    this.http = _http;
    this.apiUrl = environment.api;
  }

  async token(): Promise<userToken> {
    let token: userToken = { groups: [] };
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
      .post<userToken>(this.apiUrl + "/api/auth/register", {
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

  async login(username: string, password: string): Promise<userToken> {
    const newToken = await this.http
      .post<userToken>(this.apiUrl + "/api/auth/token", {
        username: username,
        password: password,
        grant_type: "password"
      })
      .toPromise();

    this.loggedIn = true;

    localStorage.setItem("token", JSON.stringify(newToken));

    this.router.navigate(["/dashboard"]);

    return newToken;
  }

  async refreshToken(token: userToken): Promise<userToken> {
    try {
      const newToken = await this.http
        .post<userToken>(this.apiUrl + "/api/auth/refreshToken", {
          refresh_token: token.refresh_token,
          access_token: token.access_token
        })
        .toPromise();

      localStorage.setItem("token", JSON.stringify(newToken));
      return newToken;
    } catch (error) {
      return null;
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private businessService: BusinessService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const url: string = state.url;

    if (this.authService.loggedIn && this.businessService.getActiveBusinessId()) {
      return true;
    } else {
      if (!this.authService.loggedIn) {
        // Store the attempted URL for redirecting
        localStorage.setItem("lastUrl", url);
        // Navigate to the login page with extras
        this.router.navigate(["/auth", "login"]);
        return false;
      }

      if (!this.businessService.getActiveBusinessId()) {
        // Navigate to the login page with extras
        this.router.navigate(["/business"]);
        return false;
      }
    }
  }
}
