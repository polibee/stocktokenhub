# Fix SVG file case issues
# Rename SVG files in static/img/tokens/ to lowercase

$tokensDir = "d:/front/stocktokenhub/static/img/tokens"

Write-Host "Starting SVG file case fix..." -ForegroundColor Green
Write-Host "Target directory: $tokensDir" -ForegroundColor Cyan

if (-not (Test-Path $tokensDir)) {
    Write-Host "Tokens directory does not exist!" -ForegroundColor Red
    exit 1
}

try {
    $svgFiles = Get-ChildItem -Path $tokensDir -Filter "*.svg" | Where-Object { $_.Name -cmatch "[A-Z]" }
    
    Write-Host "Found $($svgFiles.Count) SVG files to rename" -ForegroundColor Yellow
    
    $renamedCount = 0
    
    foreach ($file in $svgFiles) {
        $oldName = $file.Name
        $newName = $oldName.ToLower()
        $newPath = Join-Path $tokensDir $newName
        
        if ($oldName -ne $newName) {
            if (Test-Path $newPath) {
                Write-Host "Skip $oldName -> $newName (target exists)" -ForegroundColor Yellow
            } else {
                Rename-Item -Path $file.FullName -NewName $newName
                Write-Host "Renamed: $oldName -> $newName" -ForegroundColor Green
                $renamedCount++
            }
        }
    }
    
    Write-Host ""
    Write-Host "Fix completed!" -ForegroundColor Green
    Write-Host "Successfully renamed: $renamedCount files" -ForegroundColor Green
    
    if ($renamedCount -gt 0) {
        Write-Host ""
        Write-Host "SVG file case issues fixed!" -ForegroundColor Green
        Write-Host "You can now run build command to test the fix" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "All file names are already correct" -ForegroundColor Cyan
    }
    
} catch {
    Write-Host "Error during fix: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}