import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TabCommunicationService {
  private activeTabIndexSource = new BehaviorSubject<number>(0);
  activeTabIndex$ = this.activeTabIndexSource.asObservable();

  setActiveTab(index: number) {
    this.activeTabIndexSource.next(index);
  }
}
