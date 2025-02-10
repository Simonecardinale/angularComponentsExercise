import {Component, output, signal} from '@angular/core';
import {NavbarComponent} from './components/navbar.component';
import {ExpenseListComponent} from './components/expense-list.component';
import {ModalExpensesComponent} from './components/modal-expenses.component';
import {Expense} from '../models/expenses';
import {CategoryFilterComponent} from './components/category-filter.component';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, ExpenseListComponent, ModalExpensesComponent, CategoryFilterComponent],
  template: `
    <app-navbar />
    <app-category-filter (selectedCategory)="handleCategoryFilter($event)" />
    <app-expense-list
      (isModalVisible)="handleModalStatus($event)"
      (visibleChange)="handleModalStatus($event)"
      [modalStatus]="modalStatus()"
      [selectedCategory]="selectedCategory()"
    />
    <app-modal-expenses
      [visible]="modalStatus()"
      (visibleChange)="handleModalStatus($event)"/>

  `,
  styles: [],
})
export class AppComponent {

  modalStatus = signal<ModalStatus>({isOpen: false, expense: null, action: null});
  selectedCategory = signal<string | null>(null);

  handleModalStatus(event: ModalStatus) {
    this.modalStatus.set({isOpen: event.isOpen, expense: event.expense, action: event.action});
  }

  handleCategoryFilter(event: string) {
    this.selectedCategory.set(event);
  }

}

export type ModalStatus = {
  isOpen: boolean;
  expense: Expense | null;
  action: ActionToDo
}

export type ActionToDo = "add" | "edit" | "delete" | null
