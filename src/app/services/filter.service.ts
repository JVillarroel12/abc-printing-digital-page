import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  public deepSearch(item: any, searchText: string): boolean {
    if (item == null) {
      return false;
    }

    if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
      return item.toString().toLowerCase().includes(searchText);
    }

    if (Array.isArray(item)) {
      return item.some(value => this.deepSearch(value, searchText));
    }

    if (typeof item === 'object') {
      return Object.keys(item).some(key => {
        const value = item[key];
        return this.deepSearch(value, searchText);
      });
    }

    return false; 
  }
}
