param (
    [switch]$Online = $false
)

Set-StrictMode -Version Latest
Write-Host "Processing Samples"

$path = (Resolve-Path (Join-Path $PSScriptRoot ..\samples))

class Sample
{
    [string]$name
    [string]$location
}

class Category
{
    [string]$name
    [Sample[]]$items
    [boolean]$preview
}

class Config
{
    [Category[]]$categories
}

function isPresent([string]$target, [string]$local_path)
{
    if (Test-Path (Join-Path $local_path ("\{0}" -f $target)))
    {
        return $true;
    }
    return $false;
}

function getSampleOrder([string]$target, [string]$local_path)
{
    $sampleOrderPath = (Join-Path $local_path ("\{0}" -f $target))
    if (Test-Path $sampleOrderPath)
    {
        return (Get-Content $sampleOrderPath)
    }
    Write-Host ''
    Write-Host '***ALERT***' $local_path 'is NOT added to config.json. Add an order flag if you wish to include this Sample for deploying.'
    Write-Host ''
    return -1
}

$config = [Config]::new()
$dir_categories = Get-ChildItem -Path $path -Directory
$categories = [System.Collections.ArrayList]::new()

#initialize categories array with the length of the sample
foreach($item in $dir_categories)
{
    #add dummy data to be overwritten later with the correct ordering of samples 
    $categories.Add(-1) | Out-Null
}

#parse each top-level folder as it's a category of samples
foreach($item in $dir_categories)
{
    $category = [Category]::new()
    $samples = [System.Collections.ArrayList]::new()
    $tempSamples = [System.Collections.ArrayList]::new()

    #each directory under the top-level is a new samples for that category
    #initialize samples array with the length of the category
    foreach($dir in $item.GetDirectories())
    {
        $tempSamples.Add(-1) | Out-Null
    }
    foreach($dir in $item.GetDirectories())
    {
        $sample = [Sample]::new();
        $sample.name = $dir.Name
        $sample.location = $dir.FullName.Replace($path, "samples").Replace("\", "/")
        $sampleOrder = (getSampleOrder -target "order" -local_path $dir.FullName)
        if ($sampleOrder -ne -1)
        {
            $tempSamples[$sampleOrder] = $sample
        }
    }

    #strip of the unused samples to form the current samples collection
    foreach($tempSample in $tempSamples)
    {
        if($tempSample -ne -1) {
            $samples.Add($tempSample) | Out-Null
        }
    }

    #if the category is not empty we want to add it to the temporary configuration
    if ($samples.Count -ne 0)
    {
        $category.name = $item.Name
        $category.items = $samples
        $category.preview = (isPresent -target "preview" -local_path $item.FullName)
        $sampleOrder = (getSampleOrder -target "order" -local_path $item.FullName)
        if ($sampleOrder -ne -1) {
            $categories[$sampleOrder] = $category
        }
    }
}

#strip of the unused elements to form the final samples collection
$final_categories = [System.Collections.ArrayList]::new()
foreach($category in $categories)
{
    if($category -ne -1) {
        $final_categories.Add($category) | Out-Null
    }
}
$config.categories = $final_categories

if ($Online)
{
    $js =@"
var location_config = {
    content: '/Content/websdk/'
};
"@
    $js | Out-File (Join-Path $path \location_config.js)
    ConvertTo-Json $config -Depth 5 -Compress | Out-File -Encoding UTF8 (Join-Path $path \config.json)
}
else
{
        $js =@"
var location_config = {
    content: '/'
};
"@
    $js | Out-File (Join-Path $path \location_config.js)
    ConvertTo-Json $config -Depth 5 | Out-File -Encoding UTF8 (Join-Path $path \config.json)
}

Write-Host "Finished Processing Samples"