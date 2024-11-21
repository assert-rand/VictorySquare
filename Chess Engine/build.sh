#!/bin/bash
rm -r build
cmake -S . -B build
cmake --build build

echo $1

if [ $1="test" ]
then
    echo "Running Tests"
    cd build && ctest
else
    echo "Running Tests and Main:"
    cd build
    ctest
    cd engine
    ./engine
fi