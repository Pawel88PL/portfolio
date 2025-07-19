using backend.DTOs;

namespace backend.Interfaces
{
    public interface IProjectService
    {
        Task<int> AddAsync(ProjectDto dto);
        Task<IEnumerable<ProjectDto>> GetAllAsync();
    }
}