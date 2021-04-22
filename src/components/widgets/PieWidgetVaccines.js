import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { addFilter, removeFilter, selectSourceById } from '@carto/react-redux';
import { WrapperWidgetUI } from '@carto/react-ui';
import { PieWidgetUIVaccines } from './PieWidgetUIVaccines';
import {
  _FilterTypes as FilterTypes,
  _getApplicableFilters as getApplicableFilters,
  AggregationTypes,
} from '@carto/react-core';
import { getFormula } from '@carto/react-widgets';
import useWidgetLoadingState from './useWidgetLoadingState';

/**
 * Renders a <PieWidget /> component
 * @param  props
 * @param  {string} props.id - ID for the widget instance.
 * @param  {string} props.title - Title to show in the widget header.
 * @param  {string} props.dataSource - ID of the data source to get the data from.
 * @param  {string} props.columnTotal - Column with the total population.
 * @param  {string} props.columnVaccinated - Column with the vaccinated population.
 * @param  {string} props.operation - Operation to apply to the operationColumn. Must be one of those defined in `AggregationTypes` object.
 * @param  {formatterCallback} [props.formatter] - Function to format the value that appears in the tooltip.
 * @param  {formatterCallback} [props.tooltipFormatter] - Function to return the HTML of the tooltip.
 * @param  {string} props.height - Height of the chart
 * @param  {errorCallback} [props.onError] - Function to handle error messages from the widget.
 * @param  {Object} [props.wrapperProps] - Extra props to pass to [WrapperWidgetUI](https://storybook-react.carto.com/?path=/docs/widgets-wrapperwidgetui--default)
 */
export function PieWidgetVaccines({
  id,
  title,
  height,
  dataSource,
  columnUnknown,
  columnVaccinated,
  columnNonVaccinated,
  colors,
  operation,
  formatter,
  tooltipFormatter,
  onError,
  wrapperProps,
}) {
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const dispatch = useDispatch();
  const source = useSelector((state) => selectSourceById(state, dataSource) || {});
  const viewportFeaturesReady = useSelector((state) => state.carto.viewportFeaturesReady);

  const widgetsLoadingState = useSelector((state) => state.carto.widgetsLoadingState);
  const [hasLoadingState, setIsLoading] = useWidgetLoadingState(id);
  const { data, credentials, type } = source;

  let unknownPeople, vaccinatedPeople, nonVaccinatedPeople;

  useEffect(() => {
    const abortController = new AbortController();
    if (data && credentials && hasLoadingState) {
      const filters = getApplicableFilters(source.filters, id);
      getFormula({
        data,
        operation,
        column: columnUnknown,
        filters,
        dataSource,
      })
        .then((unknownPeopleData) => {
          if (unknownPeopleData && unknownPeopleData[0]) {
            unknownPeople = unknownPeopleData[0].value;
            getFormula({
              data,
              operation,
              column: columnVaccinated,
              filters,
              dataSource,
            })
              .then((vaccinatedPeopleData) => {
                if (vaccinatedPeopleData && vaccinatedPeopleData[0]) {
                  vaccinatedPeople = vaccinatedPeopleData[0].value;
                  getFormula({
                    data,
                    operation,
                    column: columnNonVaccinated,
                    filters,
                    dataSource,
                  })
                    .then((nonVaccinatedPeopleData) => {
                      if (nonVaccinatedPeopleData && nonVaccinatedPeopleData[0]) {
                        nonVaccinatedPeople = nonVaccinatedPeopleData[0].value;
                        setCategoryData([
                          { name: 'Fully vaccinated', value: vaccinatedPeople },
                          { name: 'Not fully vaccinated', value: nonVaccinatedPeople },
                          { name: 'Unknown', value: unknownPeople },
                        ]);
                      }
                    })
                    .catch((error) => {
                      if (error.name === 'AbortError') return;
                      if (onError) onError(error);
                    });
                }
              })
              .catch((error) => {
                if (error.name === 'AbortError') return;
                if (onError) onError(error);
              });
          }
        })
        .catch((error) => {
          if (error.name === 'AbortError') return;
          if (onError) onError(error);
        })
        .finally(() => setIsLoading(false));
    } else {
      setCategoryData([]);
    }

    return function cleanup() {
      abortController.abort();
    };
  }, [
    credentials,
    dataSource,
    data,
    setIsLoading,
    source.filters,
    type,
    viewportFeaturesReady,
    columnUnknown,
    columnVaccinated,
    colors,
    operation,
    dispatch,
    id,
    onError,
    hasLoadingState,
  ]);

  const handleSelectedCategoriesChange = useCallback(
    (categories) => {
      setSelectedCategories(categories);

      if (categories && categories.length) {
        dispatch(
          addFilter({
            id: dataSource,
            columnUnknown,
            type: FilterTypes.IN,
            values: categories,
            owner: id,
          })
        );
      } else {
        dispatch(
          removeFilter({
            id: dataSource,
            columnUnknown,
          })
        );
      }
    },
    [columnUnknown, dataSource, id, setSelectedCategories, dispatch]
  );

  return (
    <WrapperWidgetUI title={title} isLoading={widgetsLoadingState[id]} {...wrapperProps}>
      <PieWidgetUIVaccines
        data={categoryData}
        formatter={formatter}
        height={height}
        tooltipFormatter={tooltipFormatter}
        isLoading={widgetsLoadingState[id]}
        selectedCategories={selectedCategories}
        colors={colors}
        onSelectedCategoriesChange={handleSelectedCategoriesChange}
      />
    </WrapperWidgetUI>
  );
}

PieWidgetVaccines.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  height: PropTypes.number,
  dataSource: PropTypes.string.isRequired,
  columnUnknown: PropTypes.string.isRequired,
  columnVaccinated: PropTypes.string.isRequired,
  columnNonVaccinated: PropTypes.string.isRequired,
  colors: PropTypes.array,
  operation: PropTypes.oneOf(Object.values(AggregationTypes)).isRequired,
  formatter: PropTypes.func,
  tooltipFormatter: PropTypes.func,
  onError: PropTypes.func,
  wrapperProps: PropTypes.object,
};

PieWidgetVaccines.defaultProps = {
  wrapperProps: {},
};

export default PieWidgetVaccines;
