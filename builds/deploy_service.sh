#!/bin/bash
# Specify version, environment and a service to deploy

environment=0
service=0

read -p "Which image VERSION do you want to deploy ? " version
while [ "$environment" != "sandbox" ] && [ "$environment" != "recette" ] && [ "$environment" != "preproduction" ] && [ "$environment" != "production" ]; do
  read -p "Which ENVIRONMENT are you deploying in ? " environment
done
while [ "$service" != "all" ] && [ "$service" != "api" ] && [ "$service" != "ui" ]&& [ "$service" != "db" ]; do
  read -p "Which SERVICE do you want to deploy ? " service
done
if [ "$service" = "all" ]
then
  service=api\ ui
fi



export VERSION=$version
export ENVIRONMENT=$environment
source ./$environment/init_env.sh
# Additional deployments for sanbdox env (needs DB & proxy)
if [ "$environment" = "sandbox" ]
then
  docker-compose -f sandbox/docker-compose.yml up --build -d db proxy
fi

printf "\n\n ***** cleaning workspace from n-2 images... ***** \n"
docker rmi $(docker images -a -q)
docker volume prune -f
docker system prune -f
printf "\n ***** workspace cleaned ! ***** \n\n"

docker-compose pull $service
docker-compose up -d $service