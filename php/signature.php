<?php

// Функция для генерации ключевой пары и сохранения ключей в файлы
function generateAndSaveKeyPair($privateKeyFile, $publicKeyFile) {
    // Генерируем ключевую пару с использованием openssl_pkey_new
    $config = array(
        "digest_alg" => "sha256",
        "private_key_bits" => 2048,
        "private_key_type" => OPENSSL_KEYTYPE_RSA,
    );

    $keyPair = openssl_pkey_new($config);

    // Экспортируем приватный ключ и сохраняем его в файл
    openssl_pkey_export($keyPair, $privateKey);
    file_put_contents($privateKeyFile, $privateKey);

    // Извлекаем публичный ключ и сохраняем его в файл
    $publicKey = openssl_pkey_get_details($keyPair)['key'];
    file_put_contents($publicKeyFile, $publicKey);
}

// Функция для загрузки приватного ключа из файла
function loadPrivateKey($privateKeyFile) {
    return file_get_contents($privateKeyFile);
}

// Функция для загрузки публичного ключа из файла
function loadPublicKey($publicKeyFile) {
    return file_get_contents($publicKeyFile);
}

// Пример использования
$privateKeyFile = 'private_key.pem';
$publicKeyFile = 'public_key.pem';

// Генерируем ключевую пару и сохраняем ключи в файлы
generateAndSaveKeyPair($privateKeyFile, $publicKeyFile);
echo "Сгенерирована и сохранена ключевая пара.\n";

// Загружаем приватный и публичный ключи из файлов
$privateKey = loadPrivateKey($privateKeyFile);
$publicKey = loadPublicKey($publicKeyFile);

$data = "некоторые_данные_для_подписи";

// Генерируем подпись
$signature = generateSignature($data, $privateKey);
echo "Сгенерированная подпись: " . $signature . "\n";

// Проверяем подпись
$isSignatureValid = verifySignature($data, $signature, $publicKey);
echo "Подпись верна? " . ($isSignatureValid ? "Да" : "Нет") . "\n";

?>
