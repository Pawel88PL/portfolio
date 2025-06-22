namespace backend.DTOs
{
    public class ResponseModel
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? AdditionalMessage { get; set; }
    }
}