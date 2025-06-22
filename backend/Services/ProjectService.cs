using backend.Data;
using backend.DTOs;
using backend.Interfaces;
using backend.Models.Entities;

namespace backend.Services
{
    public class ProjectService : IProjectService
    {
        private readonly AppDbContext _context;

        public ProjectService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> AddProjectAsync(ProjectDto dto)
        {
            var project = new Project
            {
                Title = dto.Title,
                Description = dto.Description,
                GitHubUrl = dto.GitHubUrl,
                DemoUrl = dto.DemoUrl,
                CreatedAt = DateTime.UtcNow,
                IsVisible = true
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return project.Id;
        }
    }
}