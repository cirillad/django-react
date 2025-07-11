using Microsoft.AspNetCore.Mvc;
using WebStore.Interfaces;
using WebStore.SMTP;

namespace WebStore.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly ISmtpService _emailService;

        public WeatherForecastController(ILogger<WeatherForecastController> logger,
            ISmtpService emailService)
        {
            _logger = logger;
            _emailService = emailService;
        }

        [HttpGet]
        public async Task<IEnumerable<WeatherForecast>> Get()
        {

            await _emailService.SendEmailAsync(
                new EmailMessage
                {
                    To = "novakvova@gmail.com",
                    Subject = "Test Email",
                    Body = "<h1>Hello from WebStore</h1><p>This is a test email sent from the WebStore application.</p>"
                }
            );
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }
    }
}
