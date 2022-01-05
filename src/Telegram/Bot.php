<?php

namespace Telegram;

class Bot
{
    public static $url = "";
    public static $group = '-1001794834267';

    public static function sendMessage($message)
    {
        self::send('sendMessage', ['text' => $message]);
    }

    public static function sendPhoto($photo, $caption)
    {
        $caption = str_replace(['.', '#'], ["\\.", "\\#"], $caption);
        self::send('sendphoto', ['photo' => $photo, 'caption' => $caption]);
    }

    protected static function send($method, $data)
    {
        $url = self::$url.$method;
        $data = array_merge([
            'chat_id' => self::$group,
            'parse_mode' => 'MarkdownV2',
        ], $data);

        $curl = curl_init($url);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $output = curl_exec($curl);

        var_dump($output);
    }
}