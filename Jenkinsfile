pipeline {
    agent {
        dockerfile {
            label 'amd64'
            dir '.jenkins'
        }
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm ci'
                sh 'npm run package-win'
                sh 'cd $WORKSPACE/builds/JiraWidget-win32-ia32 && zip -r JiraWidget.zip .'
                stash name: 'JiraWidgetZip', includes: 'builds/JiraWidget-win32-ia32/JiraWidget.zip'
            }
        }
        stage('Release') {
            when { branch 'master' }
            environment {
                GIT_REPO_SLUG = 'Dullage/JiraWidget'
                GITHUB_TOKEN = credentials('github_token')
            }
            steps {
                unstash 'JiraWidgetZip'
                sh 'bash $WORKSPACE/.jenkins/release.sh'
            }
        }
    }
}
