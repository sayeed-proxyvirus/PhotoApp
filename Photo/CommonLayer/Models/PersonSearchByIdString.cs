using System;
using System.Collections.Generic;
using System.Net.Sockets;

namespace Photo.CommonLayer.Models
{
    public class PersonSearchByIdString
    {

        public class PersonSearchByIdStringRequest 
        {
            public string  Date { get; set; }
            public int Id { get; set; }
        }

        public class PersonSearchByIdStringResponse
        {
            public bool IsSuccess { get; set; }
            public string Message { get; set; }
            public List<Person> person { get; set; }
            

        }

        public class Person 
        {
            public int TIN_Info { get; set; }
            public string Attach_Name { get; set; }
            public byte[] Attach_file { get; set; }
            public string Attach_Ext { get; set; }
        }




    }
}
