#!/bin/sh
path=$(cd $( dirname ${BASH_SOURCE[0]}) && pwd )/matchaWithData.sql;

cd /Applications/MAMP/Library/bin;

./mysql < $path --host=localhost -uroot -proot

echo "Database deployed!"



