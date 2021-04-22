import { useState } from 'react';
import {
  Paper,
  Grid,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';

import { CATEGORY_COLORS } from 'components/layers/VaccinesLayer';
import rgbToHex from 'utils/rgbToHex';

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.typography.caption,
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.common.white,

    '&:empty': {
      display: 'none',
    },
  },
  legendButton: {
    padding: theme.spacing(0.75),
  },
  legendIcon: {
    display: 'block',
  },
  title: {
    display: 'block',
    marginBottom: theme.spacing(1),
  },
  element: {
    ...theme.typography.overline,
    textTransform: 'none',
    color: theme.palette.text.secondary,
    padding: theme.spacing(0.25, 0),
  },
  dot: {
    flex: '0 0 auto',
    borderRadius: '50%',
    width: 8,
    height: 8,
    marginRight: theme.spacing(1),
  },
}));

function Legend({ className }) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const [collapsed, setCollapsed] = useState(true);

  return (
    <>
      {isMobile && collapsed && (
        <Paper
          elevation={4}
          className={`${classes.legendButton} ${className}`}
          onClick={() => setCollapsed(false)}
        >
          <ListAltOutlinedIcon className={classes.legendIcon} alt='Toggle legend' />
        </Paper>
      )}
      {((isMobile && !collapsed) || !isMobile) && (
        <Paper
          elevation={4}
          className={`${classes.root} ${className} `}
          onClick={() => setCollapsed(true)}
        >
          <Typography className={classes.title} variant='caption'>
            Vaccination Status
          </Typography>
          {Object.entries(CATEGORY_COLORS).map((elem, i) => (
            <Grid
              container
              direction='row'
              alignItems='center'
              className={classes.element}
              key={i}
            >
              <div
                className={classes.dot}
                style={{
                  backgroundColor: rgbToHex(elem[1]),
                }}
              />
              {elem[0]}
            </Grid>
          ))}
        </Paper>
      )}
    </>
  );
}

export default Legend;
