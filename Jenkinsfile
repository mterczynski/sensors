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
        archiveArtifacts artifacts: 'js_modules/*'
      }
    }

    stage('Deploy') {
      steps {
        sshagent(credentials: ['global-key']) {
          sh '''
            scp index.html root@mterczynski.pl:/var/www/html/sensors
            scp bundle.js root@mterczynski.pl:/var/www/html/sensors
            scp main.css root@mterczynski.pl:/var/www/html/sensors
            scp package.json root@mterczynski.pl:/var/www/html/sensors
            scp README.md root@mterczynski.pl:/var/www/html/sensors
            scp -r js_modules root@mterczynski.pl:/var/www/html/sensors
            exit
          '''
        }
      }
    }
  }
}
