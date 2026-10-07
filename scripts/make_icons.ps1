Add-Type -AssemblyName System.Drawing

function Create-PngIcon($size, $outputPath) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

    # Background gradient
    $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $c1 = [System.Drawing.Color]::FromArgb(124, 58, 237)
    $c2 = [System.Drawing.Color]::FromArgb(79, 70, 229)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 45)
    $g.FillRectangle($brush, $rect)

    # 4-pointed Star Sparkle
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $cx = [float]($size / 2)
    $cy = [float]($size / 2)
    $r = [float]($size * 0.28)
    $rInner = [float]($r * 0.25)

    $pts = @(
        (New-Object System.Drawing.PointF($cx, ($cy - $r))),
        (New-Object System.Drawing.PointF(($cx + $rInner), ($cy - $rInner))),
        (New-Object System.Drawing.PointF(($cx + $r), $cy)),
        (New-Object System.Drawing.PointF(($cx + $rInner), ($cy + $rInner))),
        (New-Object System.Drawing.PointF($cx, ($cy + $r))),
        (New-Object System.Drawing.PointF(($cx - $rInner), ($cy + $rInner))),
        (New-Object System.Drawing.PointF(($cx - $r), $cy)),
        (New-Object System.Drawing.PointF(($cx - $rInner), ($cy - $rInner)))
    )

    $g.FillPolygon($whiteBrush, $pts)
    $g.Dispose()

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created PNG icon: $outputPath"
}

Create-PngIcon 192 "public/icons/icon-192x192.png"
Create-PngIcon 512 "public/icons/icon-512x512.png"
Create-PngIcon 96  "public/icons/icon-96x96.png"
Create-PngIcon 144 "public/icons/icon-144x144.png"
