// firm-selection.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface selectedFirmName {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirmSelectionService {
  private selectedFirmName = new BehaviorSubject<selectedFirmName | null>(null);
  selectedFirmName$ = this.selectedFirmName.asObservable();

  setselectedFirmName(firm: selectedFirmName) {
    this.selectedFirmName.next(firm);
    localStorage.setItem('firm_id', firm.id.toString());
  }

  getselectedFirmName(): selectedFirmName | null {
    return this.selectedFirmName.value;
  }
}
