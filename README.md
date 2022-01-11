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

Generate certificates for all domain/subdomains :
⚠️&nbsp;&nbsp; You must authorize all trafic in DTProduction security group

```bash
apt install certbot
certbot certonly
```

How would you like to authenticate with the ACME CA?
1: Spin up a temporary webserver (standalone)
2: Place files in webroot directory (webroot)
```bash
2
```
Please enter in your domain name(s): 
```bash
datatensor.io www.datatensor.io
```
Input the webroot:
```bash
/var/www/letsencrypt
```

Do the same for domains api.datatensor.io app.datatensor.io docs.datatensor.io

Finally, deploy your tag :

```
cd ~/datatensor
source deploy.sh
>>> dev
>>> v_0.0.1
>>> all
>>> no
```

