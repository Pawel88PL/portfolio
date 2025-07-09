export interface ProjectModel {
    id?: number;
    title: string;
    description: string;
    link?: string;
    technologies: string[];
    isVisible: boolean;
    images?: File[];
    displayOrder?: number;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
}