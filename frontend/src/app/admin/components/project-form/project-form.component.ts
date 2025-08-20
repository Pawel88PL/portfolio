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
import { ProjectImageModel } from '../../../core/models/project-image-model';
import { environment } from '../../../../environments/environment';

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

  baseUrl = environment.baseUrl;
  
  form!: FormGroup;
  selectedFiles: File[] = [];

  isCreating: boolean = false;
  isLoading: boolean = true;

  headerTitle: string = 'Add New Project';
  redirectUrl: string = '';

  projectId: number | null = null;
  project: ProjectModel | null = null;

  projectImages: ProjectImageModel[] = [];

  apiKey: string = '';
  isEditorLoading: boolean = false;
  editorInit!: Record<string, any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private configService: TinyMceConfigService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private imageService: ImageService,
    private projectService: ProjectService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.captureURLparameters();
    this.apiKey = this.configService.getApiKey();

    this.editorInit = this.configService.getEditorInit(() => {
      this.isEditorLoading = false;
    });
  }

  private deleteImage(imageId: number): void {
    this.imageService.deleteImage(imageId).subscribe({
      next: () => {
        this.toastr.success('Image has been deleted', 'Success');
        this.getProjectImages(this.projectId!);
      },
      error: (error) => {
        this.toastr.error('An error occurred while deleting the image', 'Error');
        console.error(error);
      }
    });
  }

  onDeleteImage(imageId: number): void {

    let message = 'Are you sure you want to delete this image?';

    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '400px',
      height: '180px',
      data: { message: message }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteImage(imageId);
      }
    });
  }

  private captureURLparameters(): void {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
      if (this.projectId) {
        this.getProjectById(this.projectId);
        this.getProjectImages(this.projectId);
      } else {
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['admin', 'project', 'list']);
  }

  private getProjectById(projectId: number): void {
    this.projectService.getById(projectId).subscribe({
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

  private getProjectImages(projectId: number): void {
    this.imageService.getImages(projectId).subscribe({
      next: (response) => {
        this.projectImages = response;
      },
      error: (error) => {
        this.toastr.error(error.error.message, 'Error');
        console.error(error);
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
    const payload = this.buildPayload();

    const isEdit = !!this.projectId;
    const request$ = isEdit
      ? this.projectService.update(this.projectId!, payload)
      : this.projectService.addProject(payload);

    request$.subscribe({
      next: (response) => {
        const newOrExistingId = response ?? this.projectId!;
        const message = isEdit ? 'Project updated successfully' : 'Project created successfully';
        this.toastr.success(message, 'Success');

        if (this.selectedFiles.length > 0) {
          this.uploadProjectImages(newOrExistingId);
        } else {
          this.navigateToProjectList();
        }
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
      displayOrder: data.displayOrder || 0,
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