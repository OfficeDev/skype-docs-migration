$redirectFilePath = "Skype_MsdnToDocs-Redirections.csv"
$redirects = Import-Csv -Path $redirectFilePath

$startIndex = "https://msdn.microsoft.com/en-us/skype/".Length

$redirectRules = $redirects | % {
  $sourcePath = "SkypeSDK-ops-redirect/" + $_.Source.SubString($startIndex) + ".md"
  New-Object PSObject -Property @{
    source_path = $sourcePath; redirect_url = $_.Target
  }
}

$redirectObj = New-Object PSObject -Property @{
  redirections = $redirectRules
}

ConvertTo-Json $redirectObj | Set-Content ".openpublishing.redirection.json"
