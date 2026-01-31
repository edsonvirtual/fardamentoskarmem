@echo off
:: Este script inicia o servidor Node.js e abre o sistema no Chrome de forma automática.
:: Guarde este ficheiro na mesma pasta do seu projeto.

echo Ligando o servidor PostgreSQL...
start /min cmd /c "node server.js"

echo Abrindo a interface Karmem Fardamentos...
timeout /t 2 /nobreak > nul
start "" "index.html"

exit