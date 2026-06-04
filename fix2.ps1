$path = 'e:\desktop site\dropshipping-copilot\src\app\page.tsx'
$bak = $path + '.bak'
Copy-Item $path $bak -Force
$c = [System.IO.File]::ReadAllText($path)
$c = $c.Replace('bg-white', 'bg-gradient-to-br from-[#F0FAF9] via-white to-[#E8F5F3]')
[System.IO.File]::WriteAllText($path, $c)
Write-Host 'Replaced:' $c.Contains('bg-gradient')