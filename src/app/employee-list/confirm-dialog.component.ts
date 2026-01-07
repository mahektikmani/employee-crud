import { Component , Inject} from "@angular/core";
import { MAT_DIALOG_DATA ,MatDialogRef } from "@angular/material/dialog";   
import { MatButtonModule} from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  template: `
  //   <h2 mat-dialog-title>{{ data.title }}</h2>
  //   <mat-dialog-content>
  //     <p>{{ data.message }}</p>
  //   </mat-dialog-content>

  //   <mat-dialog-actions align="end">
  //     <button mat-button (click)="cancel()">Cancel</button>
  //     <button mat-raised-button color="warn" (click)="confirm()">Delete</button>
  //   </mat-dialog-actions>
  // `
})
export class ConfirmDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cancel() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }
}