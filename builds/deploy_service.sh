#!/bin/bash

environment=0
reset=0

printf "\n"

# Prompt version, environment, reset
read -p "⚙  Version : v_" version
version="v_${version}"

while [ "$environment" != "test" ] && [ "$environment" != "production" ]; do
  read -p "⚙  Environment (test | production) : " environment
done

while [ "$reset" != "yes" ] && [ "$reset" != "no" ]; do
  read -p "⚙  Reset database : (yes | no) : " reset
done

# Show deployment infos
printf "\n⚙  Deploying datatensor $version in $environment environment\n\n"; sleep 5s

# Cleaning or reset
if [ "$reset" = "yes" ]
then
  printf "⚙  Reset workspace...\n"; sleep 5s
  docker kill $(docker ps -q)
  docker rm $(docker ps -a -q)
  docker rmi $(docker images -a -q)
else
  printf "⚙  Cleaning workspace...\n";
  docker kill $(docker ps -a | grep -v "mongo" | cut -d ' ' -f1)
  docker rm $(docker ps -a | grep -v "mongo" | cut -d ' ' -f1)
  docker rmi $(docker images -a -q)
fi
docker volume prune -f
docker system prune -f
printf "\n⚙  Done !\n\n"

# Init env
export VERSION=$version
export ENVIRONMENT=$environment
source ./$environment/init_env.sh

# Deployment
SERVICES=api\ ux
docker-compose -f docker-compose.yml up --quiet --build -d --quiet db proxy
docker-compose pull --quiet $SERVICES
docker-compose up -d --quiet-pull $SERVICES

printf "\n⚙  Deployed datatensor $version in $environment environment !\n\n"