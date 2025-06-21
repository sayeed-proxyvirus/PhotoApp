using Photo.CommonLayer.Models;

namespace Photo.ServiceLayer
{
    public interface IPhotoApplicationSL
    {
        public Task<ReadInformationResponse> Person();
    }
}
