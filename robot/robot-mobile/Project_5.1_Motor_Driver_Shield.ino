/*
keyestudio 4wd BT Car V2.0
lesson 5.1
motor driver shield
http://www.keyestudio.com
*/ 
#define ML_Ctrl 4     // define the direction control pin of B motor
#define ML_PWM 5      //define the PWM control pin of B motor
#define MR_Ctrl 2     //define direction control pin of A motor
#define MR_PWM 6      //define the PWM control pin of A motor
void setup()
{
    pinMode(ML_Ctrl, OUTPUT); //define direction control pin of B motor as output
    pinMode(ML_PWM, OUTPUT);  //define PWM control pin of B motor as output
    pinMode(MR_Ctrl, OUTPUT); //define direction control pin of A motor as output.
    pinMode(MR_PWM, OUTPUT); //define the PWM control pin of A motor as output
}
void loop()
{ 
    digitalWrite(ML_Ctrl,HIGH); //set the direction control pin of B motor to HIGH
    analogWrite(ML_PWM,200);    //set the PWM control speed of B motor to 200
    digitalWrite(MR_Ctrl,HIGH); //set the direction control pin of A motor to HIGH
    analogWrite(MR_PWM,200);    //set the PWM control speed of A motor to 200

    //front
    delay(2000);//delay in 2s
    digitalWrite(ML_Ctrl,LOW);  //set the direction control pin of B motor to LOW

    analogWrite(ML_PWM,200);    //set the PWM control speed of B motor to 200  
    digitalWrite(MR_Ctrl,LOW);  //set the direction control pin of A motor to LOW
    analogWrite(MR_PWM,200);    //set the PWM control speed of A motor to 200
    //back
    delay(2000);//delay in 2s 
    digitalWrite(ML_Ctrl,LOW);  //set the direction control pin of B motor to LOW
    analogWrite(ML_PWM,200);    //set the PWM control speed of B motor to 200
    digitalWrite(MR_Ctrl,HIGH); //set the direction control pin of A motor to HIGH
    analogWrite(MR_PWM,200);    //set the PWM control speed of A motor to 200

    //left
    delay(2000);//delay in 2s
    digitalWrite(ML_Ctrl,HIGH); //set the direction control pin of B motor to HIGH
    analogWrite(ML_PWM,200);    //set the PWM control speed of B motor to 200
    digitalWrite(MR_Ctrl,LOW);  // set the direction control pin of A motor to LOW
    analogWrite(MR_PWM,200);    //set the PWM control speed of A motor to 200

    //right
    delay(2000);                //delay in 2s
    analogWrite(ML_PWM,0);      //set the PWM control speed of B motor to 0
    analogWrite(MR_PWM,0);      //set the PWM control speed of A motor to 0

    //stop
    delay(2000);                //delay in 2s
}