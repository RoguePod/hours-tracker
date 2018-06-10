import { call, select } from 'redux-saga/effects';

/* eslint-disable sort-imports */
import baseFirebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
/* eslint-enable sort-imports */

import _find from 'lodash/find';
import _isNil from 'lodash/isNil';
import _isString from 'lodash/isString';
import _sortBy from 'lodash/sortBy';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
};

export const cloudFunctionsUrl = process.env.FIREBASE_CLOUD_FUNCTIONS_URL;

baseFirebase.initializeApp(firebaseConfig);

export const env       = process.env.ENV;
export const firebase  = baseFirebase;

const baseFirestore = firebase.firestore();

baseFirestore.settings({ timestampsInSnapshots: true });

export const firestore = baseFirestore;

export const isBlank = (value) => {
  return _isNil(value) || (_isString(value) && value.length === 0);
};

export const toQuery = (params) => {
  const query = [];

  Object.keys(params).forEach((key) => {
    const value = params[key];

    if (!isBlank(value)) {
      query.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      );
    }
  });

  return query.join('&');
};

export const fromQuery = (query) => {
  const params = {};

  if (!query || query.length === 0) {
    return params;
  }

  let values = [];

  if (query.startsWith('?')) {
    values = query.substr(1).split('&');
  } else {
    values = query.split('&');
  }

  values.forEach((value) => {
    const param = value.split('=');

    params[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
  });

  return params;
};

/* Firebase specific functions */

export const add = (path, data) => {
  return new Promise((resolve, reject) => {
    firestore.collection(path).add(data)
      .then((docRef) => {
        resolve(docRef);
      })
      .catch((error) => {
        reject(error);
      });
  }).then(
    (response) => response,
    (error) => ({ error })
  );
};

export const getCollection = (path) => {
  return new Promise((resolve, reject) => {
    firestore.collection(path).get()
      .then((docRef) => {
        resolve(docRef);
      })
      .catch((error) => {
        reject(error);
      });
  }).then(
    (response) => response,
    (error) => ({ error })
  );
};

export const getRef = (ref) => {
  return new Promise((resolve, reject) => {
    ref.get()
      .then((docRef) => {
        resolve(docRef);
      })
      .catch((error) => {
        reject(error);
      });
  }).then(
    (response) => response,
    () => null
  );
};

export const getDoc = (path) => {
  return new Promise((resolve, reject) => {
    firestore.doc(path).get()
      .then((docRef) => {
        resolve(docRef);
      })
      .catch((error) => {
        reject(error);
      });
  }).then(
    (response) => response,
    (error) => ({ error })
  );
};

export const updateRef = (ref, params) => {
  return new Promise((resolve, reject) => {
    ref.update(params)
      .then(() => {
        resolve({});
      })
      .catch((error) => {
        reject(error);
      });
  }).then(
    (response) => response,
    (error) => ({ error })
  );
};

export const deleteDoc = (path) => {
  return new Promise((resolve, reject) => {
    firestore.doc(path).delete()
      .then(() => {
        resolve({});
      })
      .catch((error) => {
        reject(error);
      });
  }).then(
    (response) => response,
    (error) => ({ error })
  );
};

export const batchCommit = (batch) => {
  return new Promise((resolve, reject) => {
    batch.commit()
      .then(() => {
        resolve({});
      })
      .catch((error) => {
        reject(error);
      });
  }).then(
    (response) => response,
    (error) => ({ error })
  );
};

export function parseProject(snapshot) {
  return {
    ...snapshot.data(),
    id: snapshot.id,
    snapshot
  };
}

export function* parseClient(snapshot) {
  const projectSnapshots = yield call(
    getCollection, `clients/${snapshot.id}/projects`
  );

  const projects = [];

  for (const projectSnapshot of projectSnapshots.docs) {
    projects.push(parseProject(projectSnapshot));
  }

  return {
    ...snapshot.data(),
    id: snapshot.id,
    projects: _sortBy(projects, 'name'),
    snapshot
  };
}

export function* parseEntry(snapshot) {
  const data = snapshot.data();

  const { appUser, clients, users } = yield select((state) => {
    return {
      appUser: state.app.user,
      clients: state.clients.clients,
      users: state.users.users
    };
  });

  let client = null;

  if (data.clientRef) {
    client = _find(clients, (eClient) => eClient.id === data.clientRef.id);
  }

  let project = null;

  if (client && data.projectRef) {
    project = _find(
      client.projects, (eProject) => eProject.id === data.projectRef.id
    );
  }

  let user = null;

  if (data.userRef) {
    if (appUser.id === data.userRef.id) {
      user = appUser;
    } else if (users.length > 0) {
      user = _find(users, (eUser) => eUser.id === data.userRef.id);
    } else {
      const userSnapshot = yield call(getRef, data.userRef);

      user = {
        ...userSnapshot.data(),
        id: userSnapshot.id,
        snapshot: userSnapshot
      };
    }
  }

  return {
    ...data,
    client,
    id: snapshot.id,
    project,
    snapshot,
    user
  };
}

export const buildRef = (path) => {
  return (
    `projects/${firebaseConfig.projectId}/databases/(default)/documents/${path}`
  );
};
