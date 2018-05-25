# copies Edge media logs to a specified location

[CmdletBinding()]
Param(
    # Final component of name for folder where logs will be copied
    [Parameter(Mandatory=$True)]
    [string]$issueDescription,

    # Another component of name for folder where logs will be copied
    [Parameter(Mandatory=$True)]
    [string]$organizationName
)

$loc = Get-Location

Set-Location $ENV:LOCALAPPDATA\Packages\Microsoft.MicrosoftEdge_8wekyb3d8bbwe\

# Find most recent log of each of 2 types
$items = Get-ChildItem -Filter OrtcEngine_MediaStack-*.etl -Recurse
$latestLog1 = $items[0]
$items | ForEach-Object {
    if ($_.LastWriteTime -gt $latestLog1.LastWriteTime) {
        $latestLog1 = $_
    }
}

$items = Get-ChildItem -Filter OrtcEngine_MediaStackETW-*.etl -Recurse
$latestLog2 = $items[0]
$items | ForEach-Object {
    if ($_.LastWriteTime -gt $latestLog2.LastWriteTime) {
        $latestLog2 = $_
    }
}

$date = Get-Date 
$logFormat = "{0}-{1}-{2}-{3}-{4:D2}{5:D2}-{6}\"
$logDir = $logFormat -f $ENV:USERNAME, $ENV:COMPUTERNAME, $organizationName, $date.Year, $date.Month, $date.Day, $issueDescription

$destPath = "$ENV:HOMEDRIVE\$ENV:HOMEPATH\"
if (!(Test-Path $destPath$logDir)) {
    mkdir $destPath$logDir | Out-Null
}

$log1Name = "$destPath$logDir$latestLog1"
$log2Name = "$destPath$logDir$latestLog2"

Copy-Item $latestLog1.FullName -Destination $log1Name
Copy-Item $latestLog2.FullName -Destination $log2Name

Write-Output "Copied logs to the following locations: ",$log1Name,$log2Name

Start "$destPath$logDir"

Set-Location $loc