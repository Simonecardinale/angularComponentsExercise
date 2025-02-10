import {Component, effect, inject, input, linkedSignal, output, signal} from '@angular/core';
import {PopoverModule} from 'primeng/popover';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {TagModule} from 'primeng/tag';
import {MessageService} from 'primeng/api';
import {Expense} from '../../models/expenses';
import {ExpenseService} from '../../services/expense.service';
import {DatePipe} from '@angular/common';
import {ActionToDo, ModalStatus} from '../app.component';

@Component({
  selector: 'app-expense-list',
  imports: [PopoverModule, TableModule, ButtonModule, TagModule, DatePipe],
  providers: [MessageService],
  template: `
    @defer (when !!expenses().length) {

      <div class="mt-5">
        <p-button label="Add new expense" (onClick)="defineActionToDo('add', null)" />
      </div>

      <div class="card mt-5">
        <p-table [value]="expenses()" [tableStyle]="{ 'min-width': '50rem' }" [rows]="5">
          <ng-template #header>
            <tr>
              <th class="w-1/6">Id</th>
              <th class="w-1/6">Description</th>
              <th class="w-1/6">Amount</th>
              <th class="w-1/6">Category</th>
              <th class="w-1/6">Date</th>
              <th class="w-1/6">Actions</th>
            </tr>
          </ng-template>
          <ng-template #body let-product>
            <tr>
              <td>{{ product.id }}</td>
              <td>{{ product.description }}</td>
              <td>$ {{ product.amount }}</td>
              <td>{{ product.category }}</td>
              <td>{{product.date | date: "YYYY-MM-dd"}}</td>
              <td class="flex gap-2">
                <p-button (click)="defineActionToDo('edit', product)" label="Edit" severity="info" />
                <p-button (click)="defineActionToDo('delete', product)" label="Delete" severity="danger" />
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    }
  `,
  styles: ``
})
export class ExpenseListComponent {
  expenses = signal<Expense[]>([])
  expensesCopy: Expense[] = [];
  expensesService = inject(ExpenseService)
  isModalVisible = output<ModalStatus>()
  modalStatus = input<ModalStatus>()
  visibleChange = output<ModalStatus>()
  selectedCategory = input<string | null>()


  constructor() {
    effect(() => {
      if(!this.modalStatus()?.action !== null && this.selectedCategory() === null) {
        this.expensesService.getAllExpenses().subscribe({
          next: results => {
            this.expenses.set(results)
            this.expensesCopy = [...results]
          }
        })
      }

      if(!!this.selectedCategory()) {
        console.log(this.expensesCopy)
        const results = this.expensesCopy.filter(elem => elem.category === this.selectedCategory())
        console.log(results)
        this.expenses.set(results)
      }

    });
  }


  defineActionToDo(action: ActionToDo, expense: Expense | null) {
    switch (action) {
      case 'add':
        this.isModalVisible.emit({isOpen: true, expense: null, action: "add"});
        break;
      case 'edit':
        this.isModalVisible.emit({isOpen: true, expense: expense, action: "edit"});
        break;
      case 'delete':
        this.expensesService.deleteExpense(expense!.id).subscribe({
          next: () => {
            this.visibleChange.emit({isOpen: false, expense: null, action: null});
          }
        })
        break;
      default:
        return
    }
  }

}


