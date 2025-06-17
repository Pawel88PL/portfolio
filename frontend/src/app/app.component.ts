import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { SessionService } from './core/services/session.service';
import { Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { JwtService } from './core/services/jwt.service';

@Component({
  selector: 'app-root',
  imports: [
    FooterComponent,
    NavbarComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {
  title = 'Portfolio';

  constructor(
    private activatedRoute: ActivatedRoute,
    private jwtService: JwtService,
    private router: Router,
    private sessionService: SessionService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.clearExpiredTokenIfNeeded();
    this.startTokenMonitor();
    this.setupDynamicPageTitle();
  }

  /**
   * Usuwa przeterminowany token, jeśli jest w localStorage
   */
  private clearExpiredTokenIfNeeded(): void {
    const token = this.jwtService.getToken();
    const expiration = this.jwtService.getTokenExpirationDate();

    if (token && expiration && new Date(expiration) < new Date()) {
      console.warn('Token wygasł — usuwam z localStorage');
      this.jwtService.clearToken();
    }
  }

  /**
   * Uruchamia cykliczne sprawdzanie ważności tokenu
   */
  private startTokenMonitor(): void {
    this.sessionService.startTokenExpirationCheck();
  }

  /**
   * Ustawia tytuł strony dynamicznie na podstawie danych z routingu
   */
  private setupDynamicPageTitle(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      )
      .subscribe(data => {
        const newTitle = data['title'];
        if (newTitle) {
          this.titleService.setTitle(newTitle);
        }
      });
  }
}
