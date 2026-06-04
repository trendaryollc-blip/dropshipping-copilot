$path = 'e:\desktop site\dropshipping-copilot\src\app\page.tsx'
$content = [System.IO.File]::ReadAllText($path)
$content = $content.Replace('bg-white', 'bg-gradient-to-br from-[#F0FAF9] via-white to-[#E8F5F3]')
$fs = [System.IO.File]::Open($path, [System.IO.FileMode]::Open, [System.IO.FileAccess]::ReadWrite, [System.IO.FileShare]::None)
$sw = [System.IO.StreamWriter]::new($fs)
$sw.Write($content)
$sw.Close()
$fs.Close()
Write-Host 'Done'