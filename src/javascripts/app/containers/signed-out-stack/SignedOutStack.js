import { Container, Grid } from 'semantic-ui-react';

import Header from './Header';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import { Redirect } from 'react-router-dom';
import Routes from './Routes';
import { connect } from 'react-redux';
import styles from './SignedOutStack.scss';

const SignedOutStack = (props) => {
  const { auth } = props;

  if (auth) {
    return (
      <Redirect to="/" />
    );
  }

  return (
    <div className={styles.container}>
      <Container>
        <Grid
          centered
        >
          <Grid.Column
            computer={8}
            mobile={16}
            tablet={12}
          >
            <Header {...props} />

            <div className={styles.content}>
              <Routes {...props} />
            </div>
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
};

SignedOutStack.propTypes = {
  auth: PropTypes.auth
};

SignedOutStack.defaultProps = {
  auth: null
};

const props = (state) => {
  return {
    auth: state.app.auth
  };
};

const actions = {};

export default connect(props, actions)(SignedOutStack);
