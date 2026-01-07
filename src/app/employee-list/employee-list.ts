import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../auth-service';
import { EmployeeService, PaginatedEmployees } from '../employee.service';
import { Employee } from '../models/employee.model';
import { NgFor, NgIf } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { EmployeeDetailsModalComponent } from './employee-details-modal.component';
import { MatSelectModule } from '@angular/material/select';
import { elements } from 'chart.js';

type ChartFieldOption = 'department' | 'experience';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.css'],
  imports: [
    RouterLink, NgFor, NgIf, MatTableModule, MatButtonModule, MatIconModule,
    MatCardModule, CommonModule, FormsModule, MatFormFieldModule, MatInputModule,
    MatPaginatorModule, MatSortModule, MatSelectModule, MatPaginatorModule, MatTableModule
  ]
})
export class EmployeeList implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'employeeId', 'firstname', 'lastname', 'email', 'contactNo', 'city',
    'department', 'jobType', 'experience', 'actions'
  ];
  Math = Math;

  dataSource = new MatTableDataSource<Employee>();
  pageIndex = 0;
  pageSize = 10;
  totalItems = 0;
  searchText = '';
  sortField = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  
  @ViewChild('chartRef') chartRef!: ElementRef;
  chart: any;

  departments: string[] = ['HR', 'Sales', 'Development', 'Marketing'];
  jobTypes: string[] = ['FullTime', 'PartTime', 'Remote'];

  showChart = false;
  chartField: ChartFieldOption = 'department';
  chartFieldOptions: { value: ChartFieldOption; label: string }[] = [
    { value: 'department', label: 'Department' },
    { value: 'experience', label: 'Experience (years)' }
  ]

  selectedDepartments: string[] = [];
  selectedJobTypes: string[] = [];

  allEmployees: Employee[] = [];

  constructor(
    private service: EmployeeService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    console.log('EmployeeList component initialized');
    this.loadEmployees();
  }

ngAfterViewInit(): void {
  this.dataSource.sort = this.sort;


  setTimeout(() => {
    this.initKTMenu();
  }, 0);

  setTimeout(() => {
    this.initChart();
  }, 300);
}


  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy(); 
    }
  }

  loadEmployees(): void {
    console.log(' Loading employees...');
    console.log(' Active Filters - Dept:', this.selectedDepartments, 'Job:', this.selectedJobTypes);
    this.service.getAll(
      this.pageIndex,
      this.pageSize,
      this.searchText,
      this.sortField,
      this.sortDirection,
      this.selectedDepartments,
      this.selectedJobTypes
    ).subscribe({
      next: (res: PaginatedEmployees) => {
        console.log(' Employees loaded:', res);

        if (res.totalCount === 0) {
          console.log(' No employees, using mock data...');
          this.dataSource.data = [];
          this.totalItems = 0;
        } else {
          this.dataSource.data = res.data;
          this.totalItems = res.totalCount;
        }

        this.prepareChartData();

        this.dataSource._updateChangeSubscription();
setTimeout(() => {
    this.initKTMenu();
  }, 0);
 
        // setTimeout(() => {
        //   if ((window as any).KTMenu) {
        //     (window as any).KTMenu.init();
        //     (window as any).KTMenu.createInstances('[data-kt-menu="true"]');
        //   }
        // }, 100);
      },
      error: (err) => {
        console.error(' Error loading employees:', err);
        if (err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']); 

        }
        this.dataSource.data = [];
        this.totalItems = 0;
      }
    });
  }
