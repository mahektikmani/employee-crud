import {
  Component,
  signal,
  OnInit,
  OnDestroy,
  AfterViewInit,
  inject
} from '@angular/core';
import {
  Router,
  RouterOutlet,
  RouterLink,
  NavigationEnd
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { AuthService } from './auth-service';

/* Metronic globals (v8) */
declare global {
  interface Window {
    KTUtil: any;
    KTApp: any;
    KTMenu: any;
    KTDrawer: any;
    KTScroll: any;
    KTToggle: any;
    KTSwapper: any;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy, AfterViewInit {

  isAuthenticated = signal(inject(AuthService).isLoggedIn());
  isAuthPage = signal(false);

  private sub?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  /* Run once after Angular renders DOM */
  ngAfterViewInit(): void {
    this.initMetronic();
  }

  ngOnInit(): void {
    this.checkAuth();
    // Initialize isAuthPage based on current route
    // Initialize isAuthPage based on current window location to prevent flash
    const path = window.location.pathname;
    // If not logged in, assume it's an auth page (or we're about to be redirected to one)
    // This prevents the dashboard layout from flashing when accessing protected routes while logged out
    const isLoggedIn = this.authService.isLoggedIn();

    this.isAuthPage.set(
      !isLoggedIn || path.includes('/login') || path.includes('/register') || path === '/'
    );

    this.sub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const url = e.urlAfterRedirects;

        this.isAuthPage.set(
          url.startsWith('/login') || url.startsWith('/register')
        );

        this.checkAuth();

        // Re-init Metronic after route change
        setTimeout(() => this.initMetronic(), 0);
      });
  }

  /* Auth page check is handled by the signal in ngOnInit */

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /* -------- METRONIC INIT (v8) -------- */
  private initMetronic(): void {
    if (!window.KTUtil) {
      console.warn('Metronic not loaded yet');
      return;
    }

    // Metronic v8 auto-init
    if (window.KTApp) {
      window.KTApp.init();
    }

    if (window.KTMenu) {
      window.KTMenu.createInstances('[data-kt-menu="true"]');
    }

    if (window.KTDrawer) {
      window.KTDrawer.createInstances('[data-kt-drawer="true"]');
    }

    if (window.KTScroll) {
      window.KTScroll.createInstances('[data-kt-scroll="true"]');
    }

    if (window.KTToggle) {
      window.KTToggle.createInstances('[data-kt-toggle="true"]');
    }

    if (window.KTSwapper) {
      window.KTSwapper.createInstances('[data-kt-swapper="true"]');
    }

    console.log('✅ Metronic initialized');
  }

  /* -------- AUTH -------- */
  private checkAuth(): void {
    this.isAuthenticated.set(this.authService.isLoggedIn());
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
