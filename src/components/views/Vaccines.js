import { useEffect, useState } from 'react';
import vaccinesWidgetSource from 'data/sources/vaccinesWidgetSource';
import { VACCINES_HIDDEN_LAYER_ID } from 'components/layers/VaccinesHiddenLayer';
import vaccinesSource from 'data/sources/vaccinesSource';
import { VACCINES_LAYER_ID } from 'components/layers/VaccinesLayer';
import { useDispatch } from 'react-redux';
import { addLayer, removeLayer, addSource, removeSource } from '@carto/react-redux';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Divider, Link, Typography } from '@material-ui/core';

import { setError } from 'store/appSlice';
import { AggregationTypes } from '@carto/react-core';
import { FormulaWidget, CategoryWidget } from '@carto/react-widgets';
import { PieWidgetVaccines } from 'components/widgets/PieWidgetVaccines';
import { WrapperWidgetUI } from '@carto/react-ui';
import { numberFormatter } from 'utils/formatter';

import cartoLogo from 'assets/img/carto-logo-positive.svg';

const useStyles = makeStyles((theme) => ({
  root: {},
  about: {
    padding: 10,
  },
  aboutItem: {
    marginBottom: 10,
  },
}));

export default function Vaccines() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [updatedAt, setUpdatedAt] = useState();

  useEffect(() => {
    dispatch(addSource(vaccinesSource));

    dispatch(
      addLayer({
        id: VACCINES_LAYER_ID,
        source: vaccinesSource.id,
      })
    );

    return () => {
      dispatch(removeLayer(VACCINES_LAYER_ID));
      dispatch(removeSource(vaccinesSource.id));
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(addSource(vaccinesWidgetSource));

    dispatch(
      addLayer({
        id: VACCINES_HIDDEN_LAYER_ID,
        source: vaccinesWidgetSource.id,
      })
    );

    return () => {
      dispatch(removeLayer(VACCINES_HIDDEN_LAYER_ID));
      dispatch(removeSource(vaccinesWidgetSource.id));
    };
  }, [dispatch]);

  useEffect(() => {
    setUpdatedAt('2021-04-18');
  }, []);

  // [hygen] Add useEffect

  const onWidgetError = (error) => {
    dispatch(setError(`Error obtaining widget data: ${error.message}`));
  };

  return (
    <Grid container direction='column' className={classes.root}>
      <Grid item>
        <FormulaWidget
          id='people'
          title='Population in View'
          dataSource={vaccinesWidgetSource.id}
          column='aggregated_total'
          operation={AggregationTypes.SUM}
          formatter={numberFormatter}
          onError={onWidgetError}
        />

        <Divider />

        <PieWidgetVaccines
          id='pctVaccinated'
          title='% Fully Vaccinated'
          dataSource={vaccinesWidgetSource.id}
          columnUnknown='unknown'
          columnVaccinated='vaccinated'
          columnNonVaccinated='non_vaccinated'
          operation={AggregationTypes.SUM}
          colors={['#CC00C2', '#00D2E6', '#C8C8C8']}
          height='150px'
          formatter={numberFormatter}
          onError={onWidgetError}
        />

        <Divider />

        <WrapperWidgetUI title='What is this map?'>
          <Grid container direction='column' className={classes.about}>
            <Grid item className={classes.aboutItem}>
              <Typography variant='body2'>
                This map represents every single person in the US as a dot with population
                data sourced from the{' '}
                <Link href='https://carto.com/spatial-data-catalog/' target='_blank'>
                  CARTO Data Observatory
                </Link>
                . These dots are colored based upon the percentage of vaccinated
                individuals in each county sourced from data{' '}
                <Link
                  href='https://covid.cdc.gov/covid-data-tracker/#county-view'
                  target='_blank'
                >
                  published daily by the CDC
                </Link>
                . The dots are randomly located and the map offers a visual representation
                of the vaccination progress by individual.
              </Typography>
            </Grid>
            <Grid item className={classes.aboutItem}>
              <Typography variant='body2'>
                Want to learn how this map was built?{' '}
                <Link
                  href='https://www.carto.com/blog/visualizing-covid-19-vaccination-progress'
                  target='blank'
                >
                  Check our blog post
                </Link>
                .
              </Typography>
            </Grid>
            <Grid item className={classes.aboutItem}>
              <Typography variant='body2'>
                <strong>Data updated at</strong>: {updatedAt}
              </Typography>
            </Grid>
            <Grid item className={classes.aboutItem}>
              <Typography variant='body2'>
                <strong>Built with and by</strong>
                <Link href='https://carto.com' target='_blank'>
                  <img
                    style={{ marginLeft: 10, verticalAlign: 'middle' }}
                    src={cartoLogo}
                    alt='CARTO '
                  />
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </WrapperWidgetUI>
      </Grid>
    </Grid>
  );
}
