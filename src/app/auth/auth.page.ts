import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}
  onLogin() {
    this.isLoading = true;
    this.authService.login();

    this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'dots',
        message: 'Please wait...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        setTimeout(() => {
          this.router.navigateByUrl('/places/tabs/discover');
          loadingEl.dismiss();
          this.isLoading = false;
        }, 1000);
      });
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    console.log(form.value);
    if (this.isLogin) {
      //sent request to login servers
    } else {
      //send request to signup servers
    }
  }
}
