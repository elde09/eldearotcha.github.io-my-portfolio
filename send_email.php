<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Set response header
header('Content-Type: application/json');

try {
    // Check if form was submitted via POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method');
    }

    // Validate and sanitize form inputs
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    // Validation
    if (empty($name) || empty($email) || empty($phone) || empty($message)) {
        throw new Exception('All fields are required');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email address');
    }

    if (strlen($message) < 10) {
        $len = strlen($message);
        throw new Exception("Message is too short (" . $len . " characters). Please provide at least 10 characters describing your request.");
    }

    // Load PHPMailer
    require 'vendor/autoload.php';

    $mail = new PHPMailer(true);

    // Server settings
    $mail->isSMTP();                              // Send using SMTP
    $mail->Host       = 'smtp.gmail.com';         // Set the SMTP server to Gmail (or your email provider)
    $mail->SMTPAuth   = true;                     // Enable SMTP authentication
    $mail->Username   = 'elde.arotcha@gmail.com';  // SMTP username (your Gmail/email)
    $mail->Password   = 'lifxxnrnfyhcwyxj';     // SMTP password (Gmail App Password)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Enable TLS encryption
    $mail->Port       = 587;                      // TCP port to connect to

    // Recipients
    $mail->setFrom('elde.arotcha@gmail.com', 'Github Portfolio Website');
    $mail->addAddress('elde.arotcha@gmail.com');
    $mail->addReplyTo($email, $name);

    $mail->CharSet = 'UTF-8';
    // Content
    $mail->isHTML(true);
    $mail->Subject = "Job Request from $name";
    $mail->AltBody = "Name: $name\nEmail: $email\nPhone: $phone\n\n$message";
    $mail->SMTPOptions = [
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true,
        ],
    ];

    // Create email body
    $emailBody = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #333; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .field { margin: 15px 0; }
                .label { font-weight: bold; color: #333; }
                .value { color: #666; margin-top: 5px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>Job Request from $name</h2>
                </div>
                <div class='content'>
                    <div class='field'>
                        <div class='label'>Name:</div>
                        <div class='value'>" . htmlspecialchars($name) . "</div>
                    </div>
                    <div class='field'>
                        <div class='label'>Email:</div>
                        <div class='value'>" . htmlspecialchars($email) . "</div>
                    </div>
                    <div class='field'>
                        <div class='label'>Phone:</div>
                        <div class='value'>" . htmlspecialchars($phone) . "</div>
                    </div>
                    <div class='field'>
                        <div class='label'>Message:</div>
                        <div class='value'>" . nl2br(htmlspecialchars($message)) . "</div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    ";

    $mail->Body = $emailBody;

    // Attach uploaded document (single)
    if (!empty($_FILES['attachment']) && isset($_FILES['attachment']['error']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
        $tmp = $_FILES['attachment']['tmp_name'];
        $name = $_FILES['attachment']['name'];
        if (is_uploaded_file($tmp)) {
            $mail->addAttachment($tmp, $name);
        }
    }

    // Attach uploaded images (multiple)
    if (!empty($_FILES['images']) && isset($_FILES['images']['error']) && is_array($_FILES['images']['error'])) {
        foreach ($_FILES['images']['error'] as $i => $error) {
            if ($error === UPLOAD_ERR_OK) {
                $tmp = $_FILES['images']['tmp_name'][$i];
                $name = $_FILES['images']['name'][$i];
                // Basic image check
                if (is_uploaded_file($tmp) && @getimagesize($tmp) !== false) {
                    $mail->addAttachment($tmp, $name);
                }
            }
        }
    }

    // Send email
    if ($mail->send()) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Email sent successfully! I will get back to you soon.'
        ]);
    } else {
        throw new Exception('Email could not be sent');
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
