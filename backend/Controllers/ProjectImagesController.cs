using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/project-images")]
    public class ProjectImagesController(IProjectImageService projectImageService) : ControllerBase
    {
        private readonly IProjectImageService _projectImageService = projectImageService;

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

        [HttpPost("{projectId}")]
        public async Task<IActionResult> UploadImages([FromRoute] int projectId, [FromForm] List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
            {
                return BadRequest("No files were uploaded.");
            }

            var result = await _projectImageService.AddImagesToProjectAsync(projectId, files);

            if (!result.Success)
            {
                return BadRequest(result.Message);
            }

            return Ok(result);
        }
    }
}