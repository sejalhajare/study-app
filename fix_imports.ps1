$srcRoot = "c:\Users\Sejal Hajare\OneDrive\Desktop\study app\src"
$files = Get-ChildItem -Recurse -Path $srcRoot -Include "*.ts","*.tsx"

foreach ($file in $files) {
    $fileDir = $file.DirectoryName
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Find all @/ imports in this file
    $matches = [regex]::Matches($content, "@/([^'""]+)")
    
    foreach ($match in $matches) {
        $importPath = $match.Groups[1].Value  # e.g. "lib/utils" or "store/authStore"
        
        # Compute relative path from file location to src root
        $targetPath = Join-Path $srcRoot $importPath
        $relativePath = [System.IO.Path]::GetRelativePath($fileDir, $targetPath)
        
        # Normalize to forward slashes
        $relativePath = $relativePath.Replace('\', '/')
        
        # Add ./ prefix if not already starting with ../
        if (-not $relativePath.StartsWith('..')) {
            $relativePath = "./$relativePath"
        }
        
        # Replace in content
        $content = $content.Replace("@/$importPath", $relativePath)
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline -Encoding UTF8
        Write-Host "Updated: $($file.Name)"
    }
}

Write-Host "Done!"
