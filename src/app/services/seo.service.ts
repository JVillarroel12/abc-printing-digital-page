import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';

export interface SeoData {
  title: string;
  description: string;
  //image: string;
  slug: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  //private readonly baseUrl = 'https://www.abcprintingdigital.com';

  constructor(
    private meta: Meta,
    private router: Router,
    private title: Title
  ) {}

  updateSeoData(data: SeoData): void {
    //const url = `${this.baseUrl}/${data.slug}`;

    this.title.setTitle(data.title);

    this.meta.updateTag({ name: 'description', content: data.description });

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    //this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:title', content: data.title });
    this.meta.updateTag({
      property: 'og:description',
      content: data.description,
    });
    //this.meta.updateTag({ property: 'og:image', content: data.image });

    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    //this.meta.updateTag({ name: 'twitter:url', content: url });
    this.meta.updateTag({ name: 'twitter:title', content: data.title });
    this.meta.updateTag({
      name: 'twitter:description',
      content: data.description,
    });
    //this.meta.updateTag({ name: 'twitter:image', content: data.image });
  }
}
