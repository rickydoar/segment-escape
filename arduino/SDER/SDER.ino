#include <ArduinoJson.h>

#include "FS.h"
#include "SPIFFS.h"
#include <M5Stack.h>
#include <WiFi.h>
#include <ESPmDNS.h>
#include <WiFiClient.h>
#include "WebServer.h"
#include <Preferences.h>
#include <HTTPClient.h>

#define NOTE_DH2 661

String DEVICE_ID = "12345";
String REMOTE_URL = "http://se-data-escape-room.herokuapp.com/deviceApi";

const IPAddress apIP(192, 168, 4, 1);
const char* apSSID = "M5STACK_SETUP";
const char* appMode = "SELECT MODE";
boolean suppressPrintOut;
const boolean ENABLE_PRINT = false;
boolean settingMode;
String ssidList;
String wifi_ssid;
String wifi_password;

// DNSServer dnsServer;
WebServer webServer(80);

// wifi config store
Preferences preferences;

void setup() {
  M5.begin(true, false, false, false);
  //M5.Power.begin();
  Serial.begin(115200);
  if(!SPIFFS.begin(true)){
      Serial.println("SPIFFS Mount Failed");
      return;
  }
  preferences.begin("wifi-config");
  M5.Lcd.fillScreen(BLACK);
  M5.Lcd.setTextColor(WHITE);
  M5.Lcd.setTextSize(2);
  M5.Lcd.setCursor(0, 0);
  M5.Lcd.println("Select Mode:");
  M5.Lcd.println("A - Setup WiFi");
  M5.Lcd.println("B - Game Mode");
}

void loop() {
  //if (settingMode) {
  //}

  //Initial menu
  if(M5.BtnB.wasPressed()) {      
    appMode="GAME MODE";
    doModeSwitch();
  } else if (M5.BtnA.wasPressed()) {      
    appMode="SETUP WIFI";
    doModeSwitch();
  }

  if(appMode=="GAME MODE") {
    handleMessages();
  }
  
  webServer.handleClient();
  M5.update();
}


void drawMessage(String message) {
  M5.lcd.fillRect(0,160,360,80,WHITE);
  M5.Lcd.setTextColor(BLACK);
  M5.Lcd.setTextSize(2);  
  M5.Lcd.setCursor(10, 170);      
  M5.Lcd.print(message);
}

void doModeSwitch() {
  M5.Lcd.clear();
  
  if(appMode=="SELECT MODE") {  
    return;
  } else if(appMode=="SETUP WIFI") {
    suppressPrintOut = false;
    M5.Lcd.fillScreen(BLACK);
    M5.Lcd.setTextColor(WHITE);
    M5.Lcd.setTextSize(2);
    M5.Lcd.setCursor(0, 0);    
    
    delay(10);
    if (restoreConfig()) {
      if (checkConnection()) {
        settingMode = false;
        startWebServer();
        return;
      }
    }
    settingMode = true;
    setupMode();
  } else { //GAME MODE
    suppressPrintOut = true;
    M5.Lcd.fillScreen(BLACK);
    M5.Lcd.setTextColor(WHITE);
    M5.Lcd.setTextSize(2);
    M5.Lcd.setCursor(0, 0);    
    M5.Lcd.println("CONNECTING...");
    
    if(checkConnection()) {
      M5.Lcd.clear();
      M5.Lcd.drawJpgFile(SPIFFS, "/segment_logo.jpg", 0, 0);  
      drawMessage(DEVICE_ID);
      registerDevice();
      handleMessages();
    } else {
      M5.Lcd.println("NO WIFI CONNECTION.");
      Serial.println("WiFi not connected. Could not register device.");   
    }


    /*
    if (restoreConfig()) {
      if (checkConnection()) {
        settingMode = false;
        startWebServer();
        return;
      }
    }
    */
  }
}


boolean restoreConfig() {
  wifi_ssid = preferences.getString("WIFI_SSID");
  wifi_password = preferences.getString("WIFI_PASSWD");
  if(!suppressPrintOut) { 
    Serial.print("WIFI-SSID: ");
    M5.Lcd.print("WIFI-SSID: ");
    Serial.println(wifi_ssid);
    M5.Lcd.println(wifi_ssid);
    Serial.print("WIFI-PASSWD: ");
    M5.Lcd.print("WIFI-PASSWD: ");
    Serial.println(wifi_password);
    M5.Lcd.println(wifi_password);
  }
  WiFi.begin(wifi_ssid.c_str(), wifi_password.c_str());

  if(wifi_ssid.length() > 0) {
    return true;
} else {
    return false;
  }
}

boolean checkConnection() {
  int count = 0;
  if(!suppressPrintOut) { 
    Serial.print("Waiting for Wi-Fi connection");
    M5.Lcd.print("Waiting for Wi-Fi connection");
  }
  while ( count < 30 ) {
    if (WiFi.status() == WL_CONNECTED) {
      if(!suppressPrintOut) { 
        Serial.println();
        M5.Lcd.println();
        Serial.println("Connected!");
        M5.Lcd.println("Connected!");
      }
      return (true);
    }
    delay(500);
    if(!suppressPrintOut) { 
      Serial.print(".");
      M5.Lcd.print(".");
    }
    count++;
  }
  if(!suppressPrintOut) {
    Serial.println("Timed out.");
    M5.Lcd.println("Timed out.");
  }
  return false;
}

