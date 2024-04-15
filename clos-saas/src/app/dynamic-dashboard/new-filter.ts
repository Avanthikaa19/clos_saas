import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'newFilter'
})

export class NewSearchFilterPipe implements PipeTransform {
    transform(value: any[], searchTerm: string): any[] {
      if (!value || !searchTerm) {
        return value;
      }
  
      const searchWords = searchTerm.toLowerCase().split(' ');
  
      return value.filter(item => {
        const itemString = JSON.stringify(item).toLowerCase();
        return searchWords.every(word => itemString.includes(word));
      });
    }
  }