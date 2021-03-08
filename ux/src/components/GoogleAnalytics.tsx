import React from 'react';
import type { FC } from 'react';
import { Helmet } from 'react-helmet';

const GA_MEASUREMENT_ID: string | undefined = process.env.REACT_APP_GA_MEASUREMENT_ID;

const GoogleAnalytics: FC = () => {
  return (
    <Helmet>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <script>
        {`
          window.dataLayer = window.dataLayer || [];

          function gtag() {
            dataLayer.push(arguments);
          }

          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </script>
    </Helmet>
  );
};

export default GoogleAnalytics;
