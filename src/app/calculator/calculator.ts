import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calculator',
  imports: [CommonModule],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
})
export class Calculator {
  display: string="";
  buttons: string[]=[
    '%', 'C', 'CE', '⌫', '1/x', 'x²', '√x', '÷', '7', '8', '9', 'x', '4', '5', '6', '-', '1', '2', '3', '+',
    '+/-', '0', '.', '='
  ];
}
