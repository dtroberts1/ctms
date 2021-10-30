import { Pipe, PipeTransform } from '@angular/core';
import { MenuItem } from 'src/app/interfaces/menu-item';
type Selectable = {
  selected: boolean,
}
type SelectableMenuItem = MenuItem & Selectable & {count: number};

@Pipe({
  name: 'simulatorPipe',
  pure: false

})
export class SimulatorPipePipe implements PipeTransform {
    transform(items: MenuItem[], simulatedMenuItems: Array<SelectableMenuItem>): any {

      if (!items || !simulatedMenuItems || !simulatedMenuItems.length) {
          return items;
      }
      // filter items array, items which match and return true will be
      // kept, false will be filtered out
      return items.filter(item => !simulatedMenuItems.some(simItem => simItem.id == item.id));
  }
}