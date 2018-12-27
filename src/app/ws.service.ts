import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { environment } from "src/environments/environment";
import { DataService } from "./data.service";

@Injectable({
  providedIn: "root"
})
export class WsService {
  constructor(private authService: AuthService, private dataService: DataService) { }

  async newSocket(
    path?,
    retry?: boolean,
    maxRetry?: number
  ): Promise<WebSocket> {
    if (!path) { path = "/"; }
    let tries = 1;

    if (!maxRetry) {
      maxRetry = 3000;
    }

    return new Promise<WebSocket>((resolve, reject) => {
      this.initiateSocket(path)
        .then(ws => {
          resolve(ws);
        })
        .catch(ev => {
          console.log(`newSocket at ${path} initiate ended with catch`, ev);
          if (retry && maxRetry > 1) {
            console.log(`Trying again for newSocket at ${path} in 3sec`);
            const tryTimer = setInterval(() => {
              tries++;

              this.initiateSocket(path)
                .then(ws => {
                  clearInterval(tryTimer);
                  return resolve(ws);
                })
                .catch(ev2 => {
                  console.log(
                    `newSocket at ${path} initiate ended with catch`,
                    ev
                  );

                  if (maxRetry && tries === maxRetry) { reject(ev2); } else {
                    console.log(
                      `Trying again for newSocket at ${path} in 3sec`
                    );
                  }
                });
            }, 3000);
          } else { reject(ev); }
        });
    });
  }

  private initiateSocket(path?: string): Promise<WebSocket> {

    console.log('request for websocket');
    return new Promise(async (resolve, reject) => {
      let wsConnection;

      const wsAddress = path.indexOf('://') !== -1 ?
        path : this.dataService.currentServer.replace('http:', 'ws:').replace('https:', 'wss:') + (path || "");

      try {
        wsConnection = new WebSocket(wsAddress);
      } catch (error) {
        reject(error);
      }

      wsConnection.onclose = ev => {
        reject(ev);
      };

      wsConnection.onerror = ev => {
        reject(ev);
      };

      wsConnection.onmessage = (ev: MessageEvent) => {

        // FIXME: saw this method fired twice. find out why;
        // console.log("ws initiate onmessage", ev);
        console.log(ev);

        if (ev.data === "authenticated") { resolve(wsConnection); }
      };

      const token = await this.authService.token();

      wsConnection.onopen = ev => {
        wsConnection.send(token.access_token);

        // setInterval(() => {
        //   if (wsConnection.readyState == wsConnection.OPEN)
        //     wsConnection.send(new Date().toString());
        // }, 2000);
      };
    });
  }
}
