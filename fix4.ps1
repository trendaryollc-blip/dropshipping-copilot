$src = 'e:\desktop site\dropshipping-copilot\src\app\page.tsx'
$tmp = 'e:\desktop site\dropshipping-copilot\src\app\page.tsx.tmp'
$content = [System.IO.File]::ReadAllText($src)
$content = $content.Replace('bg-white', 'bg-gradient-to-br from-[#F0FAF9] via-white to-[#E8F5F3]')
[System.IO.File]::WriteAllText($tmp, $content)
Write-Host 'Temp written'
Copy-Item $tmp $src -Force
Write-Host 'Copied back'