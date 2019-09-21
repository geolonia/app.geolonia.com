import React from 'react';

import Table from '../custom/Table';
import AddNew from '../custom/AddNew'
import Title from '../custom/Title';

import {__} from '@wordpress/i18n'

const rows = [
  {id: 1111, name: "My Map", updated: "2019-08-28"},
  {id: 1112, name: "exmaple.com", updated: "2019-08-28"},
  {id: 1113, name: "exmaple.jp", updated: "2019-08-28"},
];

function Content() {
  const breadcrumbItems = [
    {
      title: "Home",
      href: "#/"
    },
    {
      title: __("Maps"),
      href: "#/maps",
    },
    {
      title: __("API keys"),
      href: null
    },
  ]

  const handler = (event: React.MouseEvent) => {

  }

  return (
    <div>
      <Title breadcrumb={breadcrumbItems} title={__('API keys')}>{__('You need an API key to display map. Get an API key.')}</Title>

      <AddNew
        label="Create a new API key"
        description="Please enter the name of new API key."
        default="My API"
        handler={handler}
      />

      <Table rows={rows} rowsPerPage={10} permalink="/maps/api-keys/%s" />
    </div>
  );
}

export default Content;
