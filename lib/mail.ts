import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

const createEmailTemplate = (
  title: string,
  message: string,
  buttonText: string,
  buttonLink: string
) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { 
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f8f8;
        }
        .container {
            background-color: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .logo-container {
            text-align: center;
            margin-bottom: 32px;
        }
        h1 {
            text-align: center;
            margin-bottom: 24px;
            font-size: 32px;
            font-weight: 700;
            line-height: 1.2;
        }
        .reddit-text {
            color: #ff4500;
        }
        .growth-text {
            color: #1a1a1a;
        }
        p {
            margin-bottom: 24px;
            font-size: 16px;
            color: #4a4a4a;
            line-height: 1.8;
        }
        .button-container {
            text-align: center;
            margin: 32px 0;
        }
        .button {
            display: inline-block;
            padding: 14px 32px;
            background-color: #ff4500;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(255, 69, 0, 0.2);
        }
        .button:hover {
            background-color: #ff5722;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(255, 69, 0, 0.3);
        }
        .warning-text {
            font-style: italic;
            color: #666;
            font-size: 14px;
            text-align: center;
            margin: 24px 0;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eaeaea;
            padding-top: 24px;
        }
        .footer a {
            color: #ff4500;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo-container">
            <h1>
                <span class="reddit-text">Reddit</span><span class="growth-text">Growth</span>
            </h1>
        </div>
        <p>${message}</p>
        <div class="button-container">
            <a href="${buttonLink}" class="button">${buttonText}</a>
        </div>
        <p class="warning-text">If you didn't request this, please ignore this email.</p>
        <div class="footer">
            <p>Thanks,<br><strong>RedditGrowth Team</strong></p>
            <p>Need help? Contact us at <a href="mailto:support@redditgrowth.com">support@redditgrowth.com</a></p>
        </div>
    </div>
</body>
</html>
`;

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `https://app.redditgrowth.com/auth/new-password?token=${token}`;
  const emailHtml = createEmailTemplate(
    "Reset Your Password",
    "You've requested to reset your password. Click the button below to set a new password:",
    "RESET PASSWORD",
    resetLink
  );

  await resend.emails.send({
    from: "support@redditgrowth.com",
    to: email,
    subject: "Reset Your Password",
    html: emailHtml,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `https://app.redditgrowth.com/auth/new-verification?token=${token}`;
  const emailHtml = createEmailTemplate(
    "Verify Your Email",
    "Thank you for signing up with RedditGrowth! Please click the button below to verify your email address:",
    "VERIFY EMAIL",
    confirmLink
  );

  await resend.emails.send({
    from: "support@redditgrowth.com",
    to: email,
    subject: "Verify Your Email",
    html: emailHtml,
  });
};