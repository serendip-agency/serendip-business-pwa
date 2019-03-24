import { Pipe, PipeTransform } from "@angular/core";
import { text } from "serendip-utility";
@Pipe({
  name: "rpd"
})
export class RpdPipe implements PipeTransform {
  transform(value: string): any {
    if (!value) { return ""; }
    return text.replaceEnglishDigitsWithPersian(value.toString());
  }
}
