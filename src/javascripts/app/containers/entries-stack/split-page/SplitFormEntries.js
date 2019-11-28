import { Button } from 'javascripts/shared/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'javascripts/prop-types';
import React from 'react';
import SplitFormChart from './SplitFormChart';
import SplitFormEntry from './SplitFormEntry';

const SplitFormEntries = ({ form, push }) => {
  const {
    values: { entries }
  } = form;

  const _handleAdd = () => {
    const {
      form: { values },
      push
    } = this.props;

    push({
      clientId: null,
      description: '',
      hours: '0.0',
      percent: '0.0',
      projectId: null,
      startedAt: values.stoppedAt,
      stoppedAt: values.stoppedAt,
      timezone: values.timezone
    });
  };

  const rows = entries.map((entry, index) => {
    return (
      <SplitFormEntry entry={entry} index={index} key={index} push={push} />
    );
  });

  return (
    <div>
      <div className="flex items-center mb-4">
        <h2 className="text-blue flex-1">{'Entries'}</h2>
        <Button
          color="blue"
          disabled={form.isSubmitting}
          onClick={_handleAdd}
          type="button"
        >
          <FontAwesomeIcon icon="plus" /> {'Add Entry'}
        </Button>
      </div>
      {rows}
      <h3 className="text-blue">{'Chart'}</h3>
      <SplitFormChart entries={entries || []} />
    </div>
  );
};

SplitFormEntries.propTypes = {
  form: PropTypes.formikForm.isRequired,
  push: PropTypes.func.isRequired
};

export default React.memo(SplitFormEntries);
