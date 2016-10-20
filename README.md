# os-kong
Openshift - Kong API Gateway with PostgreSQL

# Development Notes

# OpenShift

export PG_PASSWORD=<UPDATE_CUSTOM_PASSWORD>

# Postgresql
./oc new-app --name=kong-database --env=POSTGRESQL_USER=kong,POSTGRESQL_PASSWORD=${PG_PASSWORD},POSTGRESQL_DATABASE=kong registry.access.redhat.com/rhscl/postgresql-94-rhel7
./oc delete all -l app=kong-database

# Kong
./oc new-app --name=kong --env=KONG_DATABASE_TYPE=postgres,KONG_PG_HOST='$(KONG_DATABASE_SERVICE_HOST)',KONG_PG_USER=kong,KONG_PG_PASSWORD=${PG_PASSWORD} https://github.com/rudijs/os-kong-pgsql.git
./oc delete all -l app=kong
