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
  operation: string = '+';
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
      this.display='0';
      this.topDisplay='';
      this.num1 = 0;
      this.num2 = 0;
      this.operation = '+';
      this.resultShown=false;
      return;
    }

    if (btn === '⌫') {
      if(this.display.length > 1) this.display.slice(0, -1);
      else this.display='0';
      return;
    }

    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(btn)) {
      if(this.display='0') this.display = btn;
      else this.display += btn;
      return;
    }

    if (btn === '.') {
      if (!this.display.includes('.')) {
        this.display += '.';
      }
      return;
    }

    if (['+', '-', 'x', '÷'].includes(btn)) {
      this.num2 = parseFloat(this.display);

      this.http.post('http://localhost:8080/api/calculator/calculate', {
      num1: this.num1,
      num2: this.num2,
      operation: this.operation
      }, { responseType: 'text' }).subscribe({
      next: (res) => {
        this.topDisplay = res + btn;
        this.display='';
        this.num1 = parseFloat(res);
      },
      error: () => {
        this.display = 'E';
      }
      });
      this.operation = btn;
      return;
    }

    if(btn === '1/x') {
      this.topDisplay += '1/(' + this.display + ')';
      this.handleUnary('reciprocal');
      return;
    }

    if(btn === 'x²') {
      this.topDisplay += 'sqr(' + this.display + ')';
      this.handleUnary('square');
      return;
    }

    if(btn === '√x') {
      this.topDisplay += 'sqrt(' + this.display + ')';
      this.handleUnary('sqrt');
      return;
    }
    
    if(btn === '+/-') {
      this.handleUnary('sqrt');
      return;
    }

    if (btn === '=') {
      if(this.resultShown) return;
      this.num2 = parseFloat(this.display);
      this.topDisplay='';
      this.http.post('http://localhost:8080/api/calculator/calculate', {
      num1: this.num1,
      num2: this.num2,
      operation: this.operation
      }, { responseType: 'text' }).subscribe({
      next: (res) => {
        this.display = res;
        this.num1 = parseFloat(res);
      },
      error: () => {
        this.display = 'E';
      }
      });
      this.num1=0;
      this.num2=0;
      this.operation='+';
      this.resultShown = true;
      return;
    }
  }


  handleUnary(operation: string) {
  const currentValue = parseFloat(this.display);

  this.http.post('http://localhost:8080/api/calculator/calculate', {
    num1: currentValue,
    num2: 0, //ignored by backend
    operation: operation
  }, { responseType: 'text' }).subscribe({
    next: (res) => {
      this.display = res;             
      this.num1 = parseFloat(res);     
    },
    error: () => {
      this.display = 'E';
    }
  });
}














  // evaluateBackend(num1: number, num2: number, operation: string) {
  //   const opMap: any = { 'x': '*', '÷': '/' }; // match backend symbols
  //   const finalOp = opMap[operation] || operation;

  //   // this.http.post('http://localhost:8080/api/calculator/calculate', {
  //   //   num1: num1,
  //   //   num2: num2,
  //   //   operation: finalOp
  //   // }, { responseType: 'text' }).subscribe({
  //   //   next: (res) => {
  //   //     this.display = res;
  //   //     this.num1 = parseFloat(res);
  //   //     this.resultShown = true;
  //   //   },
  //   //   error: () => {
  //   //     this.display = 'E';
  //   //     this.resultShown = true;
  //   //   }
  //   // });
  // }


}

