<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Order Masuk</title>
</head>

<body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">

<div style="max-width: 650px; margin: auto; background: white; padding: 24px; border-radius: 10px;">

    <h2 style="margin-bottom: 10px; color: #333;">
        🚗 Order Mobil Baru Masuk
    </h2>

    <p style="color: #555;">
        Ada customer yang melakukan pemesanan mobil. Berikut detailnya:
    </p>

    <hr style="margin: 20px 0;">

    <!-- UNIT MOBIL -->
    <h3 style="color: #111;">🚘 Detail Unit Mobil</h3>

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
            <td><b>Bahan Bakar</b></td>
            <td>: {{ $unit->fuel_type_code }}</td>
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
    <h3 style="color: #111;">👤 Data Customer</h3>

    <table style="width: 100%; margin-bottom: 20px;">
        <tr>
            <td><b>Nama</b></td>
            <td>: {{ $customer->name }}</td>
        </tr>
        <tr>
            <td><b>No HP</b></td>
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
    <div style="margin-top: 25px; text-align: center;">

        <!-- LINK DETAIL UNIT -->
        <a href="{{ url('/unit/' . $unit->slug) }}"
           style="display:inline-block; padding:12px 20px; margin:5px;
           background:#2563eb; color:white; text-decoration:none;
           border-radius:6px;">
            🔎 Lihat Detail Unit
        </a>

        <!-- WHATSAPP LINK -->
        <a href="https://wa.me/{{ preg_replace('/^0/', '62', $customer->phone) }}?text={{ urlencode(
            "Halo " . $customer->name .
            ", kami dari showroom ingin mengkonfirmasi order mobil " . $unit->name .
            ". Berikut detail unit: " . url('/unit/' . $unit->slug)
        ) }}"
           style="display:inline-block; padding:12px 20px; margin:5px;
           background:#22c55e; color:white; text-decoration:none;
           border-radius:6px;">
            💬 Chat WhatsApp
        </a>

    </div>

    <hr style="margin: 25px 0;">

    <p style="font-size: 12px; color: #888; text-align: center;">
        Email ini dikirim otomatis dari sistem Order Management.
    </p>

</div>

</body>
</html>
