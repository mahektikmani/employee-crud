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

 
  ngAfterViewInit(): void {
    this.initMetronic();
  }
ngOnInit(): void {
    this.checkAuth();
   
    const path = window.location.pathname;
   
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

  
        setTimeout(() => this.initMetronic(), 0);
      });
  }

 

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }


  private initMetronic(): void {
    if (!window.KTUtil) {
      console.warn('Metronic not loaded yet'); 
      return;
    }

    
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

    console.log(' Metronic initialized');
  }


  private checkAuth(): void {
    this.isAuthenticated.set(this.authService.isLoggedIn());
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
