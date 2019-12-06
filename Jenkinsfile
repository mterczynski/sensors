pipeline {
  agent any

  environment {
    DESTINATION = "root@mterczynski.pl:/var/www/html/sensors"
  }

  stages {
    stage('Install') {
      steps {
        sh "yarn"
      }
    }

    stage('Build and Lint') {
      parallel {
        "Build": {
        // stage('Build') {
          // steps {
            sh "yarn build"
            archiveArtifacts artifacts: 'index.html'
            archiveArtifacts artifacts: 'bundle.js'
            archiveArtifacts artifacts: 'main.css'
            archiveArtifacts artifacts: 'package.json'
            archiveArtifacts artifacts: 'README.md'
            archiveArtifacts artifacts: 'js_modules/*'
        //   }
        // }
        }

        "TSLint": {
        // stage('TSLint') {
          // steps {
            sh "yarn lint:jenkins"
          // }
        // }
        }
      }
    }

    stage('Deploy') {
      steps {
        sshagent(credentials: ['global-key']) {
          sh '''
            scp index.html ${DESTINATION}
            scp bundle.js ${DESTINATION}
            scp main.css ${DESTINATION}
            scp package.json ${DESTINATION}
            scp README.md ${DESTINATION}
            scp -r js_modules ${DESTINATION}
            exit
          '''
        }
      }
    }
  }
}
