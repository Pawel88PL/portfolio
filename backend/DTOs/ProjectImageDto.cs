using backend.Models.Entities;

namespace backend.DTOs;

public class ProjectImageDto
{
    public int Id { get; set; }
    public string ImagePath { get; set; } = string.Empty;

    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    public DateTime UploadedAt { get; set; }
}