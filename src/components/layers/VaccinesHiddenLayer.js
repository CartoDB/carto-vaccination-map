import { useSelector } from 'react-redux';
import { CartoBQTilerLayer } from '@deck.gl/carto';
import { selectSourceById } from '@carto/react-redux';
import { useCartoLayerProps } from '@carto/react-api';

export const VACCINES_HIDDEN_LAYER_ID = 'vaccinesHiddenLayer';

function VaccinesHiddenLayer() {
  const { vaccinesHiddenLayer } = useSelector((state) => state.carto.layers);
  const source = useSelector((state) =>
    selectSourceById(state, vaccinesHiddenLayer?.source)
  );
  const cartoLayerProps = useCartoLayerProps(source);

  if (vaccinesHiddenLayer && source) {
    return new CartoBQTilerLayer({
      id: VACCINES_HIDDEN_LAYER_ID,
      data: source.data,
      credentials: source.credentials,
      opacity: 0,
      getFillColor: [241, 109, 122],
      pointRadiusMinPixels: 2,
      ...cartoLayerProps,
    });
  }
}

export default VaccinesHiddenLayer;
