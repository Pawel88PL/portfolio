namespace backend.Models.Entities;

public class Project
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public string GitHubUrl { get; set; } = string.Empty;
    public string DemoUrl { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public int DisplayOrder { get; set; } = 0;
    public bool IsVisible { get; set; } = true;

    public ICollection<ProjectImage> Images { get; set; } = new List<ProjectImage>();
}