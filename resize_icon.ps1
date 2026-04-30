Add-Type -AssemblyName System.Drawing
$sourcePath = "C:\Users\endri\.gemini\antigravity\brain\7703f60c-d911-4965-980f-dbb43c886754\media__1777557050546.png"
$destPath = "f:\projetos IA\programa chat\public\icon.png"
$src = [System.Drawing.Image]::FromFile($sourcePath)
$bmp = New-Object System.Drawing.Bitmap(256, 256)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($src, 0, 0, 256, 256)
$bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
$src.Dispose()
$g.Dispose()
$bmp.Dispose()
