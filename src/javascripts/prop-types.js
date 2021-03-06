import PropTypes from 'prop-types';

const project = PropTypes.shape({
  name: PropTypes.string.isRequired
});

const propTypes = {
  auth: PropTypes.shape({
    email: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired
  }),
  client: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  docRef: PropTypes.object,
  entriesQuery: PropTypes.shape({
    endDate: PropTypes.string,
    startDate: PropTypes.string
  }),
  entry: PropTypes.shape({
    description: PropTypes.string,
    startedAt: PropTypes.number,
    stoppedAt: PropTypes.number
  }),
  entryForm: PropTypes.shape({
    description: PropTypes.string,
    startedAt: PropTypes.number,
    startedAtText: PropTypes.string,
    stoppedAt: PropTypes.number,
    stoppedAtText: PropTypes.string
  }),
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  }),
  flash: PropTypes.shape({
    color: PropTypes.string,
    icon: PropTypes.string,
    id: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired
  }),
  form: PropTypes.shape({
    errors: PropTypes.object.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    touched: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired
  }),
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    perPage: PropTypes.number,
    totalCount: PropTypes.number,
    totalPages: PropTypes.number.isRequired
  }),
  // pagination: PropTypes.shape({
  //   next: PropTypes.shape({
  //     id: PropTypes.string
  //   }),
  //   prev: PropTypes.shape({
  //     id: PropTypes.string
  //   })
  // }),
  project,
  recent: PropTypes.shape({
    description: PropTypes.string
  }),
  role: PropTypes.oneOf(['User', 'Admin']),
  route: PropTypes.shape({
    key: PropTypes.string.isRequired
  }),
  router: PropTypes.shape({
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string
    })
  }),
  routerAction: PropTypes.shape({
    action: PropTypes.string.isRequired
  }),
  routerHistory: PropTypes.shape({
    action: PropTypes.string.isRequired
  }),
  routerLocation: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string
  }),
  routerMatch: PropTypes.shape({
    params: PropTypes.object
  }),
  user: PropTypes.shape({
    autoloadLastDescription: PropTypes.bool,
    name: PropTypes.string,
    recentProjectsListSize: PropTypes.number,
    recentProjectsSort: PropTypes.oneOf([
      'startedAt',
      'client.name',
      'project.name'
    ]),
    role: PropTypes.oneOf(['Admin', 'User']),
    timezone: PropTypes.string
  })
};

export default Object.assign(PropTypes, propTypes);
