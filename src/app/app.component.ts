import { Component } from '@angular/core';
import { CreateToDoComponent } from './create-to-do/create-to-do.component';
import { ListToDosComponent } from './list-to-dos/list-to-dos.component';
import { ToDo } from './types';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AppComponentStore } from './app.component.store';
import { provideComponentStore } from '@ngrx/component-store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [CommonModule, CreateToDoComponent, ListToDosComponent],
  providers: [ provideComponentStore(AppComponentStore) ]
})
export class AppComponent {
  // Replace with proper selectors
  public openToDos$ = this.store.openToDos$;
  public doneToDos$ = this.store.doneToDos$;

  public constructor(
    private readonly store: AppComponentStore
  ) {}

  public createToDo(title: string): void {
    this.store.addToDo(title);
  }

  public toggleToDo(toDo: ToDo): void {
    this.store.toggleToDo(toDo);
  }

  public deleteToDo(toDo: ToDo): void {
    this.store.deleteToDo(toDo);
  }

  public deleteDoneToDos(): void {
    this.store.deleteDoneToDos();
  }

}
