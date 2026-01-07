import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  template: '' ,
  imports: [RouterLink]
})
export class EmployeeEdit implements OnInit {  
  id!: number; 
  constructor( 
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.router.navigate(['/create'], {
      queryParams: { id: this.id }
    });
  }
}
