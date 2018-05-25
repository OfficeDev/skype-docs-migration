$regPath = "registry::hkcu\Software\Classes\Local Settings\Software\Microsoft\Windows\CurrentVersion\AppContainer\Storage\microsoft.microsoftedge_8wekyb3d8bbwe\MicrosoftEdge\ORTC"

if (!(Test-Path $regPath)) {
    New-Item -Path $regPath -Force | Out-Null
}

$reg = Get-Item -Path $regPath
if (!$([bool]($reg.PSObject.Properties.Value -match "EnableOrtcEngineTracing"))) {
    New-ItemProperty -Path $regPath -Name "EnableOrtcEngineTracing" -PropertyType DWORD -Value 1
    Write-Output "ORTC media logging enabled."
} else {
    Set-ItemProperty -Path $regPath -Name "EnableOrtcEngineTracing" -Value 1
    Write-Output "ORTC media logging re-enabled"
}