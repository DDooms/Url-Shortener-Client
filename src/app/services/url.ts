import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

interface ShortenUrlRequest {
  url: string;
}

interface ShortenUrlResponse {
  shortUrl: string;
  statsUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class Url {
  private apiUrl = 'http://localhost:5131/api/url/shorten';

  constructor(private http: HttpClient) {}

  shortenUrl(url: string): Observable<ShortenUrlResponse> {
    const payload: ShortenUrlRequest = { url };
    return this.http.post<ShortenUrlResponse>(this.apiUrl, payload);
  }
}
