import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, Observable, take } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { StoreService } from './store.service';
import { UploadCsvDialogComponent } from './containers/upload-csv-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  currentRoute$: Observable<string>;

  constructor(
    private router: Router,
    private dialog: Dialog,
    private store: StoreService,
  ) {
    this.currentRoute$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => {
        const url = (event as NavigationEnd).url;
        const route = url.split('/').pop();
        return route ?? '';
      }),
    );
  }

  toggleUploadDialog(): void {
    this.store
      .select('isMobile')
      .pipe(take(1))
      .subscribe((isMobile) => {
        isMobile
          ? this.router.navigate(['/upload'])
          : this.dialog.open(UploadCsvDialogComponent, {
              autoFocus: false,
            });
      });
  }
}
