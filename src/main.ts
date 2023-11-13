import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { DialogModule } from '@angular/cdk/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgChartsModule } from 'ng2-charts';
import { UploadCsvComponent } from './app/pages/upload-csv.component';
import { ChartListComponent } from './app/pages/chart-list.component';
import { PaymentListComponent } from './app/pages/payment-list.component';
import { HomeComponent } from './app/pages/home.component';
import { provideRouter, Routes } from '@angular/router';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: PaymentListComponent },
      { path: 'charts', component: ChartListComponent },
    ],
  },
  { path: 'upload', component: UploadCsvComponent },
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
