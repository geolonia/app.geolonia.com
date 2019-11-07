import React from "react";

// Components
import Grid from "@material-ui/core/Grid";
import Title from "../../custom/Title";
import Fields from "./fields";
import Avatar from "./avatar";
import Delete from "./delete";

// utils
import { __ } from "@wordpress/i18n";
import { Roles } from "../../../types";

// types
import { Role, AppState } from "../../../types";
import { connect } from "react-redux";

type OwnProps = {};
type StateProps = { role?: Role };
type Props = OwnProps & StateProps;

const Content = (props: Props) => {
  const { role } = props;

  const breadcrumbItems = [
    {
      title: "Home",
      href: "#/"
    },
    {
      title: __("Team settings"),
      href: "#/team"
    },
    {
      title: __("General"),
      href: null
    }
  ];

  const isOwner = role === Roles.Owner;

  return (
    <div>
      <Title title={__("General")} breadcrumb={breadcrumbItems}>
        {__(
          "All users on the Geolonia service belong to one of the teams, and a team with the same name as the user is automatically generated when you sign up. You can switch teams in the pull-down menu at the top left of the sidebar."
        )}
      </Title>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Fields />
        </Grid>

        <Grid item xs={12} md={4}>
          <Avatar />
        </Grid>

      {isOwner &&
        <Grid item xs={12} md={12}>
          <Delete />
        </Grid>
      }
      </Grid>
    </div>
  );
};

const mapStateToProps = (state: AppState): StateProps => {
  const team = state.team.data[state.team.selectedIndex];
  const role = team && team.role;
  return { role };
};

export default connect(mapStateToProps)(Content);
