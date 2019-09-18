import React from 'react';
import Typography from '@material-ui/core/Typography';
import RoomIcon from '@material-ui/icons/Room';

import Table from '../custom/Table';
import AddNew from '../custom/AddNew'
import Title from '../custom/Title'

const rows = [
  {id: 1111, name: "My Map", updated: "2019-08-28", isPublic: true},
  {id: 1112, name: "exmaple.com", updated: "2019-08-28", isPublic: false},
  {id: 1113, name: "exmaple.jp", updated: "2019-08-28", isPublic: true},
];

function Content() {
  const handler = (event: React.MouseEvent) => {

  }

  return (
    <div>
      <Title title="Geolonia GIS">
        Geolonia GIS は、位置情報データに特化した API サービスです。ユーザーのみなさんが持つ店舗や不動産情報などの様々な位置情報データを登録し、それらに対する緯度経度を使用した検索 API を提供します。
      </Title>

      <AddNew
        label="Create a new dataset"
        description="Please enter the name of the new dataset."
        default="My dataset"
        handler={handler}
      />

      <Table rows={rows} rowsPerPage={10} permalink="/data/gis/%s" />
    </div>
  );
}

export default Content;
