import React from "react";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import CheeckIcon from "@material-ui/icons/Check";

import CardContent from "@material-ui/core/CardContent";

type Props = {
  title: string;
  pricePerMonth?: number;
  pricePerYear?: number;
  features: string[];
  pricePerPersonPerMonth?: number;
  children?: React.ReactElement | string;
};

export default function PriceCard(props: Props) {
  const {
    title,
    pricePerMonth,
    pricePerYear,
    pricePerPersonPerMonth,
    features,
    children
  } = props;
  return (
    <Card style={{ height: "100%", width: "100%" }}>
      <Typography>{title}</Typography>
      <div style={{ height: "192px" }}>
        {typeof pricePerPersonPerMonth === "number" ? (
          <>
            <Typography>
              <span
                style={{ fontSize: 64 }}
              >{`$${pricePerPersonPerMonth}`}</span>
              <span style={{ fontSize: 32 }}>{`/人*月`}</span>
            </Typography>
          </>
        ) : (
          <>
            <Typography>
              <span style={{ fontSize: 64 }}>{`$${pricePerMonth}`}</span>
              <span style={{ fontSize: 32 }}>{`/月`}</span>
            </Typography>
            <Typography>
              <span style={{ fontSize: 64 }}>{`$${pricePerYear}`}</span>
              <span style={{ fontSize: 32 }}>{`/年`}</span>
            </Typography>
          </>
        )}
      </div>

      <CardContent>
        <List component={"ul"}>
          {features.map(feature => (
            <ListItem key={feature}>
              <ListItemIcon>
                <CheeckIcon />
              </ListItemIcon>
              {feature}
            </ListItem>
          ))}
        </List>
        {children}
      </CardContent>
    </Card>
  );
}
