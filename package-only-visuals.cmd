@echo off

setlocal


call :PackageVisual "ZoomChartsFacetChartPaid", "Facet"
if %errorlevel% neq 0 goto eof

call :PackageVisual "ZoomChartsGraphChartPaid", "Graph"
if %errorlevel% neq 0 goto eof

call :PackageVisual "ZoomChartsNetChartPaid", "Net"
if %errorlevel% neq 0 goto eof

call :PackageVisual "ZoomChartsPieChartPaid", "Pie"
if %errorlevel% neq 0 goto eof

call :PackageVisual "ZoomChartsTimeChartPaid", "Time"
if %errorlevel% neq 0 goto eof


goto eof

:PackageVisual

cd %~1
echo [package %~2 chart]
call pbiviz package
cd ..
EXIT /B 0


:eof
