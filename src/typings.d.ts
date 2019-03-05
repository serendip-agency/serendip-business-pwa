/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
interface Window {
  resolveLocalFileSystemURL: any;
  resolveLocalFileSystemURI: any;
  cordova: any;
  vibrate: any;
  Media: any;
  Recorder: any;
  FCMPlugin: any;
  PushNotification: any;
  device: any;

  cryptico: any;
}
