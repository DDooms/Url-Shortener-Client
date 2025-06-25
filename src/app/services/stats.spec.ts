import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Stats } from './stats';

describe('Stats Service', () => {
  let service: Stats;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Stats]
    });

    service = TestBed.inject(Stats);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no unmatched requests
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
