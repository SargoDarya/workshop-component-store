import { Injectable } from "@angular/core";
import { ToDo } from "./types";
import { ComponentStore, OnStoreInit } from "@ngrx/component-store";
import { Observable } from "rxjs";

interface ToDoListStore {
  toDos: ToDo[]
}

@Injectable()
export class AppComponentStore extends ComponentStore<ToDoListStore> implements OnStoreInit {

  public readonly LOCAL_STORAGE_KEY = 'to-do-items';

  public constructor() {
    super();
  }

  public ngrxOnStoreInit() {
    this.setState({
      toDos: this.readToDosFromLocalStorage()
    })
  }

  /**
   * SELECTORS
   */
  public readonly allToDos$ = this.select((state) => state.toDos);
  public readonly openToDos$ = this.select(this.allToDos$, (allToDos) => allToDos.filter((toDo) => toDo.done === false));
  public readonly doneToDos$ = this.select(this.allToDos$, (allToDos) => allToDos.filter((toDo) => toDo.done === true));

  /**
   * UPDATERS
   */
  public readonly addToDo = this.updater((state, toDoTitle: string) => {
    const toDos = [...state.toDos, { title: toDoTitle, done: false }];
    this.writeToDosToLocalStorage(toDos);
    return { toDos };
  });

  public readonly toggleToDo = this.updater((state, toDo: ToDo) => {
    const targetIndex = state.toDos.indexOf(toDo);
    const toDos = [...state.toDos.slice(0, targetIndex), { ...toDo, done: !toDo.done, }, ...state.toDos.slice(targetIndex + 1)]
    this.writeToDosToLocalStorage(toDos);
    return { toDos };
  });

  public readonly deleteToDo = this.updater((state, toDo: ToDo) => {
    const targetIndex = state.toDos.indexOf(toDo);
    const toDos = [...state.toDos.slice(0, targetIndex), ...state.toDos.slice(targetIndex + 1)];
    this.writeToDosToLocalStorage(toDos);
    return { toDos };
  });

  public readonly deleteDoneToDos = this.updater((state) => {
    const toDos = state.toDos.filter((toDo) => toDo.done !== true);
    this.writeToDosToLocalStorage(toDos);
    return { toDos };
  });

  /**
   * HELPERS
   */

  private readToDosFromLocalStorage(): ToDo[] {
    return JSON.parse(localStorage.getItem('to-do-items') || '[]');
  }

  private writeToDosToLocalStorage(toDos: ToDo[]): void {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(toDos));
  }
}
