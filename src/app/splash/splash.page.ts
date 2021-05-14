import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';

import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  styles: Partial<CSSStyleDeclaration> = {
    maxWidth: '250px',
    margin: '0 auto',
    
  };
  options:AnimationOptions = {
    path : 'assets/alarma.json'
  }

  constructor(public router: Router) {
    setTimeout(() => {
      this.router.navigateByUrl('login');
    }, 3800);
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    SplashScreen.hide();
  }

}
