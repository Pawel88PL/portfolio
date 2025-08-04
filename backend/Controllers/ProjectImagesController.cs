using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/project-images")]
    public class ProjectImagesController(IProjectImageService projectImageService) : ControllerBase
    {
        private readonly IProjectImageService _projectImageService = projectImageService;

        [Authorize(Roles = "Administrator")]
        [HttpDelete("{imageId}")]
        public async Task<IActionResult> DeleteImage([FromRoute] int imageId)
        {
            try
            {
                var result = await _projectImageService.DeleteImageAsync(imageId);
                if (!result.Success)
                {
                    return BadRequest(result.Message);
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{projectId}")]
        public async Task<IActionResult> GetImages([FromRoute] int projectId)
        {
            try
            {
                var images = await _projectImageService.GetImagesForProjectAsync(projectId);
                if (images == null || !images.Any())
                {
                    return NotFound("No images found for this project.");
                }
                return Ok(images);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
            
        }

        [Authorize(Roles = "Administrator")]
        [HttpPost("{projectId}")]
        public async Task<IActionResult> UploadImages([FromRoute] int projectId, [FromForm] List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
            {
                return BadRequest("No files were uploaded.");
            }

            try 
            {
                var result = await _projectImageService.AddImagesToProjectAsync(projectId, files);
                if (!result.Success)
                {
                    return BadRequest(result.Message);
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}