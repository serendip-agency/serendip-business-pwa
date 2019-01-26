import { Injectable } from "@angular/core";
import { Subject, Subscription, Observable } from "rxjs";

import { map, filter, scan } from "rxjs/operators";
import { EventEmitter } from "events";
import { EntityModel } from "serendip-business-model";

/** The subject type, wrapping a channel, the message payload and optional targets */
export interface Message {
  /** Channels are identified by type */
  channel: Function;

  /** The message payload. This is an instance of the channel type */
  payload: any;

  /**
   * Optional list of targets for this message. If not set, all channel subscribers gets the message.
   * Multiple components can use the same target id */
  targets?: string[];
}

// Note that typeof === 'function' here
export interface Newable<T> {
  new (...args: any[]): T;
}

export class ListenParams<T> {
  type: Newable<T> = null;
  targets: string[] = [];
}

@Injectable({
  providedIn: "root"
})
export class ObService {
  private eventEmitter: EventEmitter = new EventEmitter();
  public listen<T>(
    channel: string
  ): Observable<{ eventType: "create" | "delete" | "update"; model: T }> {
    return new Observable(obServer => {
      this.eventEmitter.on(channel, (eventType, model: T) => {
        obServer.next({ eventType, model });
      });
    });
  }
  public publish<T>(
    channel: string,
    eventType: "insert" | "delete" | "update",
    model: EntityModel
  ) {
    this.eventEmitter.emit(channel, eventType, model);
  }
}
