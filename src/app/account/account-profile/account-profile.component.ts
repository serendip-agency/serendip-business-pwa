import { DataService } from "src/app/data.service";
import { Component, OnInit } from "@angular/core";
import { ProfileModel } from "serendip-business-model";
import { AuthService } from "src/app/auth.service";

@Component({
  selector: "app-account-profle",
  templateUrl: "./account-profile.component.html",
  styleUrls: ["./account-profile.component.css"]
})
export class AccountProfileComponent implements OnInit {
  constructor(
    public dataService: DataService,
    private authService: AuthService
  ) {}

  async refresh() {}

  async ngOnInit() {}

  async save() {
    this.dataService.profile.userId = (await this.authService.token()).userId;
    await this.dataService.update("_profile", this.dataService.profile);
  }
  handleParams(): any {}

  fileChanged(event, property, resizeWidth?) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      const img = document.createElement("img");
      const type = "image/jpeg";
      const quality = 0.92;

      resizeWidth = resizeWidth || 768;

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

        const toPatch = {};

        toPatch[property] = resizedDataUrl;

        this.dataService.profile[property] = resizedDataUrl;

        //    this.userForm.patchValue(toPatch);
      };
      reader.onload = (e: any) => {
        img.src = e.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }
}
