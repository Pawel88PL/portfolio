namespace backend.Services.EmailBody
{
    public class ResetPasswordEmailBody
    {
        public string GenerateResetPasswordEmailBody(string name, string link)
        {
            return $@"
            <html>
            <head>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        background-color: #f4f4f4;
                        padding: 20px;
                    }}
                    .container {{
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                        border-radius: 10px;
                        background-color: #fff;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }}
                    .header {{
                        background-color: #007BFF;
                        color: white;
                        padding: 15px 0;
                        text-align: center;
                        font-size: 24px;
                        font-weight: bold;
                        border-radius: 10px 10px 0 0;
                    }}
                    .content {{
                        padding: 20px;
                        text-align: center;
                    }}
                    .link {{
                        display: inline-block;
                        margin-top: 20px;
                        margin-bottom: 20px;
                        font-size: 1.2em;
                        font-weight: bold;
                    }}
                    h2 {{
                        color: #007BFF;
                        font-size: 22px;
                        margin-bottom: 20px;
                    }}
                    p {{
                        font-size: 16px;
                        margin: 15px 0;
                    }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        Resetowanie hasła
                    </div>
                    <div class='content'>
                        <h2>Witaj {name},</h2>
                        <p>Otrzymaliśmy prośbę o zresetowanie Twojego hasła.</p>
                        <p>Aby ustawić nowe hasło, kliknij w jednorazowy link:</p>
                        <a href='{link}' class='link'>Zresetuj hasło</a>
                        <p><strong>Link jest ważny przez 2 godziny.</strong></p>
                    </div>
                </div>
            </body>
            </html>";
        }
    }
}