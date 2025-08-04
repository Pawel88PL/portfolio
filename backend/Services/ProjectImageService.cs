using backend.Data;
using backend.DTOs;
using backend.Interfaces;
using backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ProjectImageService : IProjectImageService
    {
        private readonly AppDbContext _context;
        private readonly IFileService _fileService;

        public ProjectImageService(AppDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        public async Task<ResponseModel> AddImagesToProjectAsync(int projectId, IEnumerable<IFormFile> files)
        {
            var projectExists = await _context.Projects.AnyAsync(p => p.Id == projectId);
            if (!projectExists)
            {
                return new ResponseModel { Success = false, Message = "Project not found." };
            }

            var savedPaths = await _fileService.SaveFilesAsync(files, $"uploads/projects/{projectId}");

            var projectImages = savedPaths.Select(path => new ProjectImage
            {
                ProjectId = projectId,
                ImagePath = path,
                UploadedAt = DateTime.UtcNow
            });

            await _context.ProjectImages.AddRangeAsync(projectImages);
            await _context.SaveChangesAsync();

            return new ResponseModel { Success = true, Message = "Images uploaded successfully." };
        }

        public async Task<ResponseModel> DeleteImageAsync(int imageId)
        {
            var image = await _context.ProjectImages.FindAsync(imageId);
            if (image == null)
            {
                return new ResponseModel { Success = false, Message = "Image not found." };
            }

            var deleted = _fileService.DeleteFileAsync(image.ImagePath);
            if (!deleted)
            {
                return new ResponseModel { Success = false, Message = "File could not be deleted." };
            }

            _context.ProjectImages.Remove(image);
            await _context.SaveChangesAsync();

            return new ResponseModel { Success = true, Message = "Image deleted." };
        }

        public async Task<List<ProjectImageDto>> GetImagesForProjectAsync(int projectId)
        {
            return await _context.ProjectImages
                .Where(i => i.ProjectId == projectId)
                .Select(i => new ProjectImageDto
                {
                    Id = i.Id,
                    ImagePath = i.ImagePath,
                })
                .ToListAsync();
        }
    }
}