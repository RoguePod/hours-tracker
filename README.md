# Hours Tracker

```
npm i -g firebase-tools
yarn install
gulp build --gulpfile semantic/gulpfile.js
yarn start
```

### Semantic UI

The semantic-ui package has issues installing through yarn, outlined here: https://github.com/yarnpkg/yarn/issues/976.  To get this to work do the usual: `yarn upgrade`, and cancel it when it freezes.   Then run `npm install semantic-ui`, and follow the dialogs.  Then do another `yarn upgrade`, and it should complete.

##### Semantic UI Changes

Any changes to semantic ui variables will require a rebuild compile of semantic ui, via the `gulp build --gulpfile semantic/gulpfile.js` command.

## Firebase

### Setup Development Environment

1. Visit: [https://console.firebase.google.com](https://console.firebase.google.com) and hit `Add Project`, enter a name and click `Create Project`.
2. Click the `cog` next to `Project Overview`, and click `Project Settings`.  Under the `Your apps` section, click the `Add Firebase to your web app` button.  This will show a popup, ignore the actual code that is shown, all we care about is the values you need to add to your `.env` file.  View the `.env.example` file to see what values you need for your `.env` file.
3. Now you need to login to the firebase console on your local machine.  Visit: [https://github.com/firebase/firebase-tools](https://github.com/firebase/firebase-tools) to get instructions on how to install the firebase console.
4. Run `firebase login` to connect your firebase account to your local machine.  Aftewards, running `firebase list` should list all the firebase projects you are connected to, including the new project you just created.  `firebase use new-project-id` will actually connect you to that project locally.
5. Now click the `Databases` section in the firebase console website.  Make sure that `Firestore` database is active/enabled.  By default have it in `test` mode, not `locked` mode.
6. Next you should compile the `Cloud Functions`.  To do so, run this: `cd functions && yarn start`.
6.  Now we need to deploy the `Cloud Functions`, `Rules` and `Indexes`.  Run: `yarn run setup`.  This will deploy everything but the hosting, which is all we need for development.
7. Next visit the `Authentication` section in the firebase console website.  Click the `Sign-In Method` table and enable the `Email/Password` sign-in method.  Now click the `Users` tab and `Add User`.  This new user will default to the `User` role, if an admin user is desired, just change the record's role to `Admin` from the web console.
8. Finally, just run `yarn start`, and login with your newly created user, and that should do it.

### Development

```
yarn start
```

### Staging Deploy

```
firebase use firebase-project-id && yarn run deploy:staging
```

### Production Deploy

```
firebase use firebase-project-id && yarn run deploy:production
```
