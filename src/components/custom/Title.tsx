import React from 'react';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import Icon from '@material-ui/icons/Help'

import './Title.scss'

type breadcrumbItems = {
  title: string,
  href: string | null,
}

type Props = {
  title: string,
  children: React.ReactNode,
  breadcrumb: Array<breadcrumbItems>,
}

const Title = (props: Props) => {
  return (
    <div className="page-title"><div className="outer">
      <Breadcrumbs aria-label="breadcrumb" className="breadcrums">
      {
        props.breadcrumb.map((item, index) => {
          if (item.href) {
            return <Link key={index} href={item.href}>{item.title}</Link>
          } else {
            return <Typography key={index}>{item.title}</Typography>
          }
        })
      }
      </Breadcrumbs>
      <h1>{props.title}</h1>
      <div className="title-container">
        {props.children}
      </div>
    </div></div>
  );
}

Title.defaultProps = {

};

export default Title;
