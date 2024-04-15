import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {
  transform(value: any[], searchTerm?: any): any[] {
    if (!value || !searchTerm) {
      return value;
    }

    // Split the searchTerm into words
    const searchWords = searchTerm.toLowerCase().split(' ');

    return value.filter(item => {
      // Iterate through object properties
      for (const key in item) {
        if (item.hasOwnProperty(key) && typeof item[key] === 'string') {
          // Convert the field value to lowercase
          const fieldValue = item[key].toLowerCase();

          // Check if all searchWords are found in the fieldValue
          if (searchWords.every(word => fieldValue.includes(word))) {
            return true; // Include the item if all words are found in any field
          }
        }
      }
      return false; // Exclude the item if no match is found in any field
    });
  }
}