void startWebServer() {
  if (settingMode) {
    if(!suppressPrintOut) {
      Serial.print("Starting Web Server at ");
      M5.Lcd.print("Starting Web Server at ");
      Serial.println(WiFi.softAPIP());
      M5.Lcd.println(WiFi.softAPIP());
    }
    webServer.on("/settings", []() {
      String s = "<h1>Wi-Fi Settings</h1><p>Please enter your password by selecting the SSID.</p>";
      s += "<form method=\"get\" action=\"setap\"><label>SSID: </label><select name=\"ssid\">";
      s += ssidList;
      s += "</select><br>Password: <input name=\"pass\" length=64 type=\"password\"><input type=\"submit\"></form>";
      webServer.send(200, "text/html", makePage("Wi-Fi Settings", s));
    });
    webServer.on("/setap", []() {
      String ssid = urlDecode(webServer.arg("ssid"));
      if(!suppressPrintOut) {
        Serial.print("SSID: ");
        M5.Lcd.print("SSID: ");
        Serial.println(ssid);
        M5.Lcd.println(ssid);
      }
      String pass = urlDecode(webServer.arg("pass"));
      if(!suppressPrintOut) {
        Serial.print("Password: ");
        M5.Lcd.print("Password: ");
        Serial.println(pass);
        M5.Lcd.println(pass);
        Serial.println("Writing SSID to EEPROM...");
        M5.Lcd.println("Writing SSID to EEPROM...");
      }
      // Store wifi config
      if(!suppressPrintOut) {  
        Serial.println("Writing Password to nvr...");
        M5.Lcd.println("Writing Password to nvr...");
      }
      preferences.putString("WIFI_SSID", ssid);
      preferences.putString("WIFI_PASSWD", pass);
      if(!suppressPrintOut) {
        Serial.println("Write nvr done!");
        M5.Lcd.println("Write nvr done!");
      }
      String s = "<h1>Setup complete.</h1><p>device will be connected to \"";
      s += ssid;
      s += "\" after the restart.";
      webServer.send(200, "text/html", makePage("Wi-Fi Settings", s));
      delay(3000);
      ESP.restart();
    });
    webServer.onNotFound([]() {
      String s = "<h1>AP mode</h1><p><a href=\"/settings\">Wi-Fi Settings</a></p>";
      webServer.send(200, "text/html", makePage("AP mode", s));
    });
  }
  else {
    if(!suppressPrintOut) {
      Serial.print("Starting Web Server at ");
      M5.Lcd.print("Starting Web Server at ");
      Serial.println(WiFi.localIP());
      M5.Lcd.println(WiFi.localIP());
    }
    webServer.on("/", []() {
      String s = "<h1>STA mode</h1><p><a href=\"/reset\">Reset Wi-Fi Settings</a></p>";
      webServer.send(200, "text/html", makePage("STA mode", s));
    });
    webServer.on("/reset", []() {
      // reset the wifi config
      preferences.remove("WIFI_SSID");
      preferences.remove("WIFI_PASSWD");
      String s = "<h1>Wi-Fi settings was reset.</h1><p>Please reset device.</p>";
      webServer.send(200, "text/html", makePage("Reset Wi-Fi Settings", s));
      delay(3000);
      ESP.restart();
    });
  }
  webServer.begin();
}

void registerDevice() {

  String postData;
  
  if(WiFi.status()== WL_CONNECTED){   //Check WiFi connection status
     HTTPClient http;   
     StaticJsonDocument<200> doc;

     Serial.print("Registering device ");
     Serial.print(DEVICE_ID);
     Serial.print(" on ");
     Serial.println(WiFi.softAPIP());
   
     http.begin(REMOTE_URL + "/register");  //Specify destination for HTTP request
     http.addHeader("Content-Type", "application/json");             //Specify content-type header

     doc["deviceId"] = DEVICE_ID;
     doc["ipAddress"] = WiFi.softAPIP().toString();

     serializeJson(doc, postData);
   
     int httpResponseCode = http.POST(postData);   //Send the actual POST request
   
     if(httpResponseCode>0){
   
      String response = http.getString();                       //Get the response to the request
   
      Serial.println(httpResponseCode);   //Print return code
      Serial.println(response);           //Print request answer
   
     } else {
   
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
   
     }
   
     http.end();  //Free resources
   
   } else {
   
      Serial.println("WiFi not connected. Could not register device.");   
   
   }

}

