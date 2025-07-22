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
import { ImageService } from '../../../core/services/image.service';
import { Observable } from 'rxjs';

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
    private imageService: ImageService,
    private projectService: ProjectService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.captureURLparameters();

    this.editorInit = this.configService.getEditorInit(() => {
      this.isEditorLoading = false;
    });
  }

  private captureURLparameters(): void {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
      if (this.projectId) {
        this.getProjectById(this.projectId);
      } else {
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['admin', 'project', 'list']);
  }

  private getProjectById(programId: number): void {
    this.projectService.getById(programId).subscribe({
      next: (response) => {
        this.project = response;
        this.patchFormValues(response);
        this.headerTitle = response.title;
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error(error.error.message, 'Error');
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      displayOrder: [0, Validators.required],
      description: [''],
      link: [''],
      technologies: [''],
      isVisible: [true],
    });
  }

  onPrimeFilesSelected(event: any): void {
    const files = event.files ?? event.currentFiles ?? event.originalEvent?.target?.files;

    // PrimeNG może zwrócić FileList, więc zamieniamy go na tablicę
    this.selectedFiles = Array.from(files);
    console.log('Selected files:', this.selectedFiles);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.toastr.warning('Please fill in all required fields', 'Error');
      return;
    };

    this.isCreating = true;

    const formData = this.form.value;
    const payload = {
      ...formData,
      projectId: this.projectId,
      technologies: formData.technologies.split(',').map((t: string) => t.trim())
    };

    let request: Observable<number | void>;

    if (this.projectId) {
      request = this.projectService.update(this.projectId, payload);
    } else {
      request = this.projectService.addProject(payload);
    }

    request.subscribe({
      next: (response) => {
        const message = this.projectId ? 'Project updated successfully' : 'Project created successfully';
        this.toastr.success(message, 'Success');
        if (this.selectedFiles.length > 0) {
          if (response) {
            this.uploadProjectImages(response);
          } else {
            this.uploadProjectImages(this.projectId!);
          }
        } else {
          this.router.navigate(['admin', 'project', 'list']);
          this.isCreating = false;
        }
        this.isCreating = false;
      },
      error: (error) => {
        this.toastr.error(error.error?.message || 'An error occurred', 'Error');
        console.error('Error creating/updating project:', error);
        this.isCreating = false;
      }
    });
  }

  private buildPayload(): any {
    const formData = this.form.value;
    return {
      ...formData,
      projectId: this.projectId,
      technologies: formData.technologies
        .split(',')
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0)
    };
  }

  private navigateToProjectList(): void {
    this.router.navigate(['admin', 'project', 'list']);
    this.isCreating = false;
  }

  private patchFormValues(data: ProjectModel): void {
    this.form.patchValue({
      title: data.title,
      description: data.description,
      link: data.link || '',
      technologies: data.technologies ? data.technologies.join(', ') : '',
      isVisible: data.isVisible
    });
  }

  private uploadProjectImages(projectId: number): void {
    this.imageService.uploadImages(projectId, this.selectedFiles).subscribe({
      next: (response) => {
        this.toastr.success(response.message, 'Success');
        this.router.navigate(['admin', 'project', 'list']);
        this.isCreating = false;
      },
      error: () => {
        this.toastr.error('Failed to upload images', 'Error');
        this.isCreating = false;
      }
    });
  }
}