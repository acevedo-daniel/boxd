using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using e_commerce_api.Interfaces;

namespace e_commerce_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QrController : ControllerBase
    {
        private readonly IQrService _qrService;

        public QrController(IQrService qrService)
        {
            _qrService = qrService;
        }

        [HttpPost("generate")]
        [Authorize]
        public async Task<IActionResult> GenerateQrCode([FromQuery] int expirationMinutes = 10)
        {
            try
            {
                var qrToken = await _qrService.GenerateQrTokenAsync(expirationMinutes);
                var url = _qrService.GetQrTokenUrl(qrToken.Token);
                var qrCodeBytes = _qrService.GenerateQrCode(url);

                return File(qrCodeBytes, "image/png", "qr-code.png");
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("validate/{token}")]
        public async Task<IActionResult> ValidateQrToken(string token)
        {
            try
            {
                var qrToken = await _qrService.ValidateQrTokenAsync(token);
                
                if (qrToken == null)
                {
                    return BadRequest(new { message = "Invalid or expired QR token" });
                }

                // Mark the token as used
                await _qrService.UseQrTokenAsync(token, Request.Headers["User-Agent"].ToString());

                return Ok(new { 
                    message = "QR token validated successfully",
                    token = token,
                    expiresAt = qrToken.ExpiresAt
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("info/{token}")]
        public async Task<IActionResult> GetQrTokenInfo(string token)
        {
            try
            {
                var qrToken = await _qrService.ValidateQrTokenAsync(token);
                
                if (qrToken == null)
                {
                    return BadRequest(new { message = "Invalid or expired QR token" });
                }

                return Ok(new { 
                    token = qrToken.Token,
                    expiresAt = qrToken.ExpiresAt,
                    isUsed = qrToken.IsUsed
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
} 