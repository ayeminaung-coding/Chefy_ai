/**
 * Ionicons shim for web.
 *
 * Uses the Ionicons 7 web component (<ion-icon>) loaded via CDN in index.html.
 * Accepts the same props as react-native-vector-icons/Ionicons so no source
 * file changes are required.
 */
import React from 'react';

const Ionicons = ({ name, size = 24, color = 'black', style }) => {
  return React.createElement('ion-icon', {
    name: name,
    style: {
      fontSize: size,
      color: color,
      width: size,
      height: size,
      minWidth: size,
      flexShrink: 0,
      ...(style || {}),
    },
  });
};

export default Ionicons;
