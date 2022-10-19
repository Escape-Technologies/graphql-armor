import clsx from 'clsx';
import React from 'react';

import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Large support',
    Svg: require('@site/static/img/transparent.svg').default,
    description: <>GraphQL Armor is built on top of GraphQL JS and supports most of nodeJS engines.</>,
  },
  {
    title: 'Easy to Install',
    Svg: require('@site/static/img/transparent.svg').default,
    description: <>You can add GraphQL Armor to an existing GraphQL server in just a few lines of code.</>,
  },
  {
    title: 'Fully configurable',
    Svg: require('@site/static/img/transparent.svg').default,
    description: <>We provide a fully configurable callbacks API to fit your needs.</>,
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