toggleChart(): void {
  this.showChart = !this.showChart;


  setTimeout(() => {
    this.initKTMenu();
  }, 0);

  if (this.showChart) {
    setTimeout(() => {
      this.initChart();
      this.prepareChartData();
    }, 100);
  } else if (this.chart) {
    this.chart.destroy();
    this.chart = null;
  }
}


  initChart() {
    if (!this.chartRef || !(window as any).ApexCharts) {
      console.warn(' Chart element or ApexCharts global not found');
      return;
    }

    const element = this.chartRef.nativeElement;
    const height = 350;
    const borderColor = '#E4E6EF'; 

    const options = {
      series: [],
      chart: {
        fontFamily: 'inherit',
        type: 'bar',
        height: height,
        toolbar: {
          show: false
        },
        events: {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
 
          }
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 4
        }
      },
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: [],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false
        },
        labels: {
          style: {
            colors: '#A1A5B7',
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#A1A5B7',
            fontSize: '12px'
          }
        }
      },
      fill: {
        opacity: 1
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0
          }
        },
        hover: {
          filter: {
            type: 'none',
            value: 0
          }
        },
        active: {
          allowMultipleDataPointsSelection: false,  
          filter: {
            type: 'none',
            value: 0
          }
        }
      },
      tooltip: {
        style: {
          fontSize: '12px'
        },
        y: {
          formatter: function (val: number) {
            return val + ' Employees'; 
          }
        }
      },
      colors: ['#3E97FF'], 
      grid: {
        borderColor: borderColor,
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true
          
          }
        }
      }
    };
 this.chart = new(window as any). ApexCharts(element, options);
    this.chart.render();

    // window.dispatchEvent(new Event('resize'))
    
  }

  prepareChartData(): void {

    if (!this.chart) return;

    this.service.getAll(
      0,
      1000,
      this.searchText,
      this.sortField,
      this.sortDirection,
      this.selectedDepartments,
      this.selectedJobTypes
    ).subscribe((res: PaginatedEmployees) => {
      const employees = res.data;
      console.log(' PrepareChartData:', employees.length);

      this.allEmployees = employees;
      const field = this.chartField;

      const bucketCounts: { [key: string]: number } = {};

      employees.forEach(emp => {
        const value = (emp[field] as string | undefined) || 'Unknown';
        bucketCounts[value] = (bucketCounts[value] || 0) + 1;
      });

      const labels = Object.keys(bucketCounts);
      const data = labels.map(label => bucketCounts[label]);

      console.log(' Chart Data:', data, labels);

    
      this.chart.updateOptions({
        xaxis: {
          categories: labels,
          title: { text: field === 'department' ? 'Department' : 'Experience (years)' }
        },
        chart: {
          events: {
            dataPointSelection: (event: any, chartContext: any, config: any) => {
              const selectedIndex = config.dataPointIndex;
              const selectedLabel = config.w.globals.labels[selectedIndex];
              if (selectedLabel) {
                this.openEmployeeDetailsModal(selectedLabel, field);

              }
            }
          }
        }
      });

      this.chart.updateSeries([{
        name: 'Employees',
        data: data
      }]);
    });
  }

  onChartFieldChange(): void {
    console.log(' Chart Field Changed to:', this.chartField);
    this.prepareChartData();
  }

  openEmployeeDetailsModal(filterValue: string, filterField: 'department' | 'experience'): void {
    const filteredEmployees = this.allEmployees.filter(emp => {
      const value = (emp[filterField] as string | undefined) || 'Unknown';
      return value === filterValue || String(value) === String(filterValue);
    });

    const dialogRef = this.dialog.open(EmployeeDetailsModalComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: {
        employees: filteredEmployees,
        filterLabel: filterField === 'department' ? 'Department' : 'Experience',
        filterValue: filterValue,
        filterField: filterField
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.updated) {
        this.loadEmployees();
        this.prepareChartData(); 
      }
    });
  }



  isDepartmentSelected(dept: string): boolean {
    return this.selectedDepartments.includes(dept); 
  }

  toggleDepartment(dept: string, event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      if (!this.selectedDepartments.includes(dept)) {
        this.selectedDepartments.push(dept);
      }
    } else {
      this.selectedDepartments = this.selectedDepartments.filter(d => d !== dept);
    }
  }

  isJobTypeSelected(job: string): boolean {
    return this.selectedJobTypes.includes(job);
  }

  toggleJobType(job: string, event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      if (!this.selectedJobTypes.includes(job)) {
        this.selectedJobTypes.push(job);
      }
    } else {
      this.selectedJobTypes = this.selectedJobTypes.filter(j => j !== job);
    }
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.loadEmployees();
  }

  resetFilters(): void {
    this.searchText = '';
    this.selectedDepartments = [];
    this.selectedJobTypes = [];
    this.applyFilters();
  }

 

  onPageChanged(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadEmployees();
  }



  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.pageIndex = page;
      this.loadEmployees();
    }
  }

  nextPage(): void {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
      this.loadEmployees();
    }
  }

  prevPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.loadEmployees();
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.pageIndex = 0;
    this.loadEmployees();
  }

  onSearch(event: any): void {
    this.searchText = (event.target as HTMLInputElement).value;
    this.applyFilter();
  }
  applyFilter(): void {
    this.pageIndex = 0;
    this.loadEmployees();
  }
  sortData(sort: Sort): void {
    this.sortField = sort.active;
    this.sortDirection = sort.direction === '' ? 'asc' : sort.direction as 'asc' | 'desc';
    this.pageIndex = 0;
    this.loadEmployees(); 
  }

  delete(employee: Employee): void {
    Swal.fire({
      text: `Are you sure you want to delete ${employee.firstname} ${employee.lastname}?`,
      icon: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "No, cancel",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-active-light-primary"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(employee.employeeId!).subscribe({
          next: () => {
            Swal.fire({
              text: "You have deleted " + employee.firstname + "!.",
              icon: "success",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              customClass: {
                confirmButton: "btn btn-primary" 
              }
            });
            this.loadEmployees();
          },
          error: (err) => {
            Swal.fire({
              text: "Customer was not deleted.",
              icon: "error",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!", 
              customClass: {
                confirmButton: "btn btn-primary"
              }
            });
          }
        });
      }
    });
  }

private initKTMenu(): void {
  const KTMenu = (window as any).KTMenu;
  if (!KTMenu) return;

  
  KTMenu.createInstances('[data-kt-menu="true"]');
}


}
