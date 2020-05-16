pipeline {
    agent none
    stages {
        stage('Build') {
            agent {
                dockerfile {
                    label 'amd64'
                    dir '.jenkins'
                }
            }
            steps {
                sh 'npm ci'
                sh 'npm run package-win'
                sh 'cd $WORKSPACE/builds/JiraWidget-win32-ia32 && zip -r JiraWidget.zip .'
                stash name: 'build', includes: 'JiraWidget.zip'
            }
        }
    }
}