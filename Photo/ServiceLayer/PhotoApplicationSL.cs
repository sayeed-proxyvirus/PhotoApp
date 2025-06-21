using Photo.CommonLayer.Models;
using Photo.RepositoryLayer;

namespace Photo.ServiceLayer
{
    public class PhotoApplicationSL : IPhotoApplicationSL 
    {
        public readonly IPhotoApplicationRL _photoApplicationRL;
        public PhotoApplicationSL(IPhotoApplicationRL PhotoApplicationRL)
        {
            _photoApplicationRL = PhotoApplicationRL;
        }
        public async Task<ReadInformationResponse> Person()
        {
            return await _photoApplicationRL.Person();
        }
    }
}
