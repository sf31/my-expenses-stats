import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgChartsModule } from 'ng2-charts';
import { RouterModule, Routes } from '@angular/router';
import { UploadCsvComponent } from './pages/upload-csv.component';
import { PaymentListComponent } from './pages/payment-list.component';
import { ChartListComponent } from './pages/chart-list.component';
import { HeaderComponent } from './components/header.component';
import { BtnComponent } from './components/btn.component';
import { InputSelectComponent } from './components/input-select.component';
import { FilterStringComponent } from './components/filter-string.component';
import { FilterListComponent } from './components/filter-list.component';
import { FilterNumberComponent } from './components/filter-number.component';
import { FilterDateComponent } from './components/filter-date.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { FilterIconComponent } from './components/filter-icon.component';
import { StatsComponent } from './components/stats.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectMultipleComponent } from './components/select-multiple.component';
import { CheckboxComponent } from './components/checkbox.component';
import { ChartComponent } from './components/chart.component';
import { FilterDropdown } from './components/filter-dropdown';
import { ThemeToggleComponent } from './components/theme-toggle.component';
import { FilterPanelComponent } from './components/filter-panel.component';
import { HomeComponent } from './pages/home.component';
import { ChartHeaderComponent } from './components/chart-header.component';
import { FloatingBtnComponent } from './components/floating-btn.component';
import { DndComponent } from './components/dnd.component';
import { UploadInfoComponent } from './components/upload-info.component';
import { DialogModule } from '@angular/cdk/dialog';

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
    BtnComponent,
    InputSelectComponent,
    FilterStringComponent,
    FilterListComponent,
    FilterNumberComponent,
    FilterDateComponent,
    FilterIconComponent,
    StatsComponent,
    SelectMultipleComponent,
    CheckboxComponent,
    ChartComponent,
    FilterDropdown,
    ThemeToggleComponent,
    FilterPanelComponent,
    HomeComponent,
    ChartHeaderComponent,
    FloatingBtnComponent,
    DndComponent,
    UploadInfoComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
