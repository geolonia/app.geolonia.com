#!/usr/bin/env bash

# "echo \"/*\n  Basic-Auth: $BASIC_AUTH_ID:$BASIC_AUTH_PASS\" > build/_headers
echo 'https://geolonia-app.netlify.com/* https://app.geolonia.com/:splat 301!' > build/_redirects
