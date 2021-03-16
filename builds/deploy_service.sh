#!/bin/bash
# Specify version, environment and a service to deploy

environment=0
service=0

read -p "Which image VERSION do you want to deploy ? " version
while [ "$environment" != "test" ] && [ "$environment" != "recette" ] && [ "$environment" != "preproduction" ] && [ "$environment" != "production" ]; do
  read -p "Which ENVIRONMENT are you deploying in ? " environment
done
while [ "$service" != "all" ] && [ "$service" != "api" ] && [ "$service" != "ux" ]&& [ "$service" != "db" ]; do
  read -p "Which SERVICE do you want to deploy ? " service
done
if [ "$service" = "all" ]
then
  service=api\ ux
fi


export VERSION=$version
export ENVIRONMENT=$environment
source ./$environment/init_env.sh

printf "\n\n* Cleaning workspace *\n"
docker kill $(docker ps -q)
docker rm $(docker ps -a -q)
docker rmi $(docker images -a -q)
docker volume prune -f
docker system prune -f
printf "* Done ! *\n\n"

# Additional deployments for test env (needs DB & proxy)
if [ "$environment" = "test" ]
then
  docker-compose -f test/docker-compose.yml up --build -d db proxy
fi

docker-compose pull $service
docker-compose up -d $service