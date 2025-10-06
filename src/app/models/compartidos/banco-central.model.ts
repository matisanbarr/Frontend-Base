export interface BancoCentralSerieObs {
  indexDateString: string;
  value: string;
  statusCode: string;
}

export interface BancoCentralSeries {
  descripEsp: string;
  descripIng: string;
  seriesId: string;
  obs: BancoCentralSerieObs[];
}

export interface BancoCentralSeriesInfo {
  seriesId: string;
  frequencyCode: string;
  spanishTitle: string;
  englishTitle: string;
  firstObservation: string;
  lastObservation: string;
  updatedAt: string;
  createdAt: string;
}

export interface BancoCentralGetSeriesResponse {
  codigo: number;
  descripcion: string;
  series: BancoCentralSeries;
  seriesInfos: BancoCentralSeriesInfo[];
}
