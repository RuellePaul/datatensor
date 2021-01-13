# Easyprojets


## Run locally :computer: 

### Stack 
- Backend: python 3.8
- Database: MongoDB
- Frontend: Node ^14.14.0, React.js ^17.0 https://nodejs.org/en/download/

Assuming you have everything installed, you must be able to use node and npm commands :

```bash
$ node -v
v13.10.1
$ npm -v
6.13.7
```

### Installation 

Paste these commands in your project folder. This will clone the project & install python and node dependencies

```bash
(venv) $ git clone https://github.com/RuellePaul/datatensor.git
(venv) $ cd datatensor
(venv) $ pip install --upgrade pip
(venv) $ pip install -r api/requirements.txt
(venv) $ cd ui
(venv) $ yarn add package.json
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
(venv) $ cd ui
(venv) $ yarn run development
```