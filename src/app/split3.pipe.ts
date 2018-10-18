import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'split3'
})
export class Split3Pipe implements PipeTransform {

  transform(value: string | number): string {

    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

}
