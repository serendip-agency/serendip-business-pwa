import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  EventEmitter,
  Output
} from "@angular/core";
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

  @Output() modelChange = new EventEmitter<any>();

  flask: any;
  private _model: string;

  @Input() set model(value: string) {
    this._model = value;
  }

  get model(): string {
    return this._model;
  }

  constructor(private changeRef: ChangeDetectorRef) {}

  cleanCodeSpaces(input: string) {
    const result = [];
    input = input.toString().replace(/^\s*$(?:\r\n?|\n)/gm, "");

    let spacesToRemoveForIndenting = 0;

    for (const line of input.split(/\n/)) {
      if (line.trim()) {
        if (!spacesToRemoveForIndenting) {
          spacesToRemoveForIndenting = line.match(/^(\s){0,}/)[0].length;
        }

        result.push(
          line.replace(new RegExp(`^(\\s){${spacesToRemoveForIndenting}}`), "")
        );
      }
    }

    return result.join("\n");
  }
  ngOnInit() {
    if (typeof this.model !== "string") {
      try {
        this.model = JSON.stringify(this.model, null, 2);
      } catch (error) {}
    }
    requestAnimationFrame(() => {
      this.flask = new CodeFlask("#" + this.selector, {
        language: this.language,
        lineNumbers: true
      });

      this.flask.onUpdate(code => {
        this.modelChange.emit(code);
      });

      this.flask.updateCode(this.cleanCodeSpaces(this.model));
    });
    //  }, 1000);
  }
}
