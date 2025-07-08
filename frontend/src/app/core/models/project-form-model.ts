export interface ProjectFormModel {
    title: string;
    description: string;
    link?: string;
    technologies: string[];
    isVisible: boolean;
    images?: File[];
}