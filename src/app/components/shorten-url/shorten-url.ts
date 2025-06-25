import {ChangeDetectorRef, Component} from '@angular/core';
import {Url} from '../../services/url';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerComponent, NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-shorten-url',
  imports: [
    FormsModule,
    NgxSpinnerComponent
  ],
  templateUrl: './shorten-url.html',
  styleUrl: './shorten-url.css'
})
export class ShortenUrl {
  longUrl: string = '';
  shortUrl: string = '';
  statsUrl: string = '';
  error: string = '';

  constructor(private urlService: Url,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService,
              private router: Router,
              private cdr: ChangeDetectorRef) {}

  shortenUrl() {
    this.shortUrl = '';
    this.statsUrl = '';
    this.spinner.show();

    this.urlService.shortenUrl(this.longUrl).subscribe({
      next: (res) => {
        this.shortUrl = res.shortUrl;
        this.statsUrl = res.statsUrl;
        this.toastr.success('🎉 URL shortened successfully!');
        this.cdr.detectChanges();
        this.spinner.hide();
      },
      error: (err) => {
        this.toastr.error(err.error?.title || '❌ Failed to shorten URL.');
        this.spinner.hide();
      }
    });
  }

  getSecretCodeFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    this.toastr.info('Short URL copied to clipboard!');
  }

  goToStats() {
    const secretCode = this.getSecretCodeFromUrl(this.statsUrl);
    this.router.navigate(['/stats', secretCode]);
  }
}
