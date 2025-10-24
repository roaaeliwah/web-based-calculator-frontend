import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorService } from '../app/services/calculator';

@Component({
  selector: 'app-calculator',
  imports: [CommonModule],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
})
export class Calculator {
  constructor(private calcService: CalculatorService) {}
  topDisplay: string = ''; // shows operation history like "6 +"
  display: string = '0';   // main display showing current input/result
  num1: number =0;
  num2: number =0;
  operation: string = '+';
  resultShown: boolean = false;

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
      if(this.display.length > 1) this.display = this.display.slice(0, -1);
      else this.display='0';
      return;
    }

    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(btn)) {
      //ignores leftmost 0s
      if(this.display ==='0') this.display = btn;

      //starts a new number if number displayed was the result of a previous operation
      else if(this.resultShown){
        this.display = btn;
        this.num1=0;
        this.num2=0;
        this.operation='+';
      } 

      //concatenates newly added digits
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
      //handles addition if equal was pressed in previous operation
      if(this.display==='E') return;
      if(this.resultShown) {
        this.topDisplay=this.display + btn;
        this.operation = btn;
        this.num1 = parseFloat(this.display);
        this.display='';
        this.resultShown=false; 
        return;
      }
      
      this.num2 = parseFloat(this.display);

      //handles when an operator is pressed more than once or operator is changed
      if(this.display==='' && this.topDisplay!='') {
        this.topDisplay = this.topDisplay.slice(0, -1) + btn;
        this.operation = btn;
        return;
      }

      this.calcService.calculate(this.num1, this.num2, this.operation).subscribe({
        next: (res) => {
          this.topDisplay = res + btn;
          this.display = '';
          this.num1 = parseFloat(res);
        },
        error: () => {
          this.display = 'E';
        }
      });
      this.resultShown=false;
      this.display='';
      this.operation = btn;
      return;
    }

    if(btn === '1/x') {
      if(this.display==='E') return;
      if(this.topDisplay.includes('=')) {
        this.topDisplay='';
      }
      this.topDisplay += '1/(' + this.display + ')';
      this.handleUnary('reciprocal');
      return;
    }

    if(btn === 'x²') {
      if(this.display==='E') return;
      if(this.topDisplay.includes('=')) {
        this.topDisplay='';
      }
      this.topDisplay += 'sqr(' + this.display + ')';
      this.handleUnary('square');
      return;
    }

    if(btn === '√x') {
      if(this.display==='E') return;
      if(this.topDisplay.includes('=')) {
        this.topDisplay='';
      }
      this.topDisplay += 'sqrt(' + this.display + ')';
      this.handleUnary('sqrt');
      return;
    }
    
    if(btn === '+/-') {
      if(this.display==='E') return;
      if(this.topDisplay.includes('=')) {
        this.topDisplay='';
      }
      this.handleUnary('negate');
      return;
    }

    if (btn === '=') {
      //if operator with no second operand does nthn and waits for 2nd operand
      if (['+', '-', 'x', '÷'].includes(this.topDisplay[this.topDisplay.length - 1]) && this.display==='') return;

      if(this.resultShown) return;
      this.num2 = parseFloat(this.display);
      this.topDisplay= this.num1 + this.operation + this.num2 + '=' ;

      this.calcService.calculate(this.num1, this.num2, this.operation).subscribe({
        next: (res) => {
          this.display = res;
          this.num1 = parseFloat(res);
        },
        error: () => {
          this.display = 'E';
        }
      });
      this.num2=0;
      this.resultShown = true;
      return;
    }
  }

  handleUnary(operation: string) {
    const currentValue = parseFloat(this.display);

    this.calcService.calculate(currentValue, 0, operation).subscribe({
      next: (res) => {
        this.display = res;
        this.num2 = parseFloat(res);
      },
      error: () => {
        this.display = 'E';
      }
    });
    
    //in case = was pressed in the previous operation, so previous stored number should be ignored
    if(this.resultShown) {
      this.num1 = 0;
      this.num2 = parseFloat(this.display);
      this.operation = '+';
    }
    this.resultShown=true;
  }


}

