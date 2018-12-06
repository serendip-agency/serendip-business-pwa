import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from "@angular/core";

@Component({
  selector: "app-price-view",
  templateUrl: "./price-view.component.html",
  styleUrls: ["./price-view.component.less"]
})
export class PriceViewComponent implements OnInit {
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
  @Input() model: any;
  @Input() label: any;
  @Input() viewType: string;

  constructor(private changeRef: ChangeDetectorRef) {}

  ngOnInit() {

  }
}
