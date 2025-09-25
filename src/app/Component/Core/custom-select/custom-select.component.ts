import { Component,Input,Output,EventEmitter,forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-custom-select',
  imports: [NgFor, NgClass, FormsModule,NgIf],
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    },
  ],
})
export class CustomSelectComponent implements AfterViewInit, OnChanges{
  @Input() label: string = '';
  @Input() options: string[] = [];
  @Input() selected: string = '';
  @Input() readonly: boolean = false;
  @Output() selectedChange = new EventEmitter<string>();
  @Input() selectId: string = '';
  @Input() highlightAddCategory: boolean = false;
  @ViewChildren('dropdownOption') optionElements!: QueryList<ElementRef>;


  searchQuery: string = '';
  showDropdown: boolean = false;


  onChange = (_: any) => {};
  onTouched = () => {};
  disabled = false;
  @Input() searchable: boolean = true;

  writeValue(value: any): void {
    this.selected = value;
    this.searchQuery = value || '';
  }

  ngAfterViewInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selected']) {
      this.searchQuery = this.selected || '';
    }
  }


  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selected = value;
    this.selectedChange.emit(value);
    this.onChange(value);
    this.onTouched();
  }


  handleSelect(option: string): void {
    this.selected = option;
    this.searchQuery = option;
    this.selectedChange.emit(option);
    this.onChange(option);
    this.onTouched();
    this.showDropdown = false;
  }

  get filteredOptions(): string[] {
    const query = (this.searchQuery || '').toLowerCase();

    const exactMatch = this.options.some(
      opt => (opt || '').toLowerCase() === query
    );

    return exactMatch ? this.options : this.options.filter(opt => (opt || '').toLowerCase().includes(query));
  }


  isAddOtherOption(option: string): boolean {
    return this.highlightAddCategory && option?.trim() === '+ Add Other';
  }

  handleInputBlur(event: FocusEvent): void {
    setTimeout(() => {
      this.showDropdown = false;

      this.selected = this.searchQuery;
      this.selectedChange.emit(this.searchQuery);
      this.onChange(this.searchQuery);
      this.onTouched();
      this.highlightedIndex = -1;
    }, 150);
  }

  onFocusInput(): void {
    this.showDropdown = true;
  }

  highlightedIndex: number = -1;

  onKeydown(event: KeyboardEvent): void {
    if (!this.showDropdown || this.filteredOptions.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        this.highlightedIndex = (this.highlightedIndex + 1) % this.filteredOptions.length;
        this.scrollHighlightedIntoView();
        event.preventDefault();
        break;

      case 'ArrowUp':
        this.highlightedIndex =
          (this.highlightedIndex - 1 + this.filteredOptions.length) % this.filteredOptions.length;
        this.scrollHighlightedIntoView();
        event.preventDefault();
        break;

      case 'Enter':
        if (this.highlightedIndex >= 0 && this.highlightedIndex < this.filteredOptions.length) {
          this.handleSelect(this.filteredOptions[this.highlightedIndex]);
        }
        event.preventDefault();
        break;

      case 'Escape':
        this.showDropdown = false;
        event.preventDefault();
        break;
    }
  }

  scrollHighlightedIntoView(): void {
    setTimeout(() => {
      const options = this.optionElements.toArray();
      const el = options[this.highlightedIndex];
      if (el) {
        el.nativeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  }


}
