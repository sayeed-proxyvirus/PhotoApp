using Photo.CommonLayer.Models;

namespace Photo.RepositoryLayer
{
    public interface IPhotoApplicationRL
    {
        public Task<ReadInformationResponse> Person();
    }
}
