import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Stats {
  private apiUrl = 'http://localhost:5131/api/stats';

  constructor(private http: HttpClient) {}

  getStats(secretCode: string) {
    return this.http.get<any>(`${this.apiUrl}/${secretCode}`);
  }
}
