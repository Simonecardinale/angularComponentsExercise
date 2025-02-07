import {Component, effect, inject, input, linkedSignal, OnInit, output, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import {ExpenseService} from '../../services/expense.service';
import {Expense} from '../../models/expenses';
import {InputNumber} from 'primeng/inputnumber';
import {ModalStatus} from '../app.component';

@Component({
  selector: 'app-modal-expenses',
  imports: [
    Button,
    Dialog,
    InputText,
    ReactiveFormsModule,
    DatePickerModule,
    InputNumber
  ],
  template: `
    <div class="card flex justify-center">
      <p-dialog header="Edit Profile" [modal]="true" [closable]="false" [visible]="newVisible().isOpen" [style]="{ width: '40em' }">
        <span class="p-text-secondary block mb-8">Update your information.</span>
        <form class="w-2/3 mx-auto" [formGroup]="modalForm">
          <div class="flex items-center gap-4 mb-4">
            <label for="id" class="font-semibold w-24">ID</label>
            <input pInputText  formControlName="id" id="id" class="flex-auto" autocomplete="off"/>
          </div>
          <div class="flex items-center gap-4 mb-8">
            <label for="description" class="font-semibold w-24">Description</label>
            <input pInputText id="description" formControlName="description" class="flex-auto" autocomplete="off"/>
          </div>
          <div class="flex items-center gap-4 mb-8">
            <label for="amount" class="font-semibold w-24">Amount</label>
            <p-inputnumber id="amount" formControlName="amount" class="flex-auto" autocomplete="off"></p-inputnumber>
          </div>
          <div class="flex items-center gap-4 mb-8">
            <label for="category" class="font-semibold w-24">Category</label>
            <input pInputText id="category" formControlName="category" class="flex-auto" autocomplete="off"/>
          </div>
          <div class="flex items-center gap-4 mb-8">
            <label for="date" class="font-semibold w-24">Date</label>
            <p-datepicker formControlName="date"  dateFormat="yy-mm-dd"></p-datepicker>
          </div>
          <div class="flex justify-end gap-2">
            <p-button label="Cancel" severity="secondary" (click)="setNotVisible()"/>
            <p-button label="Save" (click)="confirm()" />
          </div>
        </form>
      </p-dialog>
    </div>
  `,
  styles: ``
})
export class ModalExpensesComponent {

  fb = inject(FormBuilder);
  expenseService = inject(ExpenseService);

  visible = input.required<ModalStatus>()
  newVisible = linkedSignal(() => this.visible())

  visibleChange = output<ModalStatus>()

  constructor() {
    effect(() => {
      if(this.newVisible().expense !== null)  {
        this.modalForm.setValue({
          ...this.newVisible().expense!,
          date: new Date(this.newVisible().expense!.date)
        })}
    });
  }

  modalForm = this.fb.group({
    id: ["" , Validators.required],
    description: ["", Validators.required],
    amount: [null as number | null, Validators.required],
    category: ["", Validators.required],
    date: [new Date(), Validators.required],
  })

  confirm() {
    this.expenseService.handleExpenseAction(this.modalForm, this.newVisible().action)
    this.setNotVisible()
  }


  setNotVisible() {
    this.visibleChange.emit({isOpen: false, expense: null, action: null});
    this.modalForm.reset();
  }


}
