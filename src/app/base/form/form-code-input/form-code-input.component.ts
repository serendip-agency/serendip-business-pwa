import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import * as _ from "underscore";
import CodeFlask from "codeflask";

@Component({
  selector: "app-form-code-input",
  templateUrl: "./form-code-input.component.html",
  styleUrls: ["./form-code-input.component.less"]
})
export class FormCodeInputComponent implements OnInit {
  selector = "code-input-" + _.random(1000) + "-" + Date.now();

  @Input() language = "js";

  flask: any;
  constructor(private changeRef: ChangeDetectorRef) {}

  ngOnInit() {
    setTimeout(() => {
      this.flask = new CodeFlask("#" + this.selector, {
        language: this.language,
        lineNumbers: true
      });

      this.flask.updateCode(`
      (modules) => async (r) => {
        const _ = modules._;
        r.data = _.groupBy(r.data, p => p.gender);
  
        console.log(r.data);
  
        r.data["n/a"] = [...r.data[""], ...r.data["undefined"]];
        delete r.data[""];
        delete r.data["undefined"];
  
        r.data = Object.keys(r.data).map(p => {
          return { name: p, value: r.data[p].length, data: r.data[p] };
        });
  
        r.fields = [
          { label: "جنسیت", name: "name", enabled: true },
          { label: "تعداد", name: "value", enabled: true }
        ];
  
        r.count = r.data.length;
  
        return r;
      };
      `);
    }, 1000);
  }
}
