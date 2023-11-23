import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { DialogModule } from '@angular/cdk/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgChartsModule } from 'ng2-charts';
import { UploadCsvComponent } from './app/containers/upload-csv.component';
import { ChartListComponent } from './app/containers/chart-list.component';
import { PaymentListComponent } from './app/containers/payment-list.component';
import { provideRouter, Routes } from '@angular/router';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { FilterPanelComponent } from './app/containers/filter-panel.component';
import { HelpMenuComponent } from './app/components/help-menu.component';

const routes: Routes = [
  { path: '', component: PaymentListComponent },
  { path: 'charts', component: ChartListComponent },
  { path: 'upload', component: UploadCsvComponent },
  { path: 'filters', component: FilterPanelComponent },
  { path: 'settings', component: HelpMenuComponent },
  { path: '**', redirectTo: '' },
];

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      NgChartsModule,
      FontAwesomeModule,
      CdkMenuTrigger,
      CdkMenu,
      CdkMenuItem,
      ReactiveFormsModule,
      DialogModule,
    ),
    provideRouter(routes),
  ],
}).catch((err) => console.error(err));
