import Head from 'next/head';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import wrapper from '../store/configurStore';

const NodeBird = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  return (
    <Provider store={store}>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
        <title>NodeBird</title>
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.any.isRequired,
};

export function reportWebVitals(metric) {
  // console.log("-----------------------------------");
  // console.log(metric);
}

export default NodeBird;
