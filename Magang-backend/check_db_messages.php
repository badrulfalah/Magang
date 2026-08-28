<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\ChatMessage;

$messages = ChatMessage::with('sender')->get();
foreach ($messages as $msg) {
    echo "ID: " . $msg->id . "\n";
    echo "Session ID: " . $msg->chat_session_id . "\n";
    echo "Sender ID: " . $msg->sender_id . "\n";
    echo "Sender Name: " . ($msg->sender->name ?? 'NULL') . "\n";
    echo "Message: " . $msg->message . "\n\n";
}
