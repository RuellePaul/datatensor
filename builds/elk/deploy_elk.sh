#!/bin/bash
# Specify environment and a service to deploy

environment=0
service=0

while [ "$environment" != "recette" ] && [ "$environment" != "preproduction" ] && [ "$environment" != "production" ]; do
  read -p "Which ENVIRONMENT are you deploying in ? " environment
done
while [ "$service" != "all" ] && [ "$service" != "filebeat" ] && [ "$service" != "logstash" ]; do
  read -p "Which ELK SERVICE do you want to deploy ? " service
done
if [ "$service" = "all" ]
then
  service=filebeat\ logstash
fi

printf "\n⚙  Deploying ELK in $environment environment...\n\n"

export VERSION=$version
export ENVIRONMENT=$environment
source ./$environment/init_env.sh

printf "\n⚙  Cleaning workspace...\n\n"
docker rmi $(docker images -a -q)
docker volume prune -f
docker system prune -f
printf "\n⚙  Workspace cleaned !\n\n"

docker-compose up -d --build $service

printf "\n⚙  Deployed ELK services !\n\n"


printf "\n⚙  Cleaning workspace...\n\n"
docker rmi $(docker images -a -q)
docker volume prune -f
docker system prune -f
printf "\n⚙  Workspace cleaned !\n\n"
