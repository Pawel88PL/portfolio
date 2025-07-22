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

        public ProjectService(AppDbContext context)
        {
            _context = context;
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

        public async Task<IEnumerable<ProjectDto>> GetAllAsync()
        {
            var projects = await _context.Projects
                .AsNoTracking()
                .OrderBy(p => p.CreatedAt)
                .ThenBy(p => p.CreatedAt)
                .Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    GitHubUrl = p.GitHubUrl,
                    DemoUrl = p.DemoUrl,
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