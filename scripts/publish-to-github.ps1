param(
  [string]$Message = "Update website",
  [string[]]$Paths = @()
)

$ErrorActionPreference = "Stop"

$Repo = "zuozhijun1502/zuo-group"
$Branch = "main"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

function Get-GitHubToken {
  if ($env:GITHUB_TOKEN) {
    return $env:GITHUB_TOKEN
  }

  $credentialInput = "protocol=https`nhost=github.com`n`n"
  $credential = $credentialInput | git credential fill
  $token = ($credential | Where-Object { $_ -like "password=*" }) -replace "^password=", ""

  if (-not $token) {
    throw "No saved GitHub credential was found. Sign in to GitHub once in this Windows account, then run this command again."
  }

  return $token
}

function Get-RelativePath($Path) {
  $fullPath = (Resolve-Path $Path).Path
  return $fullPath.Substring($Root.Length + 1).Replace("\", "/")
}

function Get-PublishFiles {
  if ($Paths.Count -gt 0) {
    return $Paths | ForEach-Object { Get-RelativePath $_ }
  }

  Get-ChildItem -Path $Root -Recurse -File |
    Where-Object {
      $relativePath = $_.FullName.Substring($Root.Length + 1).Replace("\", "/")
      $relativePath -notmatch "^(\\.git|\\.github)/" -and
      $relativePath -notmatch "^Zuo-Group-website-user-manual\\.docx$" -and
      $relativePath -notmatch "^FRIEND-USER-MANUAL-zh\\.md$" -and
      $relativePath -notmatch "^GITHUB-PAGES-ADMIN-GUIDE-zh\\.md$" -and
      $relativePath -notmatch "^ADMIN-GUIDE\\.md$" -and
      $relativePath -notmatch "^MAINTENANCE\\.md$" -and
      $relativePath -notmatch "^README\\.md$"
    } |
    ForEach-Object { $_.FullName.Substring($Root.Length + 1).Replace("\", "/") }
}

$token = Get-GitHubToken
$headers = @{
  Authorization = "Bearer $token"
  Accept = "application/vnd.github+json"
  "X-GitHub-Api-Version" = "2022-11-28"
  "User-Agent" = "ZuoGroupPublisher"
}

$files = Get-PublishFiles
if (-not $files -or $files.Count -eq 0) {
  Write-Host "No files to publish."
  exit 0
}

$published = New-Object System.Collections.Generic.List[string]

foreach ($path in $files) {
  $localPath = Join-Path $Root ($path -replace "/", "\")
  $bytes = [System.IO.File]::ReadAllBytes($localPath)
  $content = [Convert]::ToBase64String($bytes)
  $encodedPath = ($path -split "/" | ForEach-Object { [System.Uri]::EscapeDataString($_) }) -join "/"
  $url = "https://api.github.com/repos/$Repo/contents/$encodedPath"

  $sha = $null
  try {
    $remote = Invoke-RestMethod -Uri "$url`?ref=$Branch" -Headers $headers
    $sha = $remote.sha
    $remoteBytes = [Convert]::FromBase64String(($remote.content -replace "\s", ""))
    if ([Convert]::ToBase64String($remoteBytes) -eq $content) {
      continue
    }
  } catch {
    if ($_.Exception.Response.StatusCode.value__ -ne 404) {
      throw
    }
  }

  $body = @{
    message = $Message
    content = $content
    branch = $Branch
  }
  if ($sha) {
    $body.sha = $sha
  }

  $bodyJson = $body | ConvertTo-Json -Compress
  Invoke-RestMethod -Method Put -Uri $url -Headers $headers -Body $bodyJson -ContentType "application/json" | Out-Null
  $published.Add($path)
}

if ($published.Count -eq 0) {
  Write-Host "Everything is already up to date."
} else {
  Write-Host "Published $($published.Count) file(s) to https://github.com/$Repo"
  $published | ForEach-Object { Write-Host " - $_" }
}
