# Todo App

## Description

Cette application est une API de gestion de tâches développée en Node.js avec Express et Sequelize. Elle permet de créer, lire, mettre à jour et supprimer des tâches, ainsi que de gérer les types de tâches.

## Prérequis

- Node.js (version 14 ou supérieure)
- MySQL

## Installation

1. Clonez le dépôt :
   ```sh
   git clone <URL_DU_DEPOT>
   cd todo-app

2. Installez les dépendances :
   npm install

3. Configurer les variables d'environnement
   Creez votre fichier .env et créez les variables suivante:
     DB_USER='votre_utilisateur'
     DB_PASSWORD='votre_mot_de_passe'
     DB_NAME='votre_nom_de_BDD'
     DB_BIS_NAME='votre_nom_de_BDD_avec_ORM'

4. Démarez le serveur :
npm run start
