import { Router } from '@angular/router';
import { PlacesService } from '../../places.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;
  constructor(private placesService: PlacesService, private router: Router) {}

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
    });
  }

  onCreateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.placesService.addPlace(
      this.form.value.title,
      this.form.value.description,
      +this.form.value.price,
      new Date(this.form.value.dateFrom),
      new Date(this.form.value.dateTo)
    );
    this.form.reset();
    this.router.navigate(['/places/tabs/offers']);
    console.log(this.form.value);
  }
}
