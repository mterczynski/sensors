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
      }
    }
  }
}
