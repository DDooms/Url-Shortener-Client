import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewStats } from './view-stats';
import { Stats } from '../../services/stats';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ElementRef } from '@angular/core';
import Chart from 'chart.js/auto';

describe('ViewStats Component', () => {
  let component: ViewStats;
  let fixture: ComponentFixture<ViewStats>;
  let statsServiceMock: jasmine.SpyObj<Stats>;

  const mockRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => 'secret123'
      }
    }
  };

  beforeEach(async () => {
    statsServiceMock = jasmine.createSpyObj('Stats', ['getStats']);

    await TestBed.configureTestingModule({
      imports: [ViewStats],
      declarations: [],
      providers: [
        { provide: Stats, useValue: statsServiceMock },
        { provide: ActivatedRoute, useValue: mockRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewStats);
    component = fixture.componentInstance;

    // Mock the canvas DOM elements
    component.barCanvas = new ElementRef(document.createElement('canvas'));
    component.pieCanvas = new ElementRef(document.createElement('canvas'));
  });

  it('should create bar and pie charts on init', () => {
    const mockData = {
      uniqueVisitsPerDay: [
        { date: '2025-06-20', count: 5 },
        { date: '2025-06-21', count: 3 }
      ],
      topIps: [
        { ip: '127.0.0.1', count: 4 },
        { ip: '::1', count: 2 }
      ]
    };

    statsServiceMock.getStats.and.returnValue(of(mockData));
    component.ngAfterViewInit();

    expect(statsServiceMock.getStats).toHaveBeenCalledWith('secret123');
    expect(component.barChart).toBeDefined();
    expect(component.pieChart).toBeDefined();
    expect((component.barChart.config as any).type).toBe('bar');
    expect((component.pieChart.config as any).type).toBe('pie');
  });

  it('should destroy both charts on ngOnDestroy', () => {
    // Mock charts with destroy spies
    component.barChart = jasmine.createSpyObj<Chart>('Chart', ['destroy']);
    component.pieChart = jasmine.createSpyObj<Chart>('Chart', ['destroy']);

    component.ngOnDestroy();

    expect(component.barChart.destroy).toHaveBeenCalled();
    expect(component.pieChart.destroy).toHaveBeenCalled();
  });
});
