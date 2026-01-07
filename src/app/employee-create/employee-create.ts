import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth-service';
import { EmployeeService } from '../employee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './employee-create.html',
  styleUrls: ['./employee-create.css']
})
export class EmployeeCreate implements OnInit {

  id: number | null = null;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: EmployeeService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      employeeId: [0],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNo: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      joiningDate: ['', Validators.required],

      jobType: ['', Validators.required],

      department: ['', Validators.required],

      experience: [5, Validators.required],


      skills: this.fb.group({
        leadership: [false],
        communication: [false],
        technical: [false],
        nontechnical: [false]
      })
    });

    this.id = Number(this.route.snapshot.queryParamMap.get('id'));
    if (this.id) {
      this.service.getById(this.id).subscribe(res => {

        const skillsString = res.skills || '';
        const skillsArray = skillsString.split(',').map(s => s.trim().toLowerCase());

        const skillsObj = {
          leadership: skillsArray.includes('leadership'),
          communication: skillsArray.includes('communication'),
          technical: skillsArray.includes('technical'),
          nontechnical: skillsArray.includes('nontechnical')
        };


        let joiningDateValue: string = '';
        if (res.joiningDate) {
          if (typeof res.joiningDate === 'string') {
            const date = new Date(res.joiningDate);
            joiningDateValue = date.toISOString().split('T')[0];
          }
        }


        let experienceValue: number | string = res.experience || 0;
        if (res.experience && typeof res.experience === 'string') {
          experienceValue = parseInt(res.experience, 10) || 0;
        }

       
        let departmentValue = res.department || '';
        if (typeof departmentValue === 'string') {
          const trimmedDept = departmentValue.trim().toLowerCase();
          if (trimmedDept === 'hr') departmentValue = 'HR';
          else if (trimmedDept === 'sales') departmentValue = 'Sales';
          else if (trimmedDept === 'development') departmentValue = 'Development';
          else if (trimmedDept === 'marketing') departmentValue = 'Marketing';
        }


        this.form.patchValue({
          ...res,
          department: departmentValue,
          skills: skillsObj,
          joiningDate: joiningDateValue,
          experience: experienceValue
        });
      });
    }
  }

  save() {
    if (this.form.invalid) return;

    let formValue = { ...this.form.value };


    
    if (formValue.joiningDate) {
      if (formValue.joiningDate instanceof Date) {
        formValue.joiningDate = formValue.joiningDate.toISOString().split('T')[0];
      } else if (typeof formValue.joiningDate === 'string') {
        
        formValue.joiningDate = formValue.joiningDate;
      }
    }


    if (typeof formValue.experience === 'number') {
      formValue.experience = formValue.experience.toString();
    }


    const s = this.form.value.skills;
    formValue.skills = Object.keys(s)
      .filter(k => s[k] === true)
      .join(', ');


    if (!this.id) {
      delete formValue.employeeId;
    }

    if (this.id) {
      this.service.update(this.id, formValue).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => {
          console.error('Update error:', err);
          if (err.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
          } else if (err.error?.errors) {
            console.error('Validation errors:', err.error.errors);
            alert('Validation errors: ' + JSON.stringify(err.error.errors, null, 2));
          } else {
            alert('Error updating employee: ' + (err.error?.title || err.message));
          }
        }
      });
    } else {
      this.service.create(formValue).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => {
          console.error('Create error:', err);
          console.error('Form data sent:', formValue);
          if (err.status === 401) {
            this.authService.logout();
            this.router.navigate(['/login']);
          } else if (err.error?.errors) {
            console.error('Validation errors:', err.error.errors);
            alert('Validation errors: ' + JSON.stringify(err.error.errors, null, 2));
          } else {
            alert('Error creating employee: ' + (err.error?.title || err.message));
          }
        }
      });
    }
  }


  cancel() {
    this.router.navigate(['/dashboard']);
  }
}
