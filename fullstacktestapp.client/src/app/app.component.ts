import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  private readonly httpClient = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  forecasts: WeatherForecast[] = [];

  ngOnInit () {
    this.getForecasts();
  }

  getForecasts () {
    this.httpClient.get<WeatherForecast[]>('/weatherforecast')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: result => {
          this.forecasts = result;
          this.changeDetectorRef.markForCheck();
        },
        error: console.error
      });
  }

  title = 'fullstacktestapp.client';
}
