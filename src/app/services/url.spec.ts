import { TestBed } from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import { Url } from './url';
import {provideHttpClient} from '@angular/common/http';

describe('Url Service', () => {
  let service: Url;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        Url
      ]

    });

    service = TestBed.inject(Url);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send POST to shorten URL and return short/stats URLs', () => {
    const mockResponse = {
      shortUrl: 'http://short.url/abc',
      statsUrl: 'http://short.url/stats/abc'
    };

    service.shortenUrl('http://long.url/page').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:5131/api/url/shorten');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ url: 'http://long.url/page' });

    req.flush(mockResponse);
  });
});
