import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectImageUploadComponent } from './project-image-upload.component';

describe('ProjectImageUploadComponent', () => {
  let component: ProjectImageUploadComponent;
  let fixture: ComponentFixture<ProjectImageUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectImageUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
