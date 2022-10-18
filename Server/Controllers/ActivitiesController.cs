using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

using ToDo.DTOs;
using ToDo.Models;
using Microsoft.AspNetCore.Authorization;

namespace ToDo.Controllers;

[ApiController]
[Route("[controller]")]
public class ActivitiesController : ControllerBase
{

    private readonly ILogger<ActivitiesController> _logger;


    public ActivitiesController(ILogger<ActivitiesController> logger)
    {
        _logger = logger;

    }
    [HttpGet]
    //claims type User
    // [Authorize(Roles = "user")]
    public IActionResult Get()
    {
        var db = new ToDoDbContext();

        var activities = db.Activities.Select(a => a).OrderBy(a => a.Id);


        return Ok(activities);
    }

    [HttpGet("{Id}")]
    public IActionResult Get(uint Id)
    {
        var db = new ToDoDbContext();

        var activities = db.Activities.Find(Id);

        if (activities == null)
        {
            return NotFound();
        }


        return Ok(activities);
    }

    //Post add
    [Authorize(Roles = "user")]
    [HttpPost("add")]
    public IActionResult Post([FromBody] ActivityDTO Dto)
    {
        var db = new ToDoDbContext();
        Activity newActivity = new Activity();
        newActivity.Name = Dto.Name;
        newActivity.When = Dto.When;
        db.Activities.Add(newActivity);
        db.SaveChanges();
        return StatusCode(201, newActivity);
    }

    //Put update
    [Authorize(Roles = "user")]
    [HttpPut("{Id}")]
    public IActionResult Put(uint Id, [FromBody] ActivityDTO Dto)
    {
        var db = new ToDoDbContext();
        var oldActivity = db.Activities.Find(Id);
        if (oldActivity == null)
        {
            return NotFound();
        }
        oldActivity.Name = Dto.Name;
        oldActivity.When = Dto.When;
        db.SaveChanges();
        return Ok(oldActivity);
    }

    //Delete
    [Authorize(Roles = "user")]
    [HttpDelete("{Id}")]
    public IActionResult Delete(uint Id)
    {
        var db = new ToDoDbContext();
        var oldActivity = db.Activities.Find(Id);
        if (oldActivity == null)
        {
            return NotFound();
        }
        db.Activities.Remove(oldActivity);
        db.SaveChanges();
        return Ok();
    }

    //SignIn Token
    [HttpPost("login")]
    public IActionResult SignIn([FromBody] SignInDTO Dto)
    {
        var db = new ToDoDbContext();
        var user = db.Users.Find(Dto.Id);
        if (user == null)
        {
            return StatusCode(200, new
            {
                message = "User not found",
                status = 404
            });
        }

        string password = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: Dto.Password,
            salt: Convert.FromBase64String(user.Salt.Substring(0, 24)),
            prf: KeyDerivationPrf.HMACSHA1,
            iterationCount: 10000,
            numBytesRequested: 256 / 8));

        if (user.Password != password)
        {
            return StatusCode(200, new
            {
                message = "Wrong password",
                status = 404
            });
        }

        var d = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, user.Id),
                new Claim(ClaimTypes.Role, "user")
            }),
            NotBefore = DateTime.UtcNow,
            Expires = DateTime.UtcNow.AddHours(3),
            IssuedAt = DateTime.UtcNow,
            Issuer = "todo",
            Audience = "public",
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Program.SecurityKey)), SecurityAlgorithms.HmacSha256Signature)
        };

        var h = new JwtSecurityTokenHandler();
        var token = h.CreateToken(d);
        string tokenString = h.WriteToken(token);


        return StatusCode(200, new
        {
            token = tokenString,
            status = 200
        });
    }

    [HttpPost("signup")]
    public IActionResult SignUp([FromBody] SignInDTO Dto)
    {
        var db = new ToDoDbContext();
        var user = db.Users.Find(Dto.Id);
        if (user != null)
        {
            return Ok("User already exists");
        }


        string salt = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: Dto.Password,
            salt: Encoding.UTF8.GetBytes("todo"),
            prf: KeyDerivationPrf.HMACSHA1,
            iterationCount: 10000,
            numBytesRequested: 256 / 8));

        string password = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: Dto.Password,
            salt: Convert.FromBase64String(salt.Substring(0, 24)),
            prf: KeyDerivationPrf.HMACSHA1,
            iterationCount: 10000,
            numBytesRequested: 256 / 8));

        user = new User
        {
            Id = Dto.Id,
            Password = password,
            //only 24 characters
            Salt = salt.Substring(0, 24)
        };

        db.Users.Add(user);
        db.SaveChanges();

        var d = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, user.Id),
                new Claim(ClaimTypes.Role, "user")
            }),
            NotBefore = DateTime.UtcNow,
            Expires = DateTime.UtcNow.AddHours(3),
            IssuedAt = DateTime.UtcNow,
            Issuer = "todo",
            Audience = "public",
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Program.SecurityKey)), SecurityAlgorithms.HmacSha256Signature)
        };

        var h = new JwtSecurityTokenHandler();
        var token = h.CreateToken(d);
        string tokenString = h.WriteToken(token);


        return StatusCode(201, new { token = tokenString });
    }
}
