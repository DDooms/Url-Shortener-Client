import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShortenUrl } from './shorten-url';
import { Url } from '../../services/url';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';

describe('ShortenUrl Component', () => {
  let component: ShortenUrl;
  let fixture: ComponentFixture<ShortenUrl>;

  let urlServiceMock: jasmine.SpyObj<Url>;
  let toastrMock: jasmine.SpyObj<ToastrService>;
  let spinnerMock: jasmine.SpyObj<NgxSpinnerService>;
  let routerMock: jasmine.SpyObj<Router>;
  let cdrMock: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    urlServiceMock = jasmine.createSpyObj('Url', ['shortenUrl']);
    toastrMock = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info']);
    spinnerMock = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    cdrMock = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      imports: [ShortenUrl],
      declarations: [],
      providers: [
        { provide: Url, useValue: urlServiceMock },
        { provide: ToastrService, useValue: toastrMock },
        { provide: NgxSpinnerService, useValue: spinnerMock },
        { provide: Router, useValue: routerMock },
        { provide: ChangeDetectorRef, useValue: cdrMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShortenUrl);
    component = fixture.componentInstance;
  });

  it('should handle shorten URL error', () => {
    const error = { error: { title: 'Invalid URL' } };
    urlServiceMock.shortenUrl.and.returnValue(throwError(() => error));

    component.shortenUrl();

    expect(spinnerMock.show).toHaveBeenCalled();
    expect(toastrMock.error).toHaveBeenCalledWith('Invalid URL');
    expect(spinnerMock.hide).toHaveBeenCalled();
  });

  it('should extract secret code from URL', () => {
    const url = 'http://domain.com/stats/abc123';
    expect(component.getSecretCodeFromUrl(url)).toBe('abc123');
  });

  it('should copy URL to clipboard and show toast', () => {
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());

    component.copyToClipboard('http://short');
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://short');
    expect(toastrMock.info).toHaveBeenCalledWith('Short URL copied to clipboard!');
  });

  it('should navigate to stats page', () => {
    component.statsUrl = 'http://domain.com/stats/xyz789';
    component.goToStats();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/stats', 'xyz789']);
  });
});
