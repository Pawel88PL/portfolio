using backend.Data;
using backend.DTOs;
using backend.Interfaces;
using backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ProjectService : IProjectService
    {
        private readonly AppDbContext _context;
        private readonly IProjectImageService _projectImageService;

        public ProjectService(AppDbContext context, IProjectImageService projectImageService)
        {
            _context = context;
            _projectImageService = projectImageService;
        }

        public async Task<int> AddAsync(ProjectDto dto)
        {
            var project = new Project
            {
                Title = dto.Title,
                Description = dto.Description,
                GitHubUrl = dto.GitHubUrl,
                DemoUrl = dto.DemoUrl,
                CreatedAt = DateTime.Now,
                IsVisible = true,
                DisplayOrder = dto.DisplayOrder,
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return project.Id;
        }

        public async Task<bool> ChangeVisibilityAsync(int id, bool isVisible)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return false;
            }

            project.IsVisible = isVisible;
            _context.Projects.Update(project);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return false;
            }

            var images = await _context.ProjectImages
                .Where(pi => pi.ProjectId == id)
                .ToListAsync();

            foreach (var image in images)
            {
                var deleted = await _projectImageService.DeleteImageAsync(image.Id);
                if (!deleted.Success)
                {
                    return false;
                }
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ProjectDto>> GetAllAsync()
        {
            var projects = await _context.Projects
                .AsNoTracking()
                .OrderBy(p => p.DisplayOrder)
                .Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    IsVisible = p.IsVisible,
                    DisplayOrder = p.DisplayOrder
                })
                .ToListAsync();

            return projects;
        }

        public async Task<ProjectDto?> GetByIdAsync(int id)
        {
            var project = await _context.Projects
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null)
            {
                return null;
            }

            return new ProjectDto
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                GitHubUrl = project.GitHubUrl,
                DemoUrl = project.DemoUrl,
                CreatedAt = project.CreatedAt,
                UpdatedAt = project.UpdatedAt,
                IsVisible = project.IsVisible,
                DisplayOrder = project.DisplayOrder
            };
        }

        public async Task<bool> UpdateAsync(int id, ProjectDto dto)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return false;
            }

            project.Title = dto.Title;
            project.Description = dto.Description;
            project.GitHubUrl = dto.GitHubUrl;
            project.DemoUrl = dto.DemoUrl;
            project.DisplayOrder = dto.DisplayOrder;
            project.UpdatedAt = DateTime.Now;

            _context.Projects.Update(project);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}