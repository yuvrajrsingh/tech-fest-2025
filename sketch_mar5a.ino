#include <Servo.h>

Servo gateServo;

int sensor1 = 2;
int sensor2 = 3;
int sensor3 = 5;
int sensor4 = 6;
int sensor5 = 7;
int sensor6 = 8;
int servoPin = 4;
int slots = 4;
int entry = 0;
int leaving = 0;

void setup() {
  Serial.begin(9600);
  pinMode(sensor1, INPUT);
  pinMode(sensor2, INPUT);
  pinMode(sensor3, INPUT);
  pinMode(sensor4, INPUT);
  pinMode(sensor5, INPUT);
  pinMode(sensor6, INPUT);
  gateServo.attach(servoPin);
  gateServo.write(100);
}

void loop() {
  if(digitalRead(sensor1) == LOW && entry == 0) {
    if(slots > 0) {
      entry = 1;
      if(leaving == 0) {
        gateServo.write(0);
        slots--;
      }
    }
  }

  if(digitalRead(sensor2) == LOW && leaving == 0) {
    leaving = 1;
    if(entry == 0) {
      gateServo.write(0);
      slots++;
    }
  }

  if(entry == 1 && leaving == 1) {
    delay(1000);
    gateServo.write(100);
    entry = 0;
    leaving = 0;
  }

  int s1 = digitalRead(sensor3);
  int s2 = digitalRead(sensor4);
  int s3 = digitalRead(sensor5);
  int s4 = digitalRead(sensor6);

  Serial.print("1:");
  Serial.print(!s1);
  Serial.print(" 2:");
  Serial.print(!s2);
  Serial.print(" 3:");
  Serial.print(!s3);
  Serial.print(" 4:");
  Serial.print(!s4);
  Serial.println();
  
  delay(100);
}