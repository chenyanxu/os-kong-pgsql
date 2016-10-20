# os-kong
Openshift - Kong API Gateway with PostgreSQL

# Development Notes

docker run -it --rm --name kong --add-host "kong-database.api-factory-asia-qa.svc.cluster.local:192.168.33.100" -p 8001:8001 -p 8000:8000 ags/kong-api-gateway:1.0.0 bash

# OpenShift

# Postgresql
./oc new-app -e POSTGRESQL_USER=kong -e POSTGRESQL_PASSWORD=4nVWvpgxh0KImqBD -e POSTGRESQL_DATABASE=kong registry.access.redhat.com/rhscl/postgresql-94-rhel7

env:
-
name: POSTGRESQL_DATABASE
value: kong
-
name: POSTGRESQL_PASSWORD
value: 4nVWvpgxh0KImqBD
-
name: POSTGRESQL_USER
value: kong

# Kong
./oc new-app --name=os-kong -e KONG_DATABASE_TYPE=postgres,KONG_PG_HOST=$(POSTGRESQL_94_RHEL7_SERVICE_HOST),KONG_PG_USER=kong,KONG_PG_PASSWORD=4nVWvpgxh0KImqBD https://github.com/rudijs/os-kong-pgsql.git

env:
-
name: KONG_DATABASE_TYPE
value: postgres
-
name: KONG_PG_HOST
value: $(POSTGRESQL_94_RHEL7_SERVICE_HOST)
-
name: KONG_PG_USER
value: kong
-
name: KONG_PG_PASSWORD
value: 4nVWvpgxh0KImqBD
