#include <Adafruit_NeoPixel.h>
#include "SoftwareSerial.h"
#include "WiFiEsp.h"
#include <PubSubClient.h>

#ifdef __AVR__
#include <avr/power.h> // Required for 16 MHz Adafruit Trinket
#endif
#ifndef HAVE_HWSERIAL1
SoftwareSerial Serial1(11, 12);//esp8266(11,12); // make RX Arduino line is pin 2, make TX Arduino line is pin 3.
#endif

#define WIFI_AP "Presion"
#define WIFI_PASSWORD "nigguplease"
#define TOKEN "YOUR_ACCESS_TOKEN"
#define PIN 31 // On Trinket or Gemma, suGGest chanGinG this to 1
#define NUMPIXELS 16 // Popular NeoPixel rinG size
Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);
#define DELAYVAL 50 // Time (in milliseconds) to pause between pixels

WiFiEspClient client;//espClient;
PubSubClient clientMQTT(client);

int chk;
char server[] = "soldier.cloudmqtt.com";
char srv_user[] = "iekamqyu";
char srv_pass[] = "lC-LqyiPhyab";
int port = 33033;
char device_id[] = "device1";
int status = WL_IDLE_STATUS;

void(* resetFunc) (void) = 0; //declare reset function @ address 0

const int R = 251;
const int G = 0;
const int B = 0;

const int buttonPin = 32;     // the number of the pushbutton pin
const int waterBomb1 =  39;      // the number of the LED pin
const int waterBomb2 =  40;      // the number of the LED pin
const int waterBomb3 =  41;      // the number of the LED pin

const int waterSensor1 = 20;
const int waterSensor2 = 21;
const int waterSensor3 = 22;
int buttonState = 0;         // variable for reading the pushbutton status

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
    digitalWrite (waterBomb1, HIGH);
    delay(1500);
    digitalWrite (waterBomb1, LOW);
  } else if (params[0] == "2") {
    digitalWrite (waterBomb2, HIGH);
    delay(2500);
    digitalWrite (waterBomb2, LOW);
  } else if (params[0] == "3") {
    digitalWrite (waterBomb3, HIGH);
    delay(1500);
    digitalWrite (waterBomb3, LOW);
  }
}

void setup() {
#if defined(__AVR_ATtiny85__) && (F_CPU == 16000000)
  clock_prescale_set(clock_div_1);
#endif
  // END of Trinket-specific code.
  Serial.begin(9600);
  // initialize the pushbutton pin as an input:
  pinMode(buttonPin, INPUT);
  pinMode(waterSensor1, INPUT);
  pinMode(waterSensor2, INPUT);
  pinMode(waterSensor3, INPUT);
  pinMode(waterBomb1, OUTPUT);
  pinMode(waterBomb2, OUTPUT);
  pinMode(waterBomb3, OUTPUT);
  pixels.begin(); // INITIALIZE NeoPixel strip object (REQUIRED)
  InitWiFi();
  clientMQTT.setServer( server, port );
  clientMQTT.setCallback(callback);
  Serial.println("Configuration success");

}
void loop() {
  for (int i = 0; i < NUMPIXELS; i++) { // For each pixel...
    if (i == 0) {
      pixels.setPixelColor(NUMPIXELS - 1, pixels.Color(0, 0, 0));
      pixels.setPixelColor(NUMPIXELS - 2, pixels.Color(0, 0, 0));
      pixels.setPixelColor(NUMPIXELS - 3, pixels.Color(0, 0, 0));
      pixels.setPixelColor(NUMPIXELS - 4, pixels.Color(0, 0, 0));
      pixels.setPixelColor(i, pixels.Color(R, G, B));
      pixels.setPixelColor(i + 1, pixels.Color(R, G, B));
      pixels.setPixelColor(i + 2, pixels.Color(R, G, B));
      pixels.setPixelColor(i + 3, pixels.Color(R, G, B));
    }
    else {
      pixels.setPixelColor(i, pixels.Color(R, G, B));
      pixels.setPixelColor(i + 1, pixels.Color(R, G, B));
      pixels.setPixelColor(i + 2, pixels.Color(R, G, B));
      pixels.setPixelColor(i + 3, pixels.Color(R, G, B));
      delay(DELAYVAL);
      pixels.setPixelColor(i - 1, pixels.Color(0, 0, 0)); // Moderately briGht Green color.
      pixels.setPixelColor(i - 2, pixels.Color(0, 0, 0)); // Moderately briGht Green color.
      pixels.setPixelColor(i - 3, pixels.Color(0, 0, 0)); // Moderately briGht Green color.
      pixels.setPixelColor(i - 4, pixels.Color(0, 0, 0)); // Moderately briGht Green color.
    }
    pixels.show();   // Send the updated pixel colors to the hardware.
  }
  buttonState = digitalRead(buttonPin); // read the state of the pushbutton value:
  if (buttonState == HIGH) {
    digitalWrite (waterBomb1, HIGH);
    digitalWrite (waterBomb2, HIGH);
    delay(100);
  }
  else if (digitalRead(waterSensor1) == LOW) {
    pixels.setPixelColor(0, pixels.Color(0, 0, 255));
    delay(100);
  }
  else if (digitalRead(waterSensor2) == LOW) {
    pixels.setPixelColor(1, pixels.Color(0, 0, 255));
    delay(100);
  }
  else if (digitalRead(waterSensor3) == LOW) {
    pixels.setPixelColor(2, pixels.Color(0, 0, 255));
    delay(100);
  }
  else {
    Serial.print("Hello world.");
  }
  status = WiFi.status();

  if ( status != WL_CONNECTED) {
    while ( status != WL_CONNECTED) {
      Serial.print("Attempting to connect to WPA SSID: ");
      Serial.println(WIFI_AP);
      // Connect to WPA/WPA2 network
      status = WiFi.begin(WIFI_AP, WIFI_PASSWORD);
      delay(500);
    }
    Serial.println("Connected to AP");
  }
  if ( !clientMQTT.connected() ) {
    reconnect();
  }
  delay(1000);
  clientMQTT.loop();
}

void InitWiFi() {
  // initialize ESP module
  WiFi.init(&Serial1);
  // check for the presence of the shield
  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("WiFi shield not present");
    // don't continue
    Serial.println("resetting");
    resetFunc();  //call reset
  }

  Serial.println("Connecting to AP ...");
  // attempt to connect to WiFi network
  while ( status != WL_CONNECTED) {
    Serial.print("Attempting to connect to WPA SSID: ");
    Serial.println(WIFI_AP);
    // Connect to WPA/WPA2 network
    status = WiFi.begin(WIFI_AP, WIFI_PASSWORD);
    delay(500);
  }
  Serial.println("Connected to AP");
}

void reconnect() {
  // Loop until we're reconnected
  while (!clientMQTT.connected()) {
    Serial.print("Connecting to CloudMQTT node ...");
    // Attempt to connect (clientId, username, password)
    if ( clientMQTT.connect("device1", "device1", "12345") ) {
      clientMQTT.subscribe("/home/musicselect");
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
      Serial.print( clientMQTT.state() );
      Serial.println( " : retrying in 5 seconds]" );
      // Wait 5 seconds before retrying
      delay( 5000 );
    }
  }
}