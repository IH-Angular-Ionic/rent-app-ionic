import { Router } from '@angular/router';
import { PlacesService } from '../../places.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { PlaceLocation } from '../../location.model';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;
  constructor(
    private placesService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      description: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(150)],
      }),
      price: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required, Validators.minLength(3)],
      }),
      dateFrom: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      dateTo: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      location: new FormControl(null, { validators: [Validators.required] }),
    });
  }
  onLocationPicked(location: PlaceLocation) {
    this.form.patchValue({ location: location });
  }

  onCreateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        spinner: 'bubbles',
        message: 'Creating new offer... or place',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.placesService
          .addPlace(
            this.form.value.title,
            this.form.value.description,
            +this.form.value.price,
            new Date(this.form.value.dateFrom),
            new Date(this.form.value.dateTo),
            this.form.value.location
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/places/tabs/offers']);
            console.log(this.form.value);
          });
      });
  }
}
