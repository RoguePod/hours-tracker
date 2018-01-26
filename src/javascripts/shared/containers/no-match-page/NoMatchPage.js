import { Container, Header } from 'semantic-ui-react';

import React from 'react';
import styles from './NoMatchPage.scss';

const NoMatchPage = () => {
  return (
    <Container className={styles.container}>
      <Header
        as="h1"
        color="blue"
        textAlign="center"
      >
        {'Page Not Found'}
      </Header>
    </Container>
  );
};

export default NoMatchPage;
