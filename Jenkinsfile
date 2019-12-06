pipeline {
  agent any

  stages {
    stage('Install') {
      steps {
        bat "yarn"
      }
    }

    stage('Build') {
      steps {
        bat "yarn build"
        archiveArtifacts artifacts: 'index.html'
        archiveArtifacts artifacts: 'bundle.js'
        archiveArtifacts artifacts: 'main.css'
        archiveArtifacts artifacts: 'package.json'
        archiveArtifacts artifacts: 'README.md'
      }
    }
  }
}
