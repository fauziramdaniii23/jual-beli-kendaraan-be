<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Mobil Berhasil Dipublikasikan</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">

<div style="max-width: 600px; margin: auto; background: white; padding: 24px; border-radius: 10px;">

    <h2 style="color: #2d3748;">
        🚗 Mobil Berhasil Dipublikasikan
    </h2>

    <p>Halo,</p>

    <p>
        Mobil kamu <b>{{ $carName }}</b> sudah berhasil dipublikasikan di Garasi 88.
    </p>

    <div style="margin: 20px 0; padding: 12px; background: #f0f4f8; border-radius: 8px;">
        <strong>ID Mobil:</strong> {{ $carId }}
    </div>

    <a href="{{ url('/cars/' . $carId) }}"
       style="display: inline-block; padding: 10px 16px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
        Lihat Mobil
    </a>

    <hr style="margin: 20px 0;">

    <p style="font-size: 12px; color: #999;">
        Terima kasih telah menggunakan Garasi 88.
    </p>

</div>

</body>
</html>
