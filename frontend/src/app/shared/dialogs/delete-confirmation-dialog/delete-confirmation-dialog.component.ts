import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation-dialog',
  imports: [
    MatDialogModule
  ],
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrl: './delete-confirmation-dialog.component.scss'
})

export class DeleteConfirmationDialogComponent implements OnInit {

  message: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.message = this.data.message;
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
