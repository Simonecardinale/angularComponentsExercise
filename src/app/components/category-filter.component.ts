import {Component, effect, inject, output, signal} from '@angular/core';
import {AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent} from 'primeng/autocomplete';
import {ExpenseService} from '../../services/expense.service';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';


@Component({
  selector: 'app-category-filter',
  imports: [AutoCompleteModule, FormsModule, Button],
  template: `
    <div id="filter" class="flex">
      <p-autocomplete [(ngModel)]="value" [dropdown]="true" (onSelect)="handleSelectedCategory($event)" [suggestions]="categories()" (completeMethod)="search()" />
      <p-button label="Reset" (onClick)="reset()"></p-button>
    </div>
  `,
  styles: ``
})
export class CategoryFilterComponent {

  categories = signal<string[]>([])
  expenseService: ExpenseService = inject(ExpenseService)
  selectedCategory = output<string | null>()
  value = signal<string | null>(null)


  handleSelectedCategory(event: AutoCompleteSelectEvent) {
    this.selectedCategory.emit(event.value)
    this.value.set(event.value)
  }

  reset() {
    this.selectedCategory.emit(null)
    this.value.set(null)
  }

  search() {
    this.expenseService.getAllCategories().subscribe(res => this.categories.set(res))
  }

}
