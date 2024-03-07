const inactive = [
  {
    'id': 'gl-draw-polygon-fill-inactive',
    'type': 'fill',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static_select']
    ],
    'paint': {
      'fill-color': '#3bb2d0',
      'fill-outline-color': '#3bb2d0',
      'fill-opacity': 0.1
    }
  },
  {
    'id': 'gl-draw-polygon-stroke-inactive',
    'type': 'line',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static_select']
    ],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#3bb2d0',
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-line-inactive',
    'type': 'line',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'LineString'],
      ['!=', 'mode', 'static_select']
    ],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#3bb2d0',
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-polygon-and-line-vertex-stroke-inactive',
    'type': 'circle',
    'filter': ['all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static_select']
    ],
    'paint': {
      'circle-radius': 5,
      'circle-color': '#fff'
    }
  },
  {
    'id': 'gl-draw-polygon-and-line-vertex-inactive',
    'type': 'circle',
    'filter': ['all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static_select']
    ],
    'paint': {
      'circle-radius': 3,
      'circle-color': '#fbb03b'
    }
  },
  {
    'id': 'gl-draw-point-point-stroke-inactive',
    'type': 'circle',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['!=', 'mode', 'static_select']
    ],
    'paint': {
      'circle-radius': 5,
      'circle-opacity': 1,
      'circle-color': '#fff'
    }
  },
  {
    'id': 'gl-draw-point-inactive',
    'type': 'circle',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['!=', 'mode', 'static_select']
    ],
    'paint': {
      'circle-radius': 3,
      'circle-color': '#3bb2d0',
    }
  },
]
const active = [
  {
    'id': 'gl-draw-polygon-fill-active',
    'type': 'fill',
    'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    'paint': {
      'fill-color': '#fbb03b',
      'fill-outline-color': '#fbb03b',
      'fill-opacity': 0.1
    }
  },
  {
    'id': 'gl-draw-polygon-stroke-active',
    'type': 'line',
    'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#fbb03b',
      'line-dasharray': [0.2, 2],
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-line-active',
    'type': 'line',
    'filter': ['all',
      ['==', '$type', 'LineString'],
      ['==', 'active', 'true']
    ],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#fbb03b',
      'line-dasharray': [0.2, 2],
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-point-stroke-active',
    'type': 'circle',
    'filter': ['all',
      ['==', '$type', 'Point'],
      ['==', 'active', 'true'],
      ['!=', 'meta', 'midpoint']
    ],
    'paint': {
      'circle-radius': 5,
      'circle-color': '#fff'
    }
  },
  {
    'id': 'gl-draw-point-active',
    'type': 'circle',
    'filter': ['all',
      ['==', '$type', 'Point'],
      ['!=', 'meta', 'midpoint'],
      ['==', 'active', 'true']],
    'paint': {
      'circle-radius': 3,
      'circle-color': '#fbb03b'
    }
  },
]
let red = 'rgba(217,0,27,0.24)'
let green = 'rgba(149,242,2,0.24)'
let blue = 'rgba(2,167,240,0.3)'
const statics_blue = [
  {
    'id': 'gl-draw-polygon-fill-static-blue',
    'type': 'fill',
    'filter': ['all', ['==', 'mode', 'static_select'], ['==', '$type', 'Polygon'],['==','user_color','blue']],
    'paint': {
      'fill-color': blue,
      'fill-outline-color': 'black',
      'fill-opacity': 1,
    }
  },
  // {
  //   'id': 'gl-draw-polygon-stroke-static-blue',
  //   'type': 'line',
  //   'filter': ['all', ['==', 'mode', 'static_select'], ['==', '$type', 'Polygon'],['==','user_color','blue']],
  //   'layout': {
  //     'line-cap': 'round',
  //     'line-join': 'round'
  //   },
  //   'paint': {
  //     'line-color': blue,
  //     'line-width': 2
  //   }
  // },
  {
    'id': 'gl-draw-line-static-blue',
    'type': 'line',
    'filter': ['all', ['==', 'mode', 'static_select'], ['==', '$type', 'LineString'],['==','user_color','blue']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': 'black',
      'line-width': 1
    }
  },
  {
    'id': 'gl-draw-point-static-blue',
    'type': 'circle',
    'filter': ['all', ['==', 'mode', 'static_select'], ['==', '$type', 'Point'],['==','user_color','blue']],
    'paint': {
      'circle-radius': 3,
      'circle-color':'black',
      'circle-stroke-width': 2,
      'circle-stroke-color': 'black',
    }
  },
]
const statics_green = [
  {
    'id': 'gl-draw-polygon-fill-static-green',
    'type': 'fill',
    'filter': ['all', ['==', 'mode', 'static_select'], ['==', '$type', 'Polygon'],['==','user_color','green']],
    'paint': {
      'fill-color': green,
      'fill-outline-color': 'black',
      'fill-opacity': 1,
    }
  },
  // {
  //   'id': 'gl-draw-polygon-stroke-static-green',
  //   'type': 'line',
  //   'filter': ['all', ['==', 'mode', 'static_select'], ['==', '$type', 'Polygon'],['==','user_color','green']],
  //   'layout': {
  //     'line-cap': 'round',
  //     'line-join': 'round'
  //   },
  //   'paint': {
  //     'line-color': color,
  //     'line-width': 2
  //   }
  // },
  {
    'id': 'gl-draw-line-static-green',
    'type': 'line',
    'filter': ['all', ['==', 'mode', 'static_select'], ['==', '$type', 'LineString'],['==','user_color','green']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': 'black',
      'line-width': 1
    }
  },
  {
    'id': 'gl-draw-point-static-green',
    'type': 'circle',
    'filter': ['all', ['==', 'mode', 'static_select'], ['==', '$type', 'Point'],['==','user_color','green']],
    'paint': {
      'circle-radius': 3,
      'circle-color':'black',
      'circle-stroke-width': 2,
      'circle-stroke-color': 'black',
    }
  },
]
const statics_red = [
  {
    'id': 'gl-draw-polygon-fill-static-red',
    'type': 'fill',
    'filter': ['all', ['==', 'mode', 'static_select'], ['==', '$type', 'Polygon'],['==','user_color', 'red']],
    'paint': {
      'fill-color': red,
      'fill-outline-color': 'black',
      'fill-opacity': 1,
    }
  },
  // {
  //   'id': 'gl-draw-polygon-stroke-static-red',
  //   'type': 'line',
  //   'filter': ['all', ['==', 'mode', 'static_select'], ['==', '$type', 'Polygon'],['==','user_color', 'red']],
  //   'layout': {
  //     'line-cap': 'round',
  //     'line-join': 'round'
  //   },
  //   'paint': {
  //     'line-color': red,
  //     'line-width': 2
  //   }
  // },
  {
    'id': 'gl-draw-line-static-red',
    'type': 'line',
    'filter': ['all', ['==', 'mode', 'static_select'], ['==', '$type', 'LineString'],['==','user_color', 'red']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': 'black',
      'line-width': 1
    }
  },
  {
    'id': 'gl-draw-point-static-red',
    'type': 'circle',
    'filter': ['all', ['==', 'mode', 'static_select'], ['==', '$type', 'Point'],['==','user_color', 'red']],
    'paint': {
      'circle-radius': 3,
      'circle-color':'black',
      'circle-stroke-width': 2,
      'circle-stroke-color': 'black',
    }
  },
]
export default [
  ...inactive,
  ...active,
  ...statics_red,
  ...statics_green,
  ...statics_blue,
  {
    'id': 'gl-draw-polygon-midpoint',
    'type': 'circle',
    'filter': ['all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'midpoint']],
    'paint': {
      'circle-radius': 3,
      'circle-color': '#fbb03b'
    }
  }
];