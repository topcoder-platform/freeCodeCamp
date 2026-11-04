// Application releases move to the repository-bound CircleCI OIDC workflow.
// Disable this Jenkins job and remove its Auth0/static AWS credential bindings.
pipeline {
    agent none
    stages {
        stage('Legacy deployment disabled') {
            steps {
                error('Broker deployment is disabled. Review deploy/MIGRATION.md and use CircleCI after its infrastructure prerequisites are installed.')
            }
        }
    }
}
