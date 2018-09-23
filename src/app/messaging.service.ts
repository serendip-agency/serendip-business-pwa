import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { map, filter, scan } from 'rxjs/operators';


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
export interface Newable<T> { new(...args: any[]): T; }

export class ListenParams<T> {
  type: Newable<T> = null;
  targets: string[] = [];
}

@Injectable({
  providedIn: 'root'
})
export class MessagingService {


  private messageSubject: Subject<Message>;

  constructor() {
    this.messageSubject = new Subject<Message>();
  }

  public publish<T>(msg: T, targets: string[] = []): void {
    this.messageSubject.next({ 'channel': msg.constructor, 'payload': msg, 'targets': targets });
  }

  public listen<T>(params: ListenParams<T> | Newable<T>, next: (value: T) => void) {
    if (typeof params === 'object') {
      return this.channelImpl(params.type, params.targets, next);
    } else {
      return this.channelImpl(params, [], next);
    }
  }

  private channelImpl<T>(msgType: { new(...args: any[]): T }, targets: string[], next: (value: T) => void): Subscription {
    const channel = msgType;
    return this.messageSubject.pipe(
      filter((message) => message.channel === channel && this.validTarget(message.targets, targets)),
      map((message) => message.payload)
    ).subscribe(next);
  }

  private validTarget(messageTargets: string[], subscribedTargets: string[]): boolean {
    if (messageTargets.length === 0) { return true; }
    return subscribedTargets.some(function (v) { return messageTargets.indexOf(v) >= 0; });
  }
}
