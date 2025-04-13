# Setup Local Automation by Git Hooks
setup-git-hooks:
	cp -r .githooks/* .git/hooks/
	chmod +x .git/hooks/pre-commit && chmod +x .git/hooks/pre-push && chmod +x .git/hooks/prepare-commit-msg

# Setup Local project
setup-localhost:
	npm i

# Setup Web Unit Tests
setup-web-testing:
	cp .env.testing.example .env.testing

# Setup Mobile Unit Tests
setup-mobile-testing:
	cp .env.testing.example .env.testing

# Run Web Unit Tests
web-tests:
	npm test

# Run Web Unit Tests & profile
php-tests-profile:
	npm test --profile

# Generate Web Unit Tests Coverage Report
php-tests-report:
	npm test --parallel --recreate-databases --coverage-html reports/coverage --coverage-clover reports/coverage.xml

# Generate Front-end Build
build-mix:
	npm run production

# Lint recent changes
lint-changes:
	npm pint --dirty

# Lint full project
lint-project:
	npm lint