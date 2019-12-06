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
        archiveArtifacts artifacts: 'index.html', 'bundle.js', 'main.css', 'package.json', 'README.md'
      }
    }
  }
}
