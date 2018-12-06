import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-form-price-input",
  templateUrl: "./form-price-input.component.html",
  styleUrls: ["./form-price-input.component.css"]
})
export class FormPriceInputComponent implements OnInit {
  constructor() {}

  currencyOptions = {};
  @Input() currencies = {
    dollar: {
      align: "right",
      allowNegative: false,
      allowZero: true,
      decimal: ",",
      precision: 2,
      prefix: "$ ",
      suffix: "",
      thousands: ".",
      nullable: true
    },
    rial: {
      align: "right",
      allowNegative: false,
      allowZero: true,
      precision: 0,
      prefix: "﷼ ",
      suffix: "",
      thousands: "،",
      nullable: true
    },
    toman: {
      align: "right",
      allowNegative: false,
      allowZero: true,
      precision: 0,
      prefix: "تومان ",
      suffix: "",
      thousands: "،",
      nullable: true
    },
    euro: {
      align: "right",
      allowNegative: false,
      allowZero: true,
      decimal: ",",
      precision: 2,
      prefix: "€ ",
      suffix: "",
      thousands: ".",
      nullable: true
    }
  };
  @Input() currencyLabels = [
    { label: "ریال", value: "rial" },
    { label: "تومان", value: "toman" },
    { label: "یورو", value: "euro" },
    { label: "دلار", value: "dollar" }
  ];
  @Output() modelChange = new EventEmitter();
  @Input() label: string;
  @Input() _model: any = { type: "toman", value: null };

  @Input()
  set model(value: any) {
    if (value) { this._model = value; }
    else {
      this._model = { type: "toman", value: null};
    }
  }

  get model(): any {
    return this._model;
  }


  ngOnInit() {
    if (this.model && this.model.type) {
      this.currencyOptions = this.currencies[this.model.type];
    }

    this.modelChange.emit(this.model);
  }
}
