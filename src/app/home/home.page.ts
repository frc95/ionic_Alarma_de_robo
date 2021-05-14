import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { LoginService } from '../services/login.service';

import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from "@ionic-native/device-motion/ngx";
import { Flashlight } from '@ionic-native/flashlight/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';


import {Howl, Howler} from 'howler';

enum posiciones {
  INCLINADODERECHA,
  INCLINADOIZQUIERDA,
  VERTICAL,
  HORIZONTAL,
}



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  

  alarma=false;
  texto="Desactivado"
  id:any;
  posicion:posiciones;

  alert=false;
  alertMsj="";

  constructor(public router : Router,
    public alertController: AlertController,
    private loginSvc : LoginService,
    private movimiento: DeviceMotion,
    private flashlight: Flashlight,
    private vibration: Vibration,
    private loadingController : LoadingController) {}

  ngOnInit() {
  }


  Activar()
  {
    this.alarma=true;
    this.texto="Activado";
    this.motion();
  }
  Desactivar(){
    this.presentAlert();
  }

  Logout(){
    let sound = new Howl({
      src: ['assets/logout/logout.mp3']
    });
    sound.play();
    this.presentLoading();
    setTimeout(() => {
        this.loginSvc.Logout();
        this.router.navigateByUrl('login');
    }, 3000);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Ingrese su contraseña',
      buttons: [
        {
          text: 'Aceptar',
          handler: (alertData) => {
            if(this.loginSvc.getPassword()==alertData.password){
              this.alarma=false;
              this.texto="Desactivado";
              this.id.unsubscribe();
            }
            else{
              this.alert=true;
              this.alertMsj="Contraseña incorrecta";
              setTimeout(() => {
                this.alert=false;
              }, 3000);
            }
          }
        }
      ],
      inputs: [
        {
          name: 'password',
          type: 'password',
        }
      ]
    });

    await alert.present();
  }

  motion(){
      try{
        var option : DeviceMotionAccelerometerOptions={
          frequency: 200
        }; 
        
        this.id= this.movimiento.watchAcceleration(option).subscribe((acc: DeviceMotionAccelerationData)=>{
          
          //derecha
          if(acc.x >=-1 && acc.x <=1 && acc.y > 3 && acc.z >= 7 && this.posicion != posiciones.INCLINADODERECHA)
          {
            this.posicion = posiciones.INCLINADODERECHA;
            this.alarmaDerecha();
          }
          //izquierda
          else if(acc.x >=-1 && acc.x <= 1 && acc.y <-3 && acc.z >= 7 && this.posicion != posiciones.INCLINADOIZQUIERDA){
            this.posicion = posiciones.INCLINADOIZQUIERDA;
            this.alarmaIzquierda();
          }
          //vertical
          else if(acc.x >= -1 && acc.x <= 1 && acc.y >= 9 && acc.z >=-1 && acc.z <= 1 && this.posicion != posiciones.VERTICAL){
            this.posicion = posiciones.VERTICAL;
            this.alarma1();
          }
          //horizontal
          else if(acc.x >= 9 && acc.y >= -1 && acc.y <= 1 && acc.z >= -1 && acc.z <= 1 && this.posicion != posiciones.HORIZONTAL){
            this.posicion = posiciones.HORIZONTAL;
            this.alarma2();
          }
        });

      }catch(err){
        alert("Error "+ err);
      }
    
  }

  alarma1(){
    let sound = new Howl({
      src: ['assets/home/alarma1.mp3'],
    });
    
    let id=sound.play();
    sound.fade(1, 0, 5000, id);

    this.flashlight= new Flashlight();
    this.flashlight.switchOn();
    setTimeout(() => {
        this.flashlight.switchOff();
    }, 5000);
  }
  alarma2(){
    this.vibration = new Vibration();
    this.vibration.vibrate(5000);
    let sound = new Howl({
      src: ['assets/home/alarma2.mp3'],
    });
    
    let id=sound.play();
    sound.fade(1, 0, 6000, id);
  }
  alarmaIzquierda(){
    let sound = new Howl({
      src: ['assets/home/izquierda.mp3'],
    });
    
    sound.play();
  }
  alarmaDerecha(){
    let sound = new Howl({
      src: ['assets/home/derecha.mp3'],
    });
    
    sound.play();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      message: 'Saliendo',
      duration: 3000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  

}
