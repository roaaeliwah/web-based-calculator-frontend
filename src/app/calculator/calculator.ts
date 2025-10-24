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
      if(this.resultShown) {
        this.topDisplay='';
        return;
      }
      if(this.display.length > 1) this.display.slice(0, -1);
      else this.display='0';
      return;
    }

    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(btn)) {
      if(this.display='0') this.display = btn;
      else this.display += btn;
      this.resultShown=false;
      return;
    }

    if (btn === '.') {
      if(this.resultShown) this.display='0' + btn;
      if (!this.display.includes('.')) {
        this.display += '.';
      }
      this.resultShown=false;
      return;
    }

    if (['+', '-', 'x', '÷'].includes(btn)) {

      if(this.resultShown) {
        this.topDisplay=this.display + btn;
        this.operation = btn;
        this.num1 = parseFloat(this.display);
        this.display='';
        return;
      }

      this.resultShown=false;
      if(this.display==='' && this.topDisplay!='') {
        this.topDisplay = this.topDisplay.slice(0, -1) + btn;
        return;
      }
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
      this.resultShown=false;
      return;
    }

    if(btn === '1/x') {
      this.resultShown=false;
      this.topDisplay += '1/(' + this.display + ')';
      this.handleUnary('reciprocal');
      return;
    }

    if(btn === 'x²') {
      this.resultShown=false;
      this.topDisplay += 'sqr(' + this.display + ')';
      this.handleUnary('square');
      return;
    }

    if(btn === '√x') {
      this.resultShown=false;
      this.topDisplay += 'sqrt(' + this.display + ')';
      this.handleUnary('sqrt');
      return;
    }
    
    if(btn === '+/-') {
      this.resultShown=false;
      this.handleUnary('negate');
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

