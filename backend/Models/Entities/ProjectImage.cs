namespace backend.Models.Entities;

public class ProjectImage
{
    public int Id { get; set; }
    public string ImagePath { get; set; } = string.Empty;

    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
}