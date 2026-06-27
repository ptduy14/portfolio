# capture-screenshots.ps1
# Chạy từ project root: powershell -ExecutionPolicy Bypass -File scripts\capture-screenshots.ps1
# Yêu cầu: npm start đang chạy trên localhost:3000

param([string]$OutDir = "screenshots")

Add-Type -AssemblyName System.Windows.Forms, System.Drawing
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class Win32Api {
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int n);
    [DllImport("user32.dll")] public static extern IntPtr FindWindow(string cls, string title);
    [DllImport("user32.dll")] public static extern bool GetClientRect(IntPtr h, out RECT r);
    [DllImport("user32.dll")] public static extern bool ClientToScreen(IntPtr h, ref POINT p);
    public struct RECT { public int L, T, R, B; }
    public struct POINT { public int X, Y; }
}
"@

if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }

function Capture-Screen($name) {
    # Find Chrome showing Portfolio OS
    $chrome = Get-Process chrome -EA SilentlyContinue |
        Where-Object { $_.MainWindowTitle -like "*Portfolio OS*" } |
        Select-Object -First 1
    if (-not $chrome) {
        Write-Warning "Chrome Portfolio OS window not found — taking full screen"
        $bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    } else {
        [Win32Api]::ShowWindow($chrome.MainWindowHandle, 3) | Out-Null
        [Win32Api]::SetForegroundWindow($chrome.MainWindowHandle) | Out-Null
        Start-Sleep -Milliseconds 600
        $bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    }

    $bmp = New-Object System.Drawing.Bitmap($bounds.Width, $bounds.Height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size)
    $g.Dispose()

    $path = Join-Path $OutDir "$name.png"
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "  ✓ $path"
}

Write-Host "Portfolio OS — Screenshot Capture"
Write-Host "Make sure localhost:3000 is open in Chrome as active tab"
Write-Host ""

# The script navigates via the browser — user should manually set each screen
# OR run alongside the automated browser (Claude in Chrome extension)
$screens = @(
    @{name="01-desktop";    hint="Desktop with Ask Me Terminal open"},
    @{name="02-bio";        hint="Bio app open"},
    @{name="03-skills";     hint="Skills System Monitor open"},
    @{name="04-projects";   hint="Projects app open"},
    @{name="05-contact";    hint="Contact app open"},
    @{name="06-settings";   hint="Quick Settings panel open"}
)

foreach ($s in $screens) {
    Write-Host "Press Enter when browser shows: $($s.hint)"
    Read-Host | Out-Null
    Capture-Screen $s.name
}

Write-Host ""
Write-Host "Done! Screenshots saved to ./$OutDir/"
