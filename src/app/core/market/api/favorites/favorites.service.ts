import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { Log } from 'ng2-logger';

import { MarketService } from 'app/core/market/market.service';
import { MarketStateService } from '../../market-state/market-state.service';
import { ProfileService } from 'app/core/market/api/profile/profile.service';
import { FavoriteCacheService } from 'app/core/market/market-cache/favorite-cache.service';
import { SnackbarService } from 'app/core/snackbar/snackbar.service';

import { Favorite } from './favorite.model';
import { Listing } from 'app/core/market/api/listing/listing.model';




@Injectable()
export class FavoritesService {

  private log: any = Log.create('favorite.service id:' + Math.floor((Math.random() * 1000) + 1));
  private defaultFavId: number;

  constructor(
    private market: MarketService,
    private marketState: MarketStateService,
    private profile: ProfileService,
    public cache: FavoriteCacheService,
    private snackbar: SnackbarService
  ) {
    this.default().subscribe((id: any) => {
      this.defaultFavId = id;
      this.marketState.register('favorite', 60 * 1000, ['list', id]);
    });
  }

  add(listing: Listing) {
    return this.market.call('favorite', ['add', this.defaultFavId, listing.id])
    .do((data) => {
      this.cache.update();
    });
  }

  remove(listing: Listing) {
    return this.market.call('favorite', ['remove', this.defaultFavId, listing.id])
      .do((data) => {
        this.cache.update();
      });
  }

  default(): Observable<any> {
      // get default profile
      this.log.d('default(): getting default fav!');
      return this.profile.default()
      .map((profile: any) => profile.id)
  }

  toggle(listing: Listing): void {
    if (this.cache.isFavorited(listing) === true) {
      this.remove(listing).take(1).subscribe(res => {
        this.snackbar.open(`${listing.title} removed from Favorites`);
      });
    } else {
      this.add(listing).take(1).subscribe(res => {
        this.snackbar.open(`${listing.title} added to Favorites`);
      });
    }
  }

}
