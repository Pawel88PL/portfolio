export interface ChangePasswordRequest {
    userId: string;
    newPassword: string;
}

export interface ResetPasswordModel {
    email: string;
    token: string;
    newPassword: string;
}