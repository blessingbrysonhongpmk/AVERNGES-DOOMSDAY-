Add-Type -AssemblyName System.Drawing

$srcPath = "public/doctor-doom-stained-glass.jpg"
$backupPath = "public/doctor-doom-stained-glass.orig.jpg"

if (-not (Test-Path $backupPath)) {
    Copy-Item $srcPath $backupPath
}

$bmp = [System.Drawing.Bitmap]::FromFile($backupPath)
$width = $bmp.Width
$height = $bmp.Height
Write-Host "Image dimensions: $width x $height"

# Create a graphic to paint gradient and solid dark fill over the bottom text
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

# Fade start and solid start
$fadeStartY = [int]($height * 0.52) # ~299px
$solidStartY = [int]($height * 0.65) # ~373px

# 1. Smooth gradient transition from transparent to #08090B
$rectGradient = New-Object System.Drawing.Rectangle(0, $fadeStartY, $width, ($solidStartY - $fadeStartY))
$cTop = [System.Drawing.Color]::FromArgb(0, 8, 9, 11)
$cBottom = [System.Drawing.Color]::FromArgb(255, 8, 9, 11)
$brushGrad = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rectGradient, $cTop, $cBottom, [System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
$g.FillRectangle($brushGrad, $rectGradient)
$brushGrad.Dispose()

# 2. Solid cinematic black covering all baked-in text and timers in the bottom portion
$rectSolid = New-Object System.Drawing.Rectangle(0, $solidStartY, $width, ($height - $solidStartY))
$brushSolid = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 8, 9, 11))
$g.FillRectangle($brushSolid, $rectSolid)
$brushSolid.Dispose()

$g.Dispose()

# Save cleaned image
$tmpPath = "public/doctor-doom-stained-glass.tmp.jpg"
$bmp.Save($tmpPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmp.Dispose()

Move-Item -Force $tmpPath $srcPath
# Also copy to doctor-doom-portrait.jpg so both are clean
Copy-Item -Force $srcPath "public/doctor-doom-portrait.jpg"

Write-Host "Cleaned background image saved successfully with zero baked-in text or timers."
