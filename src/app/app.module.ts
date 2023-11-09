import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgChartsModule } from 'ng2-charts';
import { RouterModule, Routes } from '@angular/router';
import { UploadCsvComponent } from './pages/upload-csv.component';
import { PaymentListComponent } from './pages/payment-list.component';
import { ChartListComponent } from './pages/chart-list.component';
import { HeaderComponent } from './components/header.component';
import { BtnComponent } from './shared/btn.component';
import { FilterStringComponent } from './components/filter-string.component';
import { FilterListComponent } from './components/filter-list.component';
import { FilterNumberComponent } from './components/filter-number.component';
import { FilterDateComponent } from './components/filter-date.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { StatsComponent } from './components/stats.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectMultipleComponent } from './components/select-multiple.component';
import { CheckboxComponent } from './components/checkbox.component';
import { ChartComponent } from './components/chart.component';
import { FilterDropdown } from './components/filter-dropdown';
import { HelpMenuComponent } from './components/help-menu.component';
import { FilterPanelComponent } from './components/filter-panel.component';
import { HomeComponent } from './pages/home.component';
import { ChartHeaderComponent } from './components/chart-header.component';
import { FloatingBtnComponent } from './components/floating-btn.component';
import { DndComponent } from './components/dnd.component';
import { UploadInfoComponent } from './components/upload-info.component';
import { DialogModule } from '@angular/cdk/dialog';
import { AddChartComponent } from './components/add-chart.component';
import { SelectComponent } from './components/select.component';
import { CardComponent } from './shared/card.component';

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

@NgModule({
  declarations: [
    AppComponent,
    UploadCsvComponent,
    PaymentListComponent,
    ChartListComponent,
    HeaderComponent,
    FilterStringComponent,
    FilterListComponent,
    FilterNumberComponent,
    FilterDateComponent,
    StatsComponent,
    SelectMultipleComponent,
    CheckboxComponent,
    ChartComponent,
    FilterDropdown,
    HelpMenuComponent,
    FilterPanelComponent,
    HomeComponent,
    ChartHeaderComponent,
    FloatingBtnComponent,
    DndComponent,
    UploadInfoComponent,
    AddChartComponent,
    SelectComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    NgChartsModule,
    FontAwesomeModule,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    ReactiveFormsModule,
    DialogModule,
    CardComponent,
    BtnComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
