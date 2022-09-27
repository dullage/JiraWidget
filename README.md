![Version](https://img.shields.io/github/package-json/v/dullage/JiraWidget.svg)

# JiraWidget

A simple desktop widget for displaying Jira issue counts. Integrates with Jira Server and Jira Cloud.

![Screenshot](docs/screenshot.png)

The example above shows 2 configured counts but you can configure as many as you'd like.

## Notes / Features

* The counts are refreshed once per minute.
* Clicking on a label/count will open a Jira search (in the default browser) listing the issues.
* The widget will always stay on top of other windows.
* By default labels with a 0 count will be shown but they can be optionally hidden with `"hideWhenZero": true`.
* As labels are shown/hidden the app will resize. By default this will be anchored to the top left of the app but this can be changed with `anchorBottom` and `anchorRight`.
* `username` and `password` are optional and may be omitted if target issues are publicly accessible.
* When using Jira Cloud, you'll need to generate an API token and use that as the password.

## Installation

### Windows

Navigate to the [Releases](https://github.com/Dullage/JiraWidget/releases) area of this repo to download the latest executable.

## Configuration

In the same directory as "JiraWidget.exe" add a file called "config.json". Open this file and paste in the template below changing the values as required:

```json
{
  "jiraBaseUrl": "https://your.jira.instance",
  "username": "john.smith@example.com",
  "password": "yourPassword!",
  "anchorBottom": true,
  "anchorRight": true,
  "labels": [
    {
      "name": "TO DO",
      "jql": "assignee = 'adamd' and status = 'To Do'",
      "hideWhenZero": false
    },
    {
      "name": "IN PROGRESS",
      "jql": "assignee = 'adamd' and status = 'In Progress'",
      "hideWhenZero": true
    },
    {
      "name": "DONE",
      "jql": "assignee = 'adamd' and status = 'Done'",
      "hideWhenZero": false
    }
  ]
}
```
