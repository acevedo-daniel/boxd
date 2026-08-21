namespace Boxd.Api.Infrastructure.Email
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
    }
} 