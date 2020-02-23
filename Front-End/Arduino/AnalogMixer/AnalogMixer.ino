#include <ESP8266WiFi.h>
#include <PubSubClient.h>

//-------------------VARIABLES GLOBALES--------------------------
int contconexion = 0;

const char *ssid = "lichkhing";
const char *password = "computadores1";
char   SERVER[50]   = "soldier.cloudmqtt.com"; //"m11.cloudmqtt.com"
int    SERVERPORT   = 13033;
String USERNAME = "placa1";   
char   PASSWORD[50] = "12345678";     

String prueba = "Nada";
unsigned long previousMillis = 0;

char charPulsador [15];
String strPulsador;
String strPulsadorUltimo;

char PLACA[50];

char valueStr[15];
String strtemp = "";
char TEMPERATURA[50];
char PULSADOR[50];
char SALIDADIGITAL[50];
char SALIDAANALOGICA[50];


//-------------------------------------------------------------------------
WiFiClient espClient;
PubSubClient client(espClient);

//------------------------CALLBACK-----------------------------
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  String entry = "";
  String data = "";
  String params[3];
  for (int i = 0; i < length; i++) {
    entry = entry + (char)payload[i];
  }
  Serial.println(entry);
  data = entry.substring(entry.indexOf(']') + 1, entry.lastIndexOf(' '));
  int parser1 = data.indexOf(','); //finds location of first
  params[0] = data.substring( 0, parser1); //captures water level data

  //La Logica se controla aqui
  double openPumpTime;
  if (params[0] == "1") {
    prueba="1";
    Serial.println("1");
  } else if (params[0] == "2") {
    Serial.println("2");
  } else if (params[0] == "3") {
    Serial.println("3");
  }
}

//------------------------RECONNECT-----------------------------

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Connecting to CloudMQTT node ...");
    // Attempt to connect (clientId, username, password)
    if ( client.connect("device1", "device1", "12345") ) {
      client.subscribe("/smartcocktails/home");
      Serial.println( "[DONE]" );
      digitalWrite(10, HIGH);
      delay(200);
      digitalWrite(10, LOW);
      delay(200);
      digitalWrite(10, HIGH);
      delay(200);
      digitalWrite(10, LOW);
    } else {
      Serial.print( "[FAILED] [ rc = " );
      Serial.print( client.state() );
      Serial.println( " : retrying in 5 seconds]" );
      // Wait 5 seconds before retrying
      delay( 5000 );
    }
  }
}

//------------------------SETUP-----------------------------
void setup() {

  //prepara GPI13 y 12 como salidas 
  pinMode(13, OUTPUT); // D7 salida analógica
  analogWrite(13, 0); // analogWrite(pin, value);
  pinMode(12, OUTPUT); // D6 salida digital
  digitalWrite(12, LOW);

  // Entradas
  pinMode(14, INPUT); // D5

  // Inicia Serial
  Serial.begin(115200);
  Serial.println("");

  // Conexión WIFI
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED and contconexion <50) { //Cuenta hasta 50 si no se puede conectar lo cancela
    ++contconexion;
    delay(500);
    Serial.print(".");
  }
  if (contconexion <50) {
      //para usar con ip fija
      IPAddress ip(192,168,1,156); 
      IPAddress gateway(192,168,1,1); 
      IPAddress subnet(255,255,255,0); 
      WiFi.config(ip, gateway, subnet); 
      
      Serial.println("");
      Serial.println("WiFi conectado");
      Serial.println(WiFi.localIP());
  }
  else { 
      Serial.println("");
      Serial.println("Error de conexion");
  }
  
  client.setServer(SERVER, SERVERPORT);
  client.setCallback(callback);

  String temperatura = "/" + USERNAME + "/" + "temperatura"; 
  temperatura.toCharArray(TEMPERATURA, 50);
  String pulsador = "/" + USERNAME + "/" + "pulsador"; 
  pulsador.toCharArray(PULSADOR, 50);
  String salidaDigital = "/" + USERNAME + "/" + "salidaDigital"; 
  salidaDigital.toCharArray(SALIDADIGITAL, 50);
  String salidaAnalogica = "/" + USERNAME + "/" + "salidaAnalogica"; 
  salidaAnalogica.toCharArray(SALIDAANALOGICA, 50);
  
}

//--------------------------LOOP--------------------------------
void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long currentMillis = millis();
    
  if (currentMillis - previousMillis >= 10000) { //envia la temperatura cada 10 segundos
    previousMillis = currentMillis;
    int analog = analogRead(17);
    float temp = analog*0.322265625;
    strtemp = String(temp, 1); //1 decimal
    strtemp.toCharArray(valueStr, 15);
    Serial.println("Enviando: [" +  String(TEMPERATURA) + "] " + strtemp);
    client.publish(TEMPERATURA, valueStr);
    Serial.println(prueba);
  }
  
  if (digitalRead(14) == 0) {
    strPulsador = "presionado";
  } else {
    strPulsador = "NO presionado";
  }

  if (strPulsador != strPulsadorUltimo) { //envia el estado del pulsador solamente cuando cambia.
    strPulsadorUltimo = strPulsador;
    strPulsador.toCharArray(valueStr, 15);
    Serial.println("Enviando: [" +  String(PULSADOR) + "] " + strPulsador);
    client.publish(PULSADOR, valueStr);
  }
}
