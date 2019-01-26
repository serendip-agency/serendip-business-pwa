import { Injectable } from "@angular/core";
import { Subject, Subscription, Observable } from "rxjs";

import { map, filter, scan } from "rxjs/operators";
import { EventEmitter } from "events";
import { EntityModel } from "serendip-business-model";

@Injectable({
  providedIn: "root"
})
export class ObService {
  private eventEmitter: EventEmitter = new EventEmitter();
  public listen(
    channel: string
  ): Observable<{
    eventType: "insert" | "delete" | "update";
    model: EntityModel;
  }> {
    return new Observable(obServer => {
      this.eventEmitter.on(channel, (eventType, model: EntityModel) => {
        obServer.next({ eventType, model });
      });
    });
  }
  public publish(
    channel: string,
    eventType: "insert" | "delete" | "update",
    model: EntityModel
  ) {
    this.eventEmitter.emit(channel, eventType, model);
  }
}
