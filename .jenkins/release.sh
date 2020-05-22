#!/bin/bash

set -e

asset=$WORKSPACE/builds/JiraWidget-win32-ia32/JiraWidget.zip
asset_name=JiraWidget.zip
tag=v$(cat $WORKSPACE/package.json | jq -r ".version")

printf "Creating Release...\n"
response=$(\
  curl -fsS \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"tag_name\": \"$tag\", \"target_commitish\": \"master\", \"name\": \"$tag\"}" \
    https://api.github.com/repos/$GIT_REPO_SLUG/releases \
)

upload_url=$(echo $response | jq -r ".upload_url")
upload_url="${upload_url%\{*}"

printf "Uploading Asset...\n"
curl -fsS -o /dev/null \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Content-Type: $(file -b --mime-type $asset)" \
  --data-binary @$asset \
  $upload_url?name=$asset_name
