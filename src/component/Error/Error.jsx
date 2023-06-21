import React from 'react';
import { Alert } from 'antd';

import './Error.css';

const Error = ({ message }) => {
  return <Alert message={message} type="error" />;
};

export default Error;
