namespace backend.Models
{
    public class EmailSettings
    {
        public string SmtpServer { get; set; } = string.Empty;
        public int SmtpPort { get; set; } = 587;
        public string SmtpUsername { get; set; } = string.Empty;
        public string SmtpPassword { get; set; } = string.Empty;
        public string EmailSender { get; set; } = string.Empty;
        public string CertificatePath { get; set; } = string.Empty;
        public string CertificatePassword { get; set; } = string.Empty;
    }
}