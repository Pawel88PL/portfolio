using backend.DTOs;

namespace backend.Interfaces
{
    public interface IProjectImageService
    {
        Task<ResponseModel> AddImagesToProjectAsync(int projectId, IEnumerable<IFormFile> files);
        Task<ResponseModel> DeleteImageAsync(int imageId);
        Task<List<ProjectImageDto>> GetImagesForProjectAsync(int projectId);
    }
}