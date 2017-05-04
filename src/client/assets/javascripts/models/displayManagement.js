interface Relation {
  id: number;
  hostMediaId: number;
  guestMediaId: number;
  boxLeft: number;
  boxTop: number;
  boxWidth: number;
  boxHeight: number;
  guestLeft: number;
  guestTop: number;
  guestWidth: number;
  guestHeight: number;
  startTimeOffset: number;
  duration: number;
  zIndex: number;
}

interface Media {
  id: number;
  name: string;
  ratioNumerator: number;
  ratioDenominator: number;
  type: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  relationsWithHosts: number[];
  relationsWithGuests: number[];
  duration: number;
}

interface File extends Media {
  width: number;
  height: number;
  weight: number;
  mimetype: string;
}

interface Agenda extends Media { }

interface Scene extends Media { }

interface Screen extends Media {
  distantVersion: number;
  lastPull: Date;
}

export const MediaTypes = {
  IMAGE: {
    key: 'image',
    name: 'Images',
  },
  VIDEO: {
    key: 'video',
    name: 'Vidéos',
  },
  AGENDA: {
    key: 'agenda',
    name: 'Agendas',
  },
  SCENE: {
    key: 'scene',
    name: 'Scènes',
  },
  CLOCK: {
    key: 'clock',
    name: 'Horloges',
  },
  NEWS: {
    key: 'news',
    name: 'Actualités',
  },
  METEO: {
    key: 'meteo',
    name: 'Météo',
  },
};

export type State = {
  mediaById: Array<Media>,
  relationsById: Array<Relation>,
  agenda: {
    isFetching: boolean,
    fetchError: Object,
    items: number[]
  },
  scene: {
    isFetching: boolean,
    fetchError: Object,
    items: number[]
  },
  screen: {
    isFetching: boolean,
    fetchError: Object,
    items: number[]
  },
  file: {
    isFetching: boolean,
    fetchError: Object,
    items: number[]
  },
  isFetchingDetails: boolean,
  detailsFetchError: Object,
  isDeleting: Array<boolean>,
  isPatching: Array<boolean>,
};
