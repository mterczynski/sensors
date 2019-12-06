pipeline {
  agent any

  stages {
    stage('Install') {
      steps {
        sh "yarn"
      }
    }

    stage('Build') {
      steps {
        sh "yarn build"
        archiveArtifacts artifacts: 'index.html'
        archiveArtifacts artifacts: 'bundle.js'
        archiveArtifacts artifacts: 'main.css'
        archiveArtifacts artifacts: 'package.json'
        archiveArtifacts artifacts: 'README.md'
      }
    }

    stage('Deploy') {
      steps {
        sshagent(credentials: ['global-key']) {
          sh '''
            ssh -tt root@mterczynski.pl
          '''
        }
      }
    }
  }
}
