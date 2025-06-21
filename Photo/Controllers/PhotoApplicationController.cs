using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Photo.CommonLayer.Models;
using Photo.RepositoryLayer;
using Photo.ServiceLayer;

namespace Photo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhotoApplicationController : ControllerBase
    {
        public readonly IPhotoApplicationSL _photoApplicationSL;
        public PhotoApplicationController(IPhotoApplicationSL photoApplicationSL)
        {
            _photoApplicationSL = photoApplicationSL;

        }

        [HttpGet("Person")]
public async Task<IActionResult> Persons()
{
    try
    {
        var result = await _photoApplicationSL.Person(); // Your service method
        
        if (result.IsSuccess)
        {
            return Ok(result);
        }
        else
        {
            return BadRequest(result);
        }
    }
    catch (Exception ex)
    {
        // Log the exception
        Console.WriteLine($"Controller error: {ex}");
        
        return StatusCode(500, new { 
            IsSuccess = false, 
            Message = "Internal server error occurred",
            person = new List<object>()
        });
    }
}
    }
}
