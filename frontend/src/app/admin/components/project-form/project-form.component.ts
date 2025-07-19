import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ProjectService } from '../../../core/services/project.service';
import { ToastrService } from 'ngx-toastr';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FileUploadModule } from 'primeng/fileupload';

import { TinyMceConfigService } from '../../../core/services/tiny-mce-config.service';

import { EditorComponent } from '@tinymce/tinymce-angular';
import { DeleteConfirmationDialogComponent } from '../../../shared/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { ProjectModel } from '../../../core/models/project-form-model';

@Component({
  selector: 'app-project-form',
  imports: [
    CommonModule,
    FormsModule,

    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    
    EditorComponent,

    FileUploadModule,

    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})

export class ProjectFormComponent implements OnInit {

  form!: FormGroup;
  selectedFiles: File[] = [];

  isCreating: boolean = false;
  isLoading: boolean = false;

  headerTitle: string = 'Add New Project';
  redirectUrl: string = '';

  projectId: number | null = null;
  project: ProjectModel | null = null;

  isEditorLoading: boolean = false;
  editorInit!: Record<string, any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private configService: TinyMceConfigService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private projectService: ProjectService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeForm();

    this.editorInit = this.configService.getEditorInit(() => {
      this.isEditorLoading = false;
    });
  }

  showToastr(message: string, title: string): void {
    this.toastr.success(message, title);
  }

  captureURLparameters(): void {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
      if (this.projectId) {
        this.headerTitle = 'Edit Project';
        this.getProjectById(this.projectId);
      } else {
        this.isLoading = false;
      }
    });
  }

  confirmSaveAndRedirect(projectId: number): void {
    const message = 'You have unsaved changes. Do you want to save them before leaving?';
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '450px',
      height: '200px',
      data: { message: message }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.redirectUrl = `landing/${projectId}`;
        this.onSubmit();
      } else {
        return;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin', 'projects']);
  }

  getProjectById(programId: number): void {
    this.projectService.getById(programId).subscribe({
      next: (response) => {
        this.project = response;
        this.patchFormValues(response);
        this.isLoading = false;
      },
      error: (error) => {
        //this.toastr.error(error.error.message, 'Error');
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  initializeForm(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      displayOrder: [0, Validators.required],
      description: ['', Validators.required],
      link: [''],
      technologies: [''],
      isVisible: [true],
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  onPreview(projectId: number): void {

    if (this.form.dirty) {
      this.confirmSaveAndRedirect(projectId);
    } else {
      this.redirectUrl = `landing/${projectId}`;
      this.router.navigate([this.redirectUrl]);
    }
  }

  onPrimeFilesSelected(event: any): void {
    this.selectedFiles = event.files;
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isCreating = true;

    const formData = this.form.value;
    const dto = {
      ...formData,
      technologies: formData.technologies.split(',').map((t: string) => t.trim())
    };

    this.projectService.addProject(dto).subscribe({
      next: res => {
        if (this.selectedFiles.length > 0) {
          this.uploadProjectImages(res.projectId);
        } else {
          //this.toastr.success('Project created successfully', 'Success');
          this.router.navigate(['/admin', 'projects']);
          this.isCreating = false;
        }
      },
      error: () => {
        //this.toastr.error('Failed to create project', 'Error');
        this.isCreating = false;
      }
    });
  }

  patchFormValues(data: ProjectModel): void {
    this.form.patchValue({
      title: data.title,
      description: data.description,
      link: data.link || '',
      technologies: data.technologies.join(', '),
      isVisible: data.isVisible
    });
  }

  private uploadProjectImages(projectId: number): void {
    this.projectService.uploadImages(projectId, this.selectedFiles).subscribe({
      next: () => {
        //this.toastr.success('Images uploaded successfully', 'Success');
        this.router.navigate(['/admin', 'projects']);
        this.isCreating = false;
      },
      error: () => {
        this.toastr.error('Failed to upload images', 'Error');
        this.isCreating = false;
      }
    });
  }
}