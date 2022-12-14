import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[];
  isLoading = false;
  private placesSub: Subscription;

  constructor(private placesService: PlacesService, private router: Router) {}

  ngOnInit() {
    // this.offers = this.placesService.places;
    this.placesSub = this.placesService.places.subscribe((places) => {
      this.offers = places;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;

    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  onEdit(offerId: string, sliding: IonItemSliding) {
    sliding.close();
    this.router.navigate([
      '/',
      'places',
      'tabs',
      'offers',
      'editOffer',
      offerId,
    ]);
    console.log('editing offer', offerId);
  }

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
