using System;
using System.Collections.Generic;

namespace Photo.CommonLayer.Models
{
    public class ReadInformationResponse
    {
        public List<Person> person { get; set; }
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }

    public class Person
    {
        public string Attach_Name { get; set; }
        public string TIN_Info { get; set; }
        public byte[] Attach_file { get; set; }

        // Optional: Add this if you want Base64 for web display
        public string Attach_file_Base64 { get; set; }
    }
}
