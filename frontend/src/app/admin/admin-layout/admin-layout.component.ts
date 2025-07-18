import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { AdminService } from '../../core/services/admin.service';

import { MatCardModule } from '@angular/material/card';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-admin-layout',
  imports: [
    MatCardModule,
    MatSidenavModule,
    MatTooltipModule,
    RouterModule
],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})


export class AdminLayoutComponent implements OnInit, OnDestroy {

  @ViewChild('sidenav') sidenav!: MatSidenav;

  isSmallScreen: boolean = false;
  sidenavOpened: boolean = false;
  sessionIndex: string | null = null;

  subscriptions: Subscription = new Subscription();

  constructor(
    private adminService: AdminService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    this.adjustSidenav();
    this.initializeSubscription();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  adjustSidenav(): void {
    this.breakpointObserver
      .observe(['(max-width: 1200px)'])
      .subscribe((result: BreakpointState) => {
        this.isSmallScreen = result.matches;
        this.sidenavOpened = !this.isSmallScreen;
      });
  }

  initializeSubscription(): void {
    this.subscriptions.add(
      this.adminService.toggle$.subscribe(() => {
        this.sidenav.toggle();
      })
    );
  }
}