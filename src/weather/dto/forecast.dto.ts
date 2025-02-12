class ForecastDayDto {
  date: string;
  day: {
    avgtemp_c: number;
    avgtemp_f: number;
    maxwind_kph: number;
    avghumidity: number;
  };
}

export class ForecastDto {
  forecastday: ForecastDayDto[];
}
