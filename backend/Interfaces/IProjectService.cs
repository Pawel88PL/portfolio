using backend.DTOs;

namespace backend.Interfaces
{
    public interface IProjectService
    {
        Task<int> AddProjectAsync(ProjectDto dto);
    }
}