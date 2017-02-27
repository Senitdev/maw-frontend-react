interface Relation {
  id: number;
  hostMediaId: number;
  guestMediaId: number;
  boxLeft: number;
  boxTop: number;
  boxwidth: number;
  boxHeight: number;
  guestLeft: number;
  guestTop: number;
  guestwidth: number;
  guestHeight: number;
  startTimeOffset: number;
  duration: number;
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
  FILE: {
    key: 'file',
    name: 'Fichiers',
  },
  AGENDA: {
    key: 'agenda',
    name: 'Agendas',
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
  deleteError: Object,
  isPatching: Array<boolean>,
};
