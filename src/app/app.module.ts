import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgChartsModule } from 'ng2-charts';
import { RouterModule, Routes } from '@angular/router';
import { LoadCsvComponent } from './components/load-csv.component';
import { PaymentListComponent } from './components/payment-list.component';
import { HomeComponent } from './components/home.component';
import { ChartListComponent } from './components/chart-list.component';
import { HeaderComponent } from './components/header.component';
import { BtnComponent } from './components/btn.component';

const routes: Routes = [];

@NgModule({
  declarations: [
    AppComponent,
    LoadCsvComponent,
    PaymentListComponent,
    HomeComponent,
    ChartListComponent,
    HeaderComponent,
    BtnComponent,
  ],
  imports: [BrowserModule, RouterModule.forRoot(routes), NgChartsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
