using backend.DTOs;

namespace backend.Interfaces
{
    public interface IProjectService
    {
        Task<int> AddAsync(ProjectDto dto);
        Task<IEnumerable<ProjectDto>> GetAllAsync();
        Task<ProjectDto?> GetByIdAsync(int id);
        Task<bool> UpdateAsync(int id, ProjectDto dto);
    }
}