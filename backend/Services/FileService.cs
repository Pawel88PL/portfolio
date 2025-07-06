using backend.Interfaces;

namespace backend.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _env;

        public FileService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> SaveFileAsync(IFormFile file, string targetDirectory)
        {
            var directory = Path.Combine(_env.WebRootPath, targetDirectory);
            Directory.CreateDirectory(directory);

            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(directory, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Path.Combine("/", targetDirectory, fileName).Replace("\\", "/");
        }

        public async Task<List<string>> SaveFilesAsync(IEnumerable<IFormFile> files, string targetDirectory)
        {
            var paths = new List<string>();

            foreach (var file in files)
            {
                var path = await SaveFileAsync(file, targetDirectory);
                paths.Add(path);
            }

            return paths;
        }

        public async Task<byte[]?> GetFileAsync(string relativePath)
        {
            var fullPath = Path.Combine(_env.WebRootPath, relativePath.TrimStart('/'));

            if (!File.Exists(fullPath))
                return null;

            return await File.ReadAllBytesAsync(fullPath);
        }

        public bool DeleteFileAsync(string relativePath)
        {
            var fullPath = Path.Combine(_env.WebRootPath, relativePath.TrimStart('/'));

            if (!File.Exists(fullPath))
                return false;

            File.Delete(fullPath);
            return true;
        }

        public bool FileExists(string relativePath)
        {
            var fullPath = Path.Combine(_env.WebRootPath, relativePath.TrimStart('/'));
            return File.Exists(fullPath);
        }
    }
}