import React from 'react';

import '../components/styles/Error.css'
import PropTypes from 'prop-types';

const DisplayServerError = ({ error }: any) => {
  if (!error || !error.message) return null;
  if (error.networkError && error.networkError.result && error.networkError.result.errors.length) {
    return error.networkError.result.errors.map((error: any, i: any) => (
      <div className="error" key={i}>
        <p data-test="graphql-error">
          <strong>Shoot!</strong>
          {error.message.replace('GraphQL error: ', '')}
        </p>
      </div>
    ));
  }
  if (error.message.includes("GraphQL")){
    return (
      <div className="error">
        <p data-test="graphql-error">
          <strong>Shoot!</strong>
          {error.message.replace('GraphQL error: ', '')}
        </p>
      </div>
    );
  }
  return (
    <div className="error">
      <p data-test="graphql-error">
        <strong></strong>
        {error.message.replace('GraphQL error: ', '')}
      </p>
    </div>
  )
};

DisplayServerError.defaultProps = {
  error: {},
};

DisplayServerError.propTypes = {
  error: PropTypes.object,
};

export default React.memo(DisplayServerError)