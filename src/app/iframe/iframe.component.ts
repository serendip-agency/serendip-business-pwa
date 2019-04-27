import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.css']
})
export class IframeComponent implements OnInit {



  private _url: string;
  public get url(): string {
    return this._url;
  }
  @Input()
  public set url(v: string) {

    if (v !== this._url) {
      this._url = v;
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this._url);
      this.ref.detectChanges();
    }
  }

  safeUrl;
  constructor(private sanitizer: DomSanitizer, private ref: ChangeDetectorRef) { }

  ngOnInit() {



    this.ref.detach();
  }

}
