/*
keyestudio 4wd BT Car V2.0
lesson 5.2
motor driver
http://www.keyestudio.com
*/ 
#define ML_Ctrl 4     //define the direction control pin of B motor
#define ML_PWM 5   //define the PWM control pin of B motor
#define MR_Ctrl 2    //define the direction control pin of A motor
#define MR_PWM 6   //define the PWM control pin of A motor
void setup()
{
    pinMode(ML_Ctrl, OUTPUT);//set direction control pin of B motor to OUTPUT
    pinMode(ML_PWM, OUTPUT);//set the PWM control pin of B motor to OUTPUT 
    pinMode(MR_Ctrl, OUTPUT);//set the direction control pin of A motor to OUTPUT
    pinMode(MR_PWM, OUTPUT);//set PWM control pin of A motor to OUTPUT
}
void loop()
{ 
    digitalWrite(ML_Ctrl,HIGH);//set direction control pin of B motor to HIGH level
    analogWrite(ML_PWM,250);//Set PWM control speed of B motor to 100
    digitalWrite(MR_Ctrl,HIGH);//set direction control pin of A motor to HIGH level
    analogWrite(MR_PWM,250);//Set PWM control speed of A motor to 100
    //front
    delay(2000);//delay in 2s
    digitalWrite(ML_Ctrl,LOW);//set direction control pin of B motor to LOW
    analogWrite(ML_PWM,250);//Set PWM control speed of B motor to 100
    digitalWrite(MR_Ctrl,LOW);//set direction control pin of A motor to LOW
    analogWrite(MR_PWM,250);//Set PWM control speed of A motor to 100
    //back
    delay(2000);//delay in 2s
    digitalWrite(ML_Ctrl,LOW);//set direction control pin of B motor to LOW
    analogWrite(ML_PWM,250);//Set PWM control speed of B motor to 100
    digitalWrite(MR_Ctrl,HIGH);//set direction control pin of A motor to HIGH level
    analogWrite(MR_PWM,250);//Set PWM control speed of A motor to 100
    //left
    delay(2000);//delay in 2s
    digitalWrite(ML_Ctrl,HIGH);//set direction control pin of B motor to HIGH level
    analogWrite(ML_PWM,250);//Set PWM control speed of B motor to 100
    digitalWrite(MR_Ctrl,LOW);//set direction control pin of A motor to LOW
    analogWrite(MR_PWM,250);//Set PWM control speed of A motor to 100
    //right
    delay(2000);//delay in 2s
    analogWrite(ML_PWM,0);//set PWM control speed of B motor to 0
    analogWrite(MR_PWM,0);//set PWM control speed of A motor to 0
    //stop
    delay(2000);//delay in 2s
}