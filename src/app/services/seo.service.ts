import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(private meta: Meta) {}

  updateMetaTags(description: string) {
    this.meta.updateTag({ name: 'description', content: description });
  }
}
