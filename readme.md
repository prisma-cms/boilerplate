
*🙌 Sorry for my english...*

## Installation
 
### Base requirements
#### Linux server 
*i used ubuntu-18 on [digitalocean.com](https://m.do.co/c/b6a1f9d7298e)* (referral link) with 2GB tarif plan for $10/month

```shell
sudo apt update
sudo apt upgrade -y
```

Install common programs
```shell
sudo apt install -y mc git build-essential
```

<details>
  <summary>Create user</summary>

  ```shell
  # Create user (not required if you use another user)
  sudo useradd USERNAME -d /home/USERNAME -G sudo -s /bin/bash
  sudo mkdir /home/USERNAME
  cd /home/USERNAME

  # for bash hightlighting
  wget https://gist.githubusercontent.com/Fi1osof/2f8ea23f5411c5c7a0e0025f04941aee/raw/.bashrc 

  sudo chown USERNAME: /home/USERNAME -R

  # set password
  passwd USERNAME
  ```

</details>


### Install node-js and npm
```shell
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt-get install -y nodejs
```
Check node-js `node -v`


### Install yarn
```shell
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```
Check yarn `yarn -v`


### Install prisma
```shell
sudo npm i -g prisma npm-run-all nodemon pm2
```
Check prisma `prisma -v`

### Reset homedir permissions
```shell
sudo chown $(whoami): ~ -R
```

### Create /var/www if not exists
```shell
sudo mkdir /var/www
sudo chown $(whoami): /var/www -R
```

### Install @prisma-cms/boilerplate
```shell
cd /var/www
git clone https://github.com/prisma-cms/boilerplate
cd boilerplate
yarn --ignore-engines
```


## Deploy schema

There two variants to use:
<details>
  <summary>With Prisma Cloud</summary>
 
  Signup on [www.prisma.io/cloud/](https://www.prisma.io/cloud/)



  If you use Prisma Cloud, first you need signin. 
  Note: for authorize required browser able opened from commandline. If you want authorize on server which does not have X and can not run browser, you should install prisma localy on your own computer, run `prisma login` localy, then copy local file ~/.prisma/config.yml on target server. 

  Check you is logged in.
  ```
  prisma account
  ```
  If you loged in success, you can run `yarn deploy`.

</details>

<details>
  <summary>With Prisma local</summary>
 

  ## Install prisma local

  ### Install docker
  ```shell
  sudo apt-get install software-properties-common python-software-properties
  sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
  sudo apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'
  sudo apt-get update
  sudo apt-get install -y docker-engine
  ```
  Check docker installed
  `docker -v`

  ### Install docker-compose
  ```shell
  sudo curl -L https://github.com/docker/compose/releases/download/1.18.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
  ```
  Check docker-compose `docker-compose -v`

  ### Start prisma docker images
  *Note: before do this, you can edit src/server/schema/prisma/docker-compose.yml for change prisma port and password.*
  ```
  sudo docker-compose -f ./src/server/schema/prisma/docker-compose.yml up -d
  ```

  ### Start PhpMyAdmin (optionaly)
  ```
  sudo docker run -d --link prisma_mysql_1:db --network prisma_default -p 8080:80 phpmyadmin/phpmyadmin
  ```

</details>


### Deploy
```shell
# If you use Prisma Cloud, you'll get endpoint automatically, just run:
yarn deploy

# If you use Prisma local, you should specify endpoint by youself, for example:
endpoint=http://localhost:4466/my-project/my-stage yarn deploy
```
This command run four commands:
1. `yarn build-schema-prisma` - generate raw graphql schema (for backend)
2. `yarn deploy-schema` - deploy generated schema into prisma server. <br />
   If you deploy schema for update exists database and wont force deploy while prisma reject deleting data, you may use `yarn deploy-schema -f` OR `yarn deploy-force` (for run complete procedure).
3. `yarn get-schema -p prisma` - get schema from prisma server
4. `yarn build-schema-api` - generate API schema (for frontend)


## Run server API
```shell
APP_SECRET={MY_ULTRA_SECRET_KEY} endpoint={endpoint} yarn start-server
```
Current endpoint after deploy you may see by this command (look for uncommented endpoint):
```shell
cat src/server/schema/prisma/prisma.yml |grep endpoint
```

For example:
```shell
APP_SECRET=MY_SECRET endpoint=https://eu1.prisma.sh/username/prisma/dev yarn start-server-dev
```

Open http://localhost:4000 (or http://server_address:4000)

Here you may write graphql requests.


## Run frontend server
```shell
# start server on PORT 3000
yarn start

```

Open http://localhost:3000 

<details>
  <summary>Different starts</summary>

  ```shell
  # specify your own port
  PORT=3223 yarn start

  # or run on default web-port (admin permissions required)
  sudo PORT=80 yarn start

  # or run https (admin permissions required, used self-signed certificate)
  sudo HTTPS=true PORT=443 yarn start
  ```

</details>

## Build scripts and run Server-Side-Rendering server (SSR)

### Build scripts
```shell
PUBLIC_URL=/ yarn build
```

### Run SSR server
```shell
yarn start-ssr
```


 
 
## ToDo:
1. Write using nginx docs
2. Write server customization docs
3. Write frontend customization docs
4. Examples

## Support project
We are looking for sponsors.

Also you may support by paypal.com (send for info@modxclub.ru) or ETH [0x4c791666351Ec3b223acF96C9d9BE431679E5C04](https://etherscan.io/address/0x4c791666351Ec3b223acF96C9d9BE431679E5C04)