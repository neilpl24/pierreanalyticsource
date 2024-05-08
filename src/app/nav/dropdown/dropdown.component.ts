import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent {
  @Input() label: string = 'dropdown-button';
  @Input() options: string[] = []; // List of options to display in the dropdown
  @Output() selectedOption = new EventEmitter<string>();

  isOpen = false; // Flag to track if the dropdown menu is open

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: string) {
    this.selectedOption.emit(option);
    this.isOpen = false; // Close the menu on selection (optional)
  }
}
