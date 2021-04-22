import VaccinesLayer from './VaccinesLayer';
import VaccinesHiddenLayer from './VaccinesHiddenLayer';
// [hygen] Import layers

export const getLayers = () => {
  return [
    VaccinesLayer(),
    VaccinesHiddenLayer(),
    // [hygen] Add layer
  ];
};
