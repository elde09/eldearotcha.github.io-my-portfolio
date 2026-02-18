# PHPMailer Contact Form Setup Guide

This guide will help you set up the PHPMailer contact form on your portfolio website.

## Prerequisites

- PHP 7.0 or higher
- Composer (PHP package manager)
- SMTP email account (Gmail, Outlook, or your hosting provider)

## Installation Steps

### Step 1: Install PHPMailer



This will install PHPMailer based on the `composer.json` file.

### Step 2: Configure Email Settings

Open `send_email.php` and update these lines with your email credentials:

```php
$mail->Host       = 'smtp.gmail.com';         // Your SMTP server
$mail->Username   = 'your-email@gmail.com';  // Your email address
$mail->Password   = 'your-app-password';     // Your email password or app password
```

### Step 3: Email Provider Configuration

#### For Gmail:
1. Enable 2-Step Verification
2. Create an **App Password** (not your regular password):
   - Go to: https://myaccount.google.com/apppasswords
   - Generate a new app password
   - Use this in the `$mail->Password` field

#### For Other Email Providers:
- **Outlook.com**: Host: `smtp-mail.outlook.com`, Port: 587
- **Yahoo Mail**: Host: `smtp.mail.yahoo.com`, Port: 587
- **Custom Email (cPanel/Hosting)**:
  - Contact your hosting provider for SMTP settings
  - Usually found in your hosting control panel

### Step 4: Update Recipient Email

In `send_email.php`, find this line and update it:

```php
$mail->addAddress('elde.arotcha@gmail.com');  // Change to your email
```

### Step 5: Test the Form

1. Make sure your website is running on a local PHP server or uploaded to your hosting
2. Fill out the contact form
3. Submit and check if the email arrives

## Troubleshooting

### Email Not Sending?
- Check that SMTP credentials are correct
- Verify your firewall/hosting allows outbound SMTP connections on port 587
- Check your email provider's security settings
- Look for error messages in the browser console

### SMTP Connection Error?
- Make sure you're using the correct SMTP server address
- Verify port number (commonly 587 for TLS or 465 for SSL)
- Check if your hosting provider blocks SMTP (contact them)

### Security Tips
- Never commit `send_email.php` with real credentials to public repositories
- Use environment variables for sensitive data (production best practice)
- Add rate limiting to prevent spam

## File Structure

```
your-project/
├── index.html
├── send_email.php          (Main email handler)
├── composer.json           (PHPMailer configuration)
├── vendor/                 (PHPMailer library - created after composer install)
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js       (Updated with form handler)
└── README.md
```

## Features

✓ Email validation
✓ HTML formatted emails
✓ Error handling
✓ User-friendly feedback messages
✓ Form reset after successful submission
✓ AJAX submission (no page reload)

## Security Notes

For production environments, consider:
- Using environment variables for credentials
- Adding CAPTCHA verification
- Rate limiting
- Additional input sanitization
- HTTPS requirement

Need help? Contact your hosting provider or check PHPMailer documentation: https://github.com/PHPMailer/PHPMailer
