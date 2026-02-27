/**
 * Feather Icons shim for web.
 *
 * Renders inline SVG from feather-icons (loaded via CDN in index.html).
 * Accepts the same props as react-native-vector-icons/Feather.
 */
import React, { useEffect, useRef } from 'react';

const Feather = ({ name, size = 24, color = 'black', style }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && window.feather) {
      ref.current.innerHTML = '';
      const svgString = window.feather.icons[name]
        ? window.feather.icons[name].toSvg({
            width: size,
            height: size,
            color: color,
            stroke: color,
          })
        : '';
      ref.current.innerHTML = svgString;
    }
  }, [name, size, color]);

  return React.createElement('span', {
    ref: ref,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      flexShrink: 0,
      ...(style || {}),
    },
  });
};

export default Feather;
