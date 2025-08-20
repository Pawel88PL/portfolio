
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';


import { ToastrService } from 'ngx-toastr';

import { DeleteConfirmationDialogComponent } from '../../../shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProjectModel } from '../../../core/models/project-form-model';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-project-list',
  imports: [
    CommonModule,

    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltip,

    RouterModule

  ],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})

export class ProjectListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['displayOrder', 'title', 'isVisible', 'createdAt', 'updatedAt', 'actions'];
  data: ProjectModel[] = [];
  rowNumber: number = 0;

  errorMessage: string | null = null;
  isLoading: boolean = true;

  constructor(
    private dialog: MatDialog,
    private projectService: ProjectService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.scrollToTop();
  }

  loadData(): void {
    this.projectService.getAll().subscribe({
      next: (response) => {
        this.data = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error.message ?? 'An error occurred while loading projects';
        this.toastr.error(this.errorMessage!, 'Error');
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  deleteProject(formId: number): void {
    this.projectService.delete(formId).subscribe({
      next: () => {
        this.toastr.success('Project has been deleted', 'Success');
        this.loadData();
      },
      error: (error) => {
        this.toastr.error('An error occurred while deleting the project', 'Error');
        console.error(error);
      }
    });
  }

  onDeleteProject(formId: number): void {

    let message = 'Are you sure you want to delete this project?';

    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '400px',
      height: '180px',
      data: { message: message }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProject(formId);
      }
    });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleVisibility(project: ProjectModel): void {
    this.isLoading = true;
    this.projectService.changeVisibility(project.id!, !project.isVisible).subscribe({
      next: () => {
        project.isVisible = !project.isVisible;
        this.toastr.success('Visibility updated successfully', 'Success');
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error(error.error.message || 'An error occurred while updating visibility', 'Error');
        console.error(error);
        this.isLoading = false;
      }
    });
  }
}
