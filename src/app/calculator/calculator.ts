import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-calculator',
  imports: [CommonModule],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
})
export class Calculator {
  topDisplay: string = ''; // shows operation history like "6 +"
  display: string = '0';   // main display showing current input/result
  num1: number =0;
  num2: number =0;
  operation: string = '';
  resultShown: boolean = false;

  constructor(private http: HttpClient) {}

  buttons: string[] = [
    '%', 'C', 'CE', '⌫', '1/x', 'x²', '√x', '÷',
    '7', '8', '9', 'x',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '+/-', '0', '.', '='
  ];

  onPress(btn: string) {
    if (btn === 'C' || btn === 'CE') {
      this.clearAll();
      return;
    }

    if (btn === '⌫') {
      if (this.resultShown) return;
      if(this.display.length > 1) this.display.slice(0, -1);
      else this.display='0';
      return;
    }

    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(btn)) {
      if (this.resultShown) {
        // start fresh after showing result
        this.display = btn;
        this.topDisplay = '';
        this.resultShown = false;
        return;
      }
      else {
        this.topDisplay = `${this.num1} ${this.operation}`;
        this.display += btn;
      }
      return;
    }

    // 🔹 Decimal point
    if (btn === '.') {
      this.handleDecimal();
      return;
    }

    // 🔹 Unary operations
    if (['√x', 'x²', '1/x', '+/-'].includes(btn)) {
      this.handleUnary(btn);
      return;
    }

    // 🔹 Binary operations (+, -, x, ÷)
    if (['+', '-', 'x', '÷'].includes(btn)) {
      this.num2 = parseFloat(this.display);
      this.operation = btn;
      this.evaluateBackend(this.num1, this.num2, this.operation);
      
      this.num1 = parseFloat(this.display);
      this.topDisplay = `${this.num1} ${op}`;
      this.resultShown = false;
      this.display = '0';
      return;
    }

    // 🔹 Equals
    if (btn === '=') {
      this.handleEquals();
      return;
    }
  }

  // ================================
  // 💡 HANDLERS
  // ================================

  clearAll() {
    this.display = '0';
    this.topDisplay = '';
    this.num1 = 0;
    this.num2 = 0;
    this.operation = '';
    this.resultShown = false;
  }

  // backspace() {
  //   if (this.resultShown) return;
  //   if (this.display.length > 1) {
  //     this.display = this.display.slice(0, -1);
  //   } else {
  //     this.display = '0';
  //   }
  // }

  // handleNumber(num: string) {
  //   // if (this.resultShown) {
  //   //   // start fresh after showing result
  //   //   this.display = num;
  //   //   this.topDisplay = '';
  //   //   this.resultShown = false;
  //   //   return;
  //   // }

  //   if (this.display === '0') {
  //     this.display = num;
  //   } else {
  //     this.display += num;
  //   }
  // }

  handleDecimal() {
    if (this.resultShown) {
      this.display = '0.';
      this.topDisplay = '';
      this.resultShown = false;
      return;
    }

    if (!this.display.includes('.')) {
      this.display += '.';
    }
  }

  handleUnary(btn: string) {
    let value = parseFloat(this.display);

    switch (btn) {
      case '√x':
        value = Math.sqrt(value);
        break;
      case 'x²':
        value = value * value;
        break;
      case '1/x':
        value = 1 / value;
        break;
      case '+/-':
        value = -value;
        break;
    }

    this.display = value.toString();
    this.resultShown = true;
  }

  // handleOperator(op: string) {
  //   if (this.num1 !== null && !this.resultShown) {
  //     // chain operation
  //     this.num2 = parseFloat(this.display);
  //     this.evaluateBackend(this.num1, this.num2, this.operation);
  //   }

  //   this.operation = op;
  //   this.num1 = parseFloat(this.display);
  //   this.topDisplay = `${this.num1} ${op}`;
  //   this.resultShown = false;
  //   this.display = '0';
  // }

  handleEquals() {
    if (this.operation === '' || this.num1 === null) return;

    this.num2 = parseFloat(this.display);
    this.evaluateBackend(this.num1, this.num2, this.operation);
    this.topDisplay = `${this.num1} ${this.operation} ${this.num2} =`;
  }

  // ================================
  // ⚙️ BACKEND CALL
  // ================================
  evaluateBackend(num1: number, num2: number, operation: string) {
    const opMap: any = { 'x': '*', '÷': '/' }; // match backend symbols
    const finalOp = opMap[operation] || operation;

    this.http.post('http://localhost:8080/api/calculator/calculate', {
      num1: num1,
      num2: num2,
      operation: finalOp
    }, { responseType: 'text' }).subscribe({
      next: (res) => {
        this.display = res;
        this.num1 = parseFloat(res);
        this.resultShown = true;
      },
      error: () => {
        this.display = 'E';
        this.resultShown = true;
      }
    });
  }
}

