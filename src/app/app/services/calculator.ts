import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  private apiUrl = 'http://localhost:8080/api/calculator/calculate';

  constructor(private http: HttpClient) {}

  calculate(num1: number, num2: number, operation: string): Observable<string> {
    return this.http.post(this.apiUrl, { num1, num2, operation }, { responseType: 'text' });
  }
}
