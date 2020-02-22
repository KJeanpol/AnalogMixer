import init from "react_native_mqtt";
import { AsyncStorage } from "react-native";

import { USERNAME, PASSWORD, SERVER } from "../config/constants";

export default function MQTTClient(data, topic) {
  init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    reconnect: true,
    sync: {}
  });

  function onConnect() {
    console.log("onConnect");
    client.subscribe(topic); //const topic = "/home/smartcocktails/client"
    var params = "";
    for (var i = 0; i < data.length; i++) {
      params = params + data[i] + ",";
    }
    message = new Paho.MQTT.Message(params);
    message.destinationName = topic;
    client.send(message);
  }

  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
  }

  function onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);
  }

  function doFail(e) {
    console.log("error", e);
  }

  const client = new Paho.MQTT.Client(SERVER, 33033, "device");
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  const options = {
    useSSL: true,
    userName: USERNAME,
    password: PASSWORD,
    onSuccess: onConnect,
    onFailure: doFail
  };

  client.connect(options);

  return client;
}