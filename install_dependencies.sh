#!/bin/bash

# Find and run npm install in directories containing package.json
for dir in lambda_layers/*/nodejs; do
    if [[ -f "$dir/package.json" ]]; then
        echo "Installing dependencies in $dir"
        (cd "$dir" && npm install)
    else
        echo "No package.json found in $dir"
    fi
done