
| Sommaire  |      [À propos](#about)       |  [Installation](#install) | [Utilisation](#use) | [Programmation](#dev) | [Licence](#licenses) |
|:---------:|:-----------------------------:|:--------------------------:|:--------------------------:|:-----------------------------:|:---------------------:|

## À propos de CRM Tools <a id="Container"></a>

CRM ou Etude & Conception et developpement d'une application de gestion des relations client.L'application est sous la forme d'une single-page propulsée en React JS et alimenté par un back-end Laravel 11(PHP).


## Prérequis
- Minimun PHP 8.1

#### Build les dépendances back-end (php)
Depuis le host (local ou prod) `~/Your-www-project-folder`:
```bash
cd ~/Your-www-project-folder/projetDeStage
cp .env.example .env
composer install
```

#### Build les dépendances front-end (assets et VueJS)
Depuis le host (local) `~/Your-www-project-folder/projetDeStage`:
```bash
cd ~/your-www-project-folder/projetDeStage
rm package-lock.json && rm -rf nodes_modules
npm install
```

#### Lancement du projet
Lancer le server back-end:
```bash
cd ~/your-www-project-folder/projetDeStage:
php artisan serve
```
Lancer l'affichage front-end en mode developpement:
```bash
cd ~/your-www-project-folder/projetDeStage:
npm run dev
```
