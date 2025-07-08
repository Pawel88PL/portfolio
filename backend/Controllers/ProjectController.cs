using backend.DTOs;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController(IProjectService projectService) : ControllerBase
    {
        private readonly IProjectService _projectService = projectService;

        [HttpPost]
        public async Task<IActionResult> AddProject([FromBody] ProjectDto projectDto)
        {
            try
            {
                var projectId = await _projectService.AddProjectAsync(projectDto);
                return Ok(projectId);
            }
            catch (Exception ex)
            {
                Log.Error("An error occurred while adding the project: {Message}", ex.Message);
                return BadRequest( new { message = "An error occurred while adding the project." });
            }
        }
    }
}