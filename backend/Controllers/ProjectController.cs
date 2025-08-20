using backend.DTOs;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/project")]
    public class ProjectController(IProjectService projectService) : ControllerBase
    {
        private readonly IProjectService _projectService = projectService;

        [Authorize(Roles = "Administrator")]
        [HttpPost]
        public async Task<IActionResult> AddProject([FromBody] ProjectDto projectDto)
        {
            try
            {
                var projectId = await _projectService.AddAsync(projectDto);
                return Ok(projectId);
            }
            catch (Exception ex)
            {
                Log.Error("An error occurred while adding the project: {Message}", ex.Message);
                return BadRequest(new { message = "An error occurred while adding the project." });
            }
        }

        [Authorize(Roles = "Administrator")]
        [HttpPut("{id}/visibility")]
        public async Task<IActionResult> ChangeVisibility(int id, [FromBody] bool isVisible)
        {
            try
            {
                var result = await _projectService.ChangeVisibilityAsync(id, isVisible);
                if (!result)
                {
                    return NotFound(new { message = "Project not found." });
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                Log.Error("An error occurred while changing project visibility: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while changing project visibility." });
            }
        }

        [Authorize(Roles = "Administrator")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            try
            {
                var result = await _projectService.DeleteAsync(id);
                if (!result)
                {
                    return NotFound(new { message = "Project not found." });
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                Log.Error("An error occurred while deleting the project: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while deleting the project." });
            }
        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _projectService.GetAllAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var result = await _projectService.GetByIdAsync(id);
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Administrator")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProjectDto projectDto)
        {
            try
            {
                var result = await _projectService.UpdateAsync(id, projectDto);
                if (!result)
                {
                    return NotFound();
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}