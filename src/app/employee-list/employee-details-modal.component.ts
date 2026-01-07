import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { Employee } from "../models/employee.model";
import { EmployeeService } from "../employee.service";
import { forkJoin } from "rxjs";

export interface EmployeeDetailsModalData {
  employees: Employee[];
  filterLabel: string;
  filterValue: string;
  filterField: 'department' | 'experience';
}

@Component({
  selector: 'app-employee-details-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    MatSelectModule
  ],

  template: `
<h2 mat-dialog-title class="fw-bold">
  <mat-icon class="me-2">people</mat-icon>
  Employee Details
</h2>

<mat-dialog-content>

  <!-- Filter info -->
  <div class="mb-5">
    <span class="fw-bold">{{ getFilterLabel() }}:</span>
    <span class="text-muted ms-2">{{ data.filterValue }}</span>
  </div>

  <!--begin::Table-->
  <div class="table-responsive">
    <table class="table align-middle table-row-dashed fs-6 gy-5">
      <thead>
        <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
          <th class="min-w-80px">ID</th>
          <th class="min-w-150px">Employee</th>
          <th class="min-w-200px">Email</th>
          <th class="min-w-120px">City</th>
          <th class="min-w-150px">Department</th>
          <th class="min-w-120px">Job Type</th>
          <th class="min-w-120px">Experience</th>
        </tr>
      </thead>

      <tbody class="fw-semibold text-gray-600">

        <tr *ngFor="let emp of dataSource">
          <td>{{ emp.employeeId }}</td>

          <td>
            <div class="d-flex flex-column">
              <span class="fw-bold text-gray-800">
                {{ emp.firstname }} {{ emp.lastname }}
              </span>
            </div>
          </td>

          <td>
            <a href="mailto:{{ emp.email }}" class="text-gray-600 text-hover-primary mb-1">
              {{ emp.email }}
            </a>
          </td>

          <td>{{ emp.city }}</td>

          <!-- Department (editable only when filtering by department) -->
          <td>
            <ng-container *ngIf="data.filterField === 'department'; else deptText">
              <select
                class="form-select form-select-sm"
                [(ngModel)]="emp.department">
                <option *ngFor="let dept of departments" [value]="dept">
                  {{ dept }}
                </option>
              </select>
            </ng-container>

            <ng-template #deptText>
              <span class="badge badge-light-primary fw-bold">
                {{ emp.department }}
              </span>
            </ng-template>
          </td>

          <td>
            <span class="badge badge-light-info fw-bold">
              {{ emp.jobType }}
            </span>
          </td>

          <td>{{ emp.experience }} Yrs</td>
        </tr>

        <!-- Empty state -->
        <tr *ngIf="dataSource.length === 0">
          <td colspan="7" class="text-center py-10">
            <div class="fs-4 fw-bold text-gray-600">
              No employees found.
            </div>
          </td>
        </tr>

      </tbody>
    </table>
  </div>
  <!--end::Table-->

</mat-dialog-content>

 <div class="d-flex justify-content-end">
              <button type="button" class="btn btn-sm btn-light btn-active-light-primary me-2"
                data-kt-menu-dismiss="true" (click)="close()">Close</button>
              <button type="button" class="btn btn-sm btn-primary" data-kt-menu-dismiss="true"
                (click)="save()">Save</button>
            </div>
`

  // styles: [`
  //   .filter-info {
  //     margin-bottom: 20px;
  //     padding: 12px;
  //     background-color: #f5f5f5;
  //     border-radius: 4px;
  //   }
  //   .filter-info p {
  //     margin: 8px 0;
  //     font-size: 14px;
  //   }
  //   .dept-inline-field {
  //     min-width: 150px;
  //   }
  //   .table-container {
  //     max-height: 400px;
  //     overflow-y: auto; 
  //   .employee-table {
  //     width: 100%;
  //   }
  //   .employee-table th {
  //     background-color: #f5f5f5;
  //     font-weight: 600;
  //     padding: 12px;
  //   }
  //   .employee-table td {
  //     padding: 10px 12px;
  //   }
  //   mat-dialog-content {
  //     min-width: 800px;
  //     max-width: 1000px;
  //   }
  // `]
})
export class EmployeeDetailsModalComponent {
  displayedColumns: string[] = ['employeeId', 'name', 'email', 'contactNo', 'city', 'department', 'jobType', 'experience'];
  dataSource: Employee[];
  departments: string[] = ['HR', 'Sales', 'Development', 'Marketing'];

  constructor(
    private dialogRef: MatDialogRef<EmployeeDetailsModalComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: EmployeeDetailsModalData,
    private employeeService: EmployeeService
  ) {
    this.dataSource = this.data.employees;
  }

  getFilterLabel(): string {
    return this.data.filterField === 'department' ? 'Department' : 'Experience'; 
  }

  close() {
    this.dialogRef.close();
  }

  
  save() {
    if (!this.dataSource || this.dataSource.length === 0) {
      this.dialogRef.close();
      return;
    }

    const updateRequests = this.dataSource
      .filter(emp => !!emp.employeeId)
      .map(emp => this.employeeService.update(emp.employeeId, emp));

    if (updateRequests.length === 0) {
      this.dialogRef.close();
      return;
    }


    forkJoin(updateRequests).subscribe({
      next: () => this.dialogRef.close({ updated: true }),
      error: (err) => {
        console.error('Error updating employees:', err);
        alert('Error updating employees. Please try again.');
      }
    });
  }
}

