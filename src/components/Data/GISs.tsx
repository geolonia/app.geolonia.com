import React from 'react';

import {__} from '@wordpress/i18n'

import Table from '../custom/Table';
import AddNew from '../custom/AddNew'
import Title from '../custom/Title'

const rows = [
  {id: 1111, name: "My Map", updated: "2019-08-28", isPublic: true},
  {id: 1112, name: "exmaple.com", updated: "2019-08-28", isPublic: false},
  {id: 1113, name: "exmaple.jp", updated: "2019-08-28", isPublic: true},
];

function Content() {
  const breadcrumbItems = [
    {
      title: "Home",
      href: "#/"
    },
    {
      title: __("API services"),
      href: "#/data"
    },
    {
      title: "Geolonia GIS",
      href: null
    },
  ]

  const handler = (event: React.MouseEvent) => {

  }

  return (
    <div>
      <Title breadcrumb={breadcrumbItems} title="Geolonia GIS">
        {__('Geolonia GIS is an API service specialized for location data. Register various location information data such as stores and real estate informations that you have.')}
      </Title>

      <AddNew
        label={__("Create a new dataset")}
        description={__("Please enter the name of the new dataset.")}
        default={__("My dataset")}
        handler={handler}
      />

      <Table rows={rows} rowsPerPage={10} permalink="/data/gis/%s" />
    </div>
  );
}

export default Content;
