import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-project-form',
  imports: [],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})

export class ProjectFormComponent implements OnInit {

  form!: FormGroup;
  selectedFiles: File[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
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

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;

    const formData = this.form.value;
    const dto = {
      ...formData,
      technologies: formData.technologies.split(',').map((t: string) => t.trim())
    };

    this.projectService.addProject(dto).subscribe({
      next: res => {
        if (this.selectedFiles.length > 0) {
          this.projectService.uploadImages(res.projectId, this.selectedFiles).subscribe(() => {
            this.loading = false;
            // show success, navigate to list
          });
        } else {
          this.loading = false;
        }
      },
      error: () => this.loading = false
    });
  }
}
