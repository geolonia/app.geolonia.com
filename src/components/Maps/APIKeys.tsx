import React from 'react';

import Table from '../custom/Table';
import AddNew from '../custom/AddNew'
import Title from '../custom/Title';

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
      title: "API keys",
      href: ""
    },
  ]

  const handler = (event: React.MouseEvent) => {

  }

  return (
    <div>
      <Title breadcrumb={breadcrumbItems} title="API keys">Geolonia の地図を表示するには API キーが必要です。 API キーはいくつでも発行することができ、それぞれの API キーで地図を表示するための URL を指定することができます。</Title>

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
