import { useEffect, useState } from 'react';

import _uniqueId from 'lodash/uniqueId';
import { isBlank } from 'javascripts/globals';

const useId = (propsId) => {
  const [id, setId] = useState(propsId || _uniqueId('input_'));

  useEffect(() => {
    if (!isBlank(propsId) && id !== propsId) {
      setId(propsId);
    } else {
      setId(id);
    }
  });

  return id;
};

export default useId;
