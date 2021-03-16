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
(venv) $ cd ux
(venv) $ yarn
```

### Run

Set an environment variable `export ENVIRONMENT="development"`

**Backend**

Run the api using :

```bash
(venv) $ python api/app.py
```

**Front end**

```bash
(venv) $ cd ux
(venv) $ yarn run development
```

<br/>

## Deployment

_This section show deployment for `test` env, but the same apply for other envs._

On PyCharm terminal, push a new tag :

```bash
(venv) $ git tag v_0.0.1
(venv) $ git push origin v_0.0.1
```


On AWS, search for `DTServerTest` instance, or rebuild it using DTServerTest instance model.

Then, login using SSH to this instance using `DTServerTestLogin.sh` script :

```bash
(venv) $ cd builds/test
(venv) $ source DTServerTestLogin.sh
```

⚠️&nbsp;&nbsp;You must have `DTServerTestKeys.pem` in `builds/test`.

Next, on the machine, install `git`, `docker` and `docker-compose` :

```bash
sudo -i
yum install git
yum install docker
service docker start
sudo curl -L "https://github.com/docker/compose/releases/download/1.28.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo mv /usr/local/bin/docker-compose /usr/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

```

Then, use login to Github Packages :

```bash
cat ~/github_token.txt | docker login https://docker.pkg.github.com -u <username> --password-stdin
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
cd ~/datatensor/builds/test
nano init_env.sh
nano cert.pem
nano key.pem
```

Finally, deploy your tag :

```
cd ~/datatensor/builds
source deploy_service.sh
>>> v_0.0.1
>>> test
>>> all
```

