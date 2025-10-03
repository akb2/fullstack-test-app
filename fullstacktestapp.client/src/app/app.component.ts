import { HttpClient } from "@angular/common/http";
import { Component, inject, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { switchMap, timer } from "rxjs";

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  private readonly httpClient = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  readonly title = "fullstacktestapp.client";

  forecasts: WeatherForecast[] = [];

  trackFn (index: number, item: WeatherForecast) {
    const items: Array<string | number> = [
      index,
      item.date,
    ];

    return items.join("---");
  }

  ngOnInit () {
    this.getForecasts();
  }

  private getForecasts () {
    timer(0, 2000)
      .pipe(
        switchMap(() => this.httpClient.get<WeatherForecast[]>("/weatherforecast")),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: result => {
          this.forecasts = result;
          this.changeDetectorRef.markForCheck();
        },
        error: console.error
      });
  }
}
