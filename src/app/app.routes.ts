import { Routes } from '@angular/router';
import {ShortenUrl} from './components/shorten-url/shorten-url';
import {ViewStats} from './components/view-stats/view-stats';

export const routes: Routes = [
  { path: '', component: ShortenUrl },
  { path: 'stats/:secretCode', component: ViewStats },
  { path: '**', redirectTo: '' }
];

