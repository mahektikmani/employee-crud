import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee } from './models/employee.model';

export interface PaginatedEmployees {
  data: Employee[];
  totalCount: number; 
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://localhost:7227/api/Employee'; 

  constructor(private http: HttpClient) {}

  getAll(pageIndex: number, pageSize: number, search: string = "", sortField: string = "", sortDirection: 'asc' | 'desc' = 'asc', departments: string[] = [],
    jobTypes: string[] = []): Observable<PaginatedEmployees> {
    let params = new HttpParams()
      .set("page", (pageIndex + 1)) 
      .set("pageSize", pageSize);

    if (search) params = params.set("search", search);
    if (sortField) {
      params = params
        .set("sortField", sortField)
        .set("sortDirection", sortDirection);
    }
    if (departments.length > 0) {
      params = params.set("departments", departments.join(','));
    }

    
    if (jobTypes.length > 0) {
      params = params.set("jobTypes", jobTypes.join(','));
    }
    

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(res => ({
        data: res.data,
        totalCount: res.totalCount 
      }))
    );
  }

  getById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);  
  }

  create(emp: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, emp);
  }

  update(id: number, emp: Employee): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, emp);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
