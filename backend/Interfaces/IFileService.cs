using backend.DTOs;

namespace backend.Interfaces
{
    public interface IFileService
    {
        Task<List<string>> SaveFilesAsync(IEnumerable<IFormFile> files, string targetDirectory);

        bool DeleteFileAsync(string relativePath);
        Task<byte[]?> GetFileAsync(string relativePath);

        bool FileExists(string relativePath);
    }
}