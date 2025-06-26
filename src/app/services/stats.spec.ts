import { TestBed } from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import { Stats } from './stats';
import {provideHttpClient} from '@angular/common/http';

describe('Stats Service', () => {
  let service: Stats;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        Stats
      ]

    });

    service = TestBed.inject(Stats);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch stats by secret code', () => {
    const mockResponse = {
      uniqueVisitsPerDay: [{ date: '2025-06-20', count: 5 }],
      topIps: [{ ip: '::1', count: 3 }]
    };

    service.getStats('abc123').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:5131/api/stats/abc123');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
