import { useSelector } from 'react-redux';
import { CartoBQTilerLayer, colorCategories } from '@deck.gl/carto';
import { selectSourceById } from '@carto/react-redux';
import { useCartoLayerProps } from '@carto/react-api';

export const VACCINES_LAYER_ID = 'vaccinesLayer';

export const CATEGORY_COLORS = {
  'Not Fully Vaccinated': [0, 210, 230, 180],
  'Fully Vaccinated': [204, 0, 194, 255],
  Unknown: [200, 200, 200, 110],
};

function VaccinesLayer() {
  const { vaccinesLayer } = useSelector((state) => state.carto.layers);
  const source = useSelector((state) => selectSourceById(state, vaccinesLayer?.source));
  const cartoLayerProps = useCartoLayerProps(source);

  if (vaccinesLayer && source) {
    return new CartoBQTilerLayer({
      id: VACCINES_LAYER_ID,
      data: source.data,
      credentials: source.credentials,
      getFillColor: colorCategories({
        attr: 'vaccinated',
        domain: ['true', 'false', 'unknown'],
        colors: [
          CATEGORY_COLORS['Fully Vaccinated'],
          CATEGORY_COLORS['Not Fully Vaccinated'],
          CATEGORY_COLORS['Unknown'],
        ],
      }),
      pointRadiusMinPixels: 1,
      pointRadiusMaxPixels: 12,
      pointRadiusScale: 1.9,
      getLineWidth: 0,
      ...cartoLayerProps,
    });
  }
}

export default VaccinesLayer;