void handleMessages() {

  String postData;
  
  if(WiFi.status()== WL_CONNECTED){   //Check WiFi connection status
     HTTPClient http;
     HTTPClient httpSub;
     StaticJsonDocument<200> reqDoc;
     StaticJsonDocument<200> resDoc;
     StaticJsonDocument<200> resDocSub;

     Serial.print("Checking for messages for ");
     Serial.print(DEVICE_ID);
     Serial.print(" on ");
     Serial.println(WiFi.softAPIP());

     delay(1000);
   
     http.begin(REMOTE_URL + "/messages/count");  //Specify destination for HTTP request
     http.addHeader("Content-Type", "application/json");             //Specify content-type header

     reqDoc["deviceId"] = DEVICE_ID;
     reqDoc["ipAddress"] = WiFi.softAPIP().toString();

     serializeJson(reqDoc, postData);
   
     int httpResponseCode = http.POST(postData);   //Send the actual POST request
   
     if(httpResponseCode>0){

      String response = http.getString();
      deserializeJson(resDoc,response);                       //Get the response to the request

      bool isSuccess = resDoc["success"];
      int messageCount = resDoc["count"];
   
      if(isSuccess) {
        Serial.println(response);   //Print return code        
        Serial.print("Message Count: ");
        Serial.println(messageCount);

        // Iterate through messages
        for (int i = 0; i < messageCount; i++)
        {
                delay(1000);
          
                String message = "";
                httpSub.begin(REMOTE_URL + "/messages/pop");  //Specify destination for HTTP request
                httpSub.addHeader("Content-Type", "application/json");             //Specify content-type header
                
                int httpSubResponseCode = httpSub.POST(postData);   //Send the actual POST request
                
                if(httpSubResponseCode>0){
                
                  String responseSub = httpSub.getString();
                  deserializeJson(resDocSub,responseSub);                       //Get the response to the request 

                  String message = resDocSub["message"];

                  if(message=="\"OP_SOUND\"") {
                    playSound();
                  } else {
                    drawMessage(message);
                  }

                } else {
               
                  Serial.print("Error on sending POST: ");
                  Serial.println(httpSubResponseCode);
               
                }
   
                httpSub.end();  //Free resources
        }
        
       }  
   
     } else {
   
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
   
     }
   
     http.end();  //Free resources
   
   } else {
   
      Serial.println("WiFi not connected. Could not check for messages.");   
   
   }

}

void playSound() {
  M5.Speaker.tone(NOTE_DH2, 200); //frequency 3000, with a duration of 200ms
}

void setupMode() {
  WiFi.mode(WIFI_MODE_STA);
  WiFi.disconnect();
  delay(100);
  int n = WiFi.scanNetworks();
  delay(100);
  if(!suppressPrintOut) {
    Serial.println("");
    M5.Lcd.println("");
  }
  for (int i = 0; i < n; ++i) {
    ssidList += "<option value=\"";
    ssidList += WiFi.SSID(i);
    ssidList += "\">";
    ssidList += WiFi.SSID(i);
    ssidList += "</option>";
  }
  delay(100);
  WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
  WiFi.softAP(apSSID);
  WiFi.mode(WIFI_MODE_AP);
  // WiFi.softAPConfig(IPAddress local_ip, IPAddress gateway, IPAddress subnet);
  // WiFi.softAP(const char* ssid, const char* passphrase = NULL, int channel = 1, int ssid_hidden = 0);
  // dnsServer.start(53, "*", apIP);
  startWebServer();
  if(!suppressPrintOut) {
    Serial.print("Starting Access Point at \"");
    M5.Lcd.print("Starting Access Point at \"");
    Serial.print(apSSID);
    M5.Lcd.print(apSSID);
    Serial.println("\"");
    M5.Lcd.println("\"");
  }
}

String makePage(String title, String contents) {
  String s = "<!DOCTYPE html><html><head>";
  s += "<meta name=\"viewport\" content=\"width=device-width,user-scalable=0\">";
  s += "<title>";
  s += title;
  s += "</title></head><body>";
  s += contents;
  s += "</body></html>";
  return s;
}

String urlDecode(String input) {
  String s = input;
  s.replace("%20", " ");
  s.replace("+", " ");
  s.replace("%21", "!");
  s.replace("%22", "\"");
  s.replace("%23", "#");
  s.replace("%24", "$");
  s.replace("%25", "%");
  s.replace("%26", "&");
  s.replace("%27", "\'");
  s.replace("%28", "(");
  s.replace("%29", ")");
  s.replace("%30", "*");
  s.replace("%31", "+");
  s.replace("%2C", ",");
  s.replace("%2E", ".");
  s.replace("%2F", "/");
  s.replace("%2C", ",");
  s.replace("%3A", ":");
  s.replace("%3A", ";");
  s.replace("%3C", "<");
  s.replace("%3D", "=");
  s.replace("%3E", ">");
  s.replace("%3F", "?");
  s.replace("%40", "@");
  s.replace("%5B", "[");
  s.replace("%5C", "\\");
  s.replace("%5D", "]");
  s.replace("%5E", "^");
  s.replace("%5F", "-");
  s.replace("%60", "`");
  return s;
}
