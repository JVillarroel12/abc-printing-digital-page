import { Pipe, PipeTransform } from '@angular/core';
import { FilterService } from '../services/filter.service';

@Pipe({
  name: 'dynamicFilter'
})
export class DynamicFilterPipe implements PipeTransform   {
  constructor(
    private filterService: FilterService
  ){

  }
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    
    return items.filter(item => this.filterService.deepSearch(item, searchText));
  }
}