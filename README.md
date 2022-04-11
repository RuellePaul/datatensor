# Datatensor

## Run locally :computer: 

### Stack 
- Backend: python 3.8
- Database: MongoDB
- Frontend: Node ^14.14.0 https://nodejs.org/en/download/

Assuming you have everything installed, you must be able to use node and npm commands :

```bash
$ node -v
$ npm -v
```

### Installation 

Paste these commands in your project folder. This will clone the project & install python and node dependencies

```bash
(venv) $ git clone https://github.com/RuellePaul/datatensor.git
(venv) $ cd datatensor
(venv) $ pip install --upgrade pip
(venv) $ pip install -r api/requirements.txt
(venv) $ brew install rabbitmq
(venv) $ brew services rabbitmq start
(venv) $ cd ux
(venv) $ yarn
```

### Run

#### Locally

Set environment variable in `/development/init_env.sh`

**Backend**

Run FastAPI backend using :

```bash
(venv) $ python api/app.py
```

**Front end**

Run React front-end using :

```bash
(venv) $ cd ux
(venv) $ yarn run development
```

**Worker**

Run Rabbit MQ server using :

```bash
(venv) $ cd api
(venv) $ celery -A worker worker --loglevel=INFO
```

```bash
(venv) $ cd api
(venv) $ celery -A worker worker --loglevel=INFO
```

<br/>

#### With docker 

_MacOS Procedure_

Install docker using :

```bash
brew install --cask docker
```

Launch Docker Desktop, and run docker deamon.


## Deployment :bow_and_arrow:

_This section show deployment for `test` env, but the same apply for other envs._

On PyCharm terminal, push a new tag :

```bash
(venv) $ git tag v_0.0.1
(venv) $ git push origin v_0.0.1
```


On AWS, search for `DTProduction` instance, or rebuild it using DTProduction instance model.

Then, login using SSH to this instance using `DTProductionLogin.sh` script :

```bash
(venv) $ cd builds/production
(venv) $ source DTProductionLogin.sh
```

⚠️&nbsp;&nbsp;You must have `DTProductionKeys.pem` in `builds/production`.

Next, on the machine, install `git`, `docker` and `docker-compose` :

```bash
sudo -i
apt install docker.io
apt install docker-compose
```

Then, use login to Github Packages :

```bash
cat ./github_token.txt | docker login https://docker.pkg.github.com -u <username> --password-stdin
```

⚠️&nbsp;&nbsp;`<username>` must be authorized to collaborate on Datatensor github project, and you must have a `github_token.txt` *with repo, workflow and packages* enabled. 
Retrieve it from github here : https://github.com/settings/tokens/new

You can now clone the project :

```bash
git clone https://github.com/RuellePaul/datatensor.git
cd datatensor
```

If prompted, login with `<username>` and your github token as password.

Fill the env with secret keys (copy from local) :

```bash
cd ~/datatensor/builds/production
nano init_env.sh
```

Add the `deploy.sh` script :

```bash
cd ~/datatensor
nano deploy.sh
```

### Renew certificates for all domain/subdomains 


- In all `conf.d/<domain>.conf` files, comment the line :

```bash
# return 301 https://$server_name$request_uri;
```

Then deploy `proxy`

- Run certbot :

```bash
apt install certbot
certbot certonly --dry-run
```

Select option :
```
2: Place files in webroot directory (webroot)
```

Please enter in your domain name(s): 
```bash
datatensor.io www.datatensor.io api.datatensor.io kibana.datatensor.io
```

Input the `webroot`:
```bash
/var/www/letsencrypt
```

If the dry run is successful, run in `/etc/letsencrypt`

```bash
rm -rfd archive
mkdir archive
rm -rfd live
mkdir live
```
then run the same as above without `--dry-run` argument.

- Rename generated certs directory in `/etc/letsencrypt/live` :
```bash
mv datatensor.io-0004/ datatensor.io
```
- Replace the line in all `conf.d/<domain>.conf`:
```
return 301 https://$server_name$request_uri;
```

and re-deploy `proxy` service

### Deploy ELK

Hydrate `~/datatensor/builds/production/elk/.env` with production values.

Deploy filebeat :

```
cd ~/datatensor/builds
docker-compose up -d filebeat
```

Deploy elasticsearch and kibana :

```
cd ~/datatensor/builds/production/elk
docker-compose up -d elasticsearch kibana
```

In `certs` docker volume, copy/paste `ca.crt` certificate in path `~/datatensor/builds/production/elk`, then deploy logstash :

```
cd ~/datatensor/builds/production/elk
docker-compose up -d logstash
```

Kibana is visible at URL `https://kibana.datatensor.io`