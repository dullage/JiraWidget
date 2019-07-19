![Version](https://img.shields.io/github/package-json/v/dullage/JiraWidget.svg)
![Dependencies](https://img.shields.io/david/dullage/JiraWidget.svg)

# JiraWidget

A simple desktop widget for displaying Jira issue counts. Integrates with Jira Server.

![Screenshot](docs/screenshot.png)

The example above shows 2 configured counts but you can configure as many as you'd like.

## Notes / Features

* The counts are refreshed once per minute.
* Clicking on a label/count will open a Jira search (in the default browser) listing the issues.
* The widget will always stay on top of other windows.
* The Jira instance must allow at least anonymous read only access. There is currently no option to configure credentials.
* Sometimes when the screen resolution changes the electron app resizes adding scrollbars. Focusing on the app and pressing the "r" key will reset the app to fit properly if this happens.

## Installation

### Windows

Navigate to the [Releases](https://github.com/Dullage/JiraWidget/releases) area of this repo to download the latest executable.

## Configuration

In the same directory as "JiraWidget.exe" add a file called "config.json". Open this file and paste in the template below changing the values as required:

```json
{
  "jiraBaseUrl": "https://your.jira.instance",
  "labels": [
    {
      "name": "TO DO",
      "jql": "assignee = 'adamd' and status = 'To Do'"
    }
  ]
}

```

*Note: You can add as many labels as you like just remember to separate them with a comma.*
