using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/project-images")]
    public class ProjectImagesController(IProjectImageService projectImageService) : ControllerBase
    {
        private readonly IProjectImageService _projectImageService = projectImageService;

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