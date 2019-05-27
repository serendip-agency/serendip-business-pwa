import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from "@angular/core";
import { DataService } from "src/app/data.service";
import { EntityModel } from "serendip-business-model";
@Component({
  selector: "app-entity-webhook-view",
  templateUrl: "./entity-webhook-view.component.html",
  styleUrls: ["./entity-webhook-view.component.less"]
})
export class EntityWebhookViewComponent implements OnInit {
  @Input() model: any;
  @Input() record: EntityModel;
  @Input() label: any;
  @Input() viewType: string;
  constructor(
    private changeRef: ChangeDetectorRef,
    public dataService: DataService
  ) {}

  async refresh() {
    await this.dataService.request({
      method: "post",
      path: "/api/hooks/refresh",
      model: {
        entityName: this.record.name
      }
    });
  }

  ngOnInit() {}
}
