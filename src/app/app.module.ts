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
import { FilterComponent } from './components/filter.component';
import { InputSelectComponent } from './components/input-select.component';
import { FilterStringComponent } from './components/filter-string.component';
import { FilterListComponent } from './components/filter-list.component';
import { FilterNumberComponent } from './components/filter-number.component';
import { FilterDateComponent } from './components/filter-date.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { FilterIconComponent } from './components/filter-icon.component';
import { StatsComponent } from './components/stats.component';

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
    FilterComponent,
    InputSelectComponent,
    FilterStringComponent,
    FilterListComponent,
    FilterNumberComponent,
    FilterDateComponent,
    FilterIconComponent,
    StatsComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    NgChartsModule,
    FontAwesomeModule,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
