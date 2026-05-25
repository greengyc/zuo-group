@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\publish-to-github.ps1" %*
