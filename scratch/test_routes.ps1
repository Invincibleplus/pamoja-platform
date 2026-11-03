$routes = @('/', '/profile', '/admin', '/labs', '/studio', '/practitioners', '/courses/course-emotive-pph')
foreach ($route in $routes) {
    try {
        $resp = Invoke-WebRequest -Uri ("http://localhost:3000" + $route) -UseBasicParsing
        Write-Host "$route => Status: $($resp.StatusCode)"
    } catch {
        Write-Host "$route => Error: $_"
    }
}
