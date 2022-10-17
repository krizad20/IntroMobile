using System;
using System.Collections.Generic;

namespace ToDo.Models
{
    public partial class User
    {
        public string Id { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Salt { get; set; } = null!;
    }
}
