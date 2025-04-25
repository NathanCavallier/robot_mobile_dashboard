#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "NOM_DU_WIFI";
const char* password = "MOT_DE_PASSE_WIFI";

const char* serverName = "http://192.168.X.X:3000/api/robot/data"; // à adapter à ton IP locale

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  Serial.print("Connexion au WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" Connecté !");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> doc;
    doc["timestamp"] = millis();
    doc["detectedObject"] = "canette";
    doc["motorStatus"] = "forward";
    doc["battery"] = 3.85;

    String output;
    serializeJson(doc, output);

    int httpResponseCode = http.POST(output);
    Serial.print("Réponse serveur : ");
    Serial.println(httpResponseCode);

    http.end();
  }

  delay(5000);
}