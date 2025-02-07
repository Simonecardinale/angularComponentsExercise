import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Expense} from '../models/expenses';
import {concatMap, map, Observable, switchMap} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {ActionToDo} from '../app/app.component';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  http = inject(HttpClient)

  getAllExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>('http://localhost:3000/expenses')
  }

  addNewExpense(expense: Expense): Observable<Expense[]> {
    return this.http.post<Expense[]>('http://localhost:3000/expenses', expense)
  }

  editExpense(expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`http://localhost:3000/expenses/${expense.id}`, expense)
  }

  deleteExpense(id: string): Observable<Expense> {
    return this.http.delete<Expense>(`http://localhost:3000/expenses/${id}`)
  }


  handleExpenseAction(form: FormGroup, action: ActionToDo, id?: string) {
    if(form.valid){
      switch (action) {
        case 'edit':
          this.editExpense(form.value as Expense).subscribe()
          break;
        case "add":
          this.addNewExpense(form.value as Expense).subscribe()
          break;
        default:
          return;
      }
    }
    if (action === 'delete' && !!id) {
      this.deleteExpense(id).subscribe()
    }
  }
}
