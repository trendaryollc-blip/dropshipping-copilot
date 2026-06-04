$ErrorActionPreference = 'SilentlyContinue'
$path = 'e:\desktop site\dropshipping-copilot\src\app\page.tsx'
$content = [System.IO.File]::ReadAllText($path)
$content = $content.Replace('bg-white', 'bg-gradient-to-br from-[#F0FAF9] via-white to-[#E8F5F3]')
[System.IO.File]::WriteAllText($path, $content)
Write-Host 'Done'