<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Order Masuk</title>
</head>

<body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">

<div style="max-width: 650px; margin: auto; background: white; padding: 24px; border-radius: 10px;">

    <!-- HEADER DEALER -->
    <div style="text-align: center; margin-bottom: 20px;">

        <img src="{{ asset('assets/img/logo.png') }}"
             alt="Logo Dealer"
             style="max-height: 60px; margin-bottom: 10px;">

        <h2 style="margin: 0; color: #111;">
            {{ config('app.name') }}
        </h2>

        <p style="color: #666; font-size: 14px;">
            Notifikasi Order Masuk
        </p>
    </div>

    <hr style="margin: 20px 0;">

    <!-- UNIT MOBIL -->
    <h3>🚘 Detail Unit Mobil</h3>

    <table style="width: 100%; margin-bottom: 20px;">
        <tr>
            <td><b>Nama Mobil</b></td>
            <td>: {{ $unit->name }}</td>
        </tr>
        <tr>
            <td><b>Tahun</b></td>
            <td>: {{ $unit->year }}</td>
        </tr>
        <tr>
            <td><b>Transmisi</b></td>
            <td>: {{ $unit->transmission_code }}</td>
        </tr>
        <tr>
            <td><b>Warna</b></td>
            <td>: {{ $unit->color }}</td>
        </tr>
        <tr>
            <td><b>Harga</b></td>
            <td>: Rp {{ number_format($unit->price, 0, ',', '.') }}</td>
        </tr>
    </table>

    <!-- CUSTOMER -->
    <h3>👤 Data Customer</h3>

    <table style="width: 100%; margin-bottom: 20px;">
        <tr>
            <td><b>Nama</b></td>
            <td>: {{ $customer->name }}</td>
        </tr>
        <tr>
            <td><b>Phone</b></td>
            <td>: {{ $customer->phone }}</td>
        </tr>
        <tr>
            <td><b>Email</b></td>
            <td>: {{ $customer->email }}</td>
        </tr>
        <tr>
            <td><b>Alamat</b></td>
            <td>: {{ $customer->address }}</td>
        </tr>
    </table>

    <!-- ACTION BUTTON -->
    <div style="text-align:center; margin-top: 25px;">

        <a href="{{ url('/unit/' . $unit->slug) }}"
           style="padding:12px 18px; background:#2563eb; color:white;
           text-decoration:none; border-radius:6px; display:inline-block;">
            🔎 Lihat Unit
        </a>

        <a href="https://wa.me/{{ preg_replace('/^0/', '62', $customer->phone) }}?text={{ urlencode(
            "Halo " . $customer->name .
            ", kami dari " . config('app.name') .
            " ingin mengkonfirmasi order mobil " . $unit->name .
            ". Detail: " . url('/unit/' . $unit->slug)
        ) }}"
           style="padding:12px 18px; background:#22c55e; color:white;
           text-decoration:none; border-radius:6px; display:inline-block; margin-left:10px;">
            💬 WhatsApp
        </a>

    </div>

    <hr style="margin: 25px 0;">

    <p style="font-size: 12px; color: #888; text-align: center;">
        © {{ date('Y') }} {{ config('app.name') }} - Sistem Notifikasi Order
    </p>

</div>

</body>
</html>
