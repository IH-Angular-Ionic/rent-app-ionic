import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  form: FormGroup;
  private placesSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((param) => {
      if (!param.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }

      // const place = this.placesService.getPlace(param.get('placeId'));

      this.placesSub = this.placesService
        .getPlace(param.get('placeId'))
        .subscribe((place) => {
          this.place = place;
          this.form = new FormGroup({
            title: new FormControl(this.place.title, {
              updateOn: 'blur',
              validators: [Validators.required],
            }),
            description: new FormControl(this.place.description, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.maxLength(150)],
            }),
          });
          // console.log(this.form.value);
        });
    });
  }

  onUpdateOffer() {
    console.log('hola');
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        spinner: 'bubbles',
        message: 'Updating title and description place...',
      })
      .then((loadingEl) => {
        // console.log(this.form.value);
        loadingEl.present();
        this.placesService
          .updatePlace(
            this.place.id,
            this.form.value.title,
            this.form.value.description
          )
          .subscribe(() => {
            console.log(this.form.value);
            // no esta actualizando los datos del metodo updatePlace
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/places/tabs/offers']);
          });
      });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
