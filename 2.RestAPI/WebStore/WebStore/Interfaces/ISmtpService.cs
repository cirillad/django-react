using WebStore.SMTP;

namespace WebStore.Interfaces;

public interface ISmtpService
{
    Task<bool> SendEmailAsync(EmailMessage message);
}
