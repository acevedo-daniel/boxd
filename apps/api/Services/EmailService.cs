using System.Net;
using System.Net.Mail;
using e_commerce_api.Interfaces;

namespace e_commerce_api.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var smtpSettings = _configuration.GetSection("SmtpSettings");
            var host = smtpSettings["Host"] ?? throw new InvalidOperationException("SMTP Host is not configured");
            var port = int.Parse(smtpSettings["Port"] ?? "587");
            var enableSsl = bool.Parse(smtpSettings["EnableSsl"] ?? "true");
            var user = smtpSettings["User"] ?? throw new InvalidOperationException("SMTP User is not configured");
            var password = smtpSettings["Password"] ?? throw new InvalidOperationException("SMTP Password is not configured");
            var from = smtpSettings["From"] ?? throw new InvalidOperationException("SMTP From is not configured");

            using var client = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(user, password),
                EnableSsl = enableSsl
            };

            var mail = new MailMessage(from, to, subject, body)
            {
                IsBodyHtml = true
            };

            await client.SendMailAsync(mail);
        }
    }
} 