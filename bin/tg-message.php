<?php

require __DIR__ . '/../src/Telegram/Bot.php';

if(isset($argv[2])) {
    \Telegram\Bot::sendPhoto($argv[1], $argv[2]);
} else {
    \Telegram\Bot::sendMessage($argv[1]);
}