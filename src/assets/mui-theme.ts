import { createMuiTheme } from "@material-ui/core/styles";

const themeBase = createMuiTheme({
  palette: {
    primary: {
      light: "#63ccff",
      main: "#009be5",
      dark: "#006db3"
    }
  },
  typography: {
    h2: {
      fontWeight: "bolder"
    },
    h3: {
      fontWeight: "bolder"
    },
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5
    }
  },
  shape: {
    borderRadius: 8
  },
  props: {
    MuiTab: {
      disableRipple: true
    }
  },
  mixins: {
    toolbar: {
      minHeight: 48
    }
  }
});

export const theme = {
  ...themeBase,
  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: "#18202c"
      }
    },
    MuiButton: {
      label: {
        textTransform: "none"
      },
      contained: {
        boxShadow: "none",
        "&:active": {
          boxShadow: "none"
        }
      }
    },
    MuiTabs: {
      root: {
        marginLeft: themeBase.spacing(1)
      },
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: themeBase.palette.common.white
      }
    },
    MuiTab: {
      root: {
        textTransform: "none",
        margin: "0 16px",
        minWidth: 0,
        padding: 0,
        [themeBase.breakpoints.up("md")]: {
          padding: 0,
          minWidth: 0
        }
      }
    },
    MuiIconButton: {
      root: {
        padding: themeBase.spacing(1)
      }
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4
      }
    },
    MuiDivider: {
      root: {
        backgroundColor: "#404854"
      }
    },
    MuiListItemText: {
      primary: {
        fontWeight: themeBase.typography.fontWeightMedium
      }
    },
    MuiListItemIcon: {
      root: {
        color: "inherit",
        marginRight: 0,
        "& svg": {
          fontSize: 20
        }
      }
    },
    MuiAvatar: {
      root: {
        width: 32,
        height: 32
      }
    }
  }
};
