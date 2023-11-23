import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  currentRoute$: Observable<string>;

  constructor(private router: Router) {
    this.currentRoute$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => {
        const url = (event as NavigationEnd).url;
        const route = url.split('/').pop();
        return route ?? '';
      }),
    );
  }
}
