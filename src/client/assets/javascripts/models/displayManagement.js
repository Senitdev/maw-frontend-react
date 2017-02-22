interface Media {
  id: number;
  type: string;
  name: string;
  createdAt: Date;
}

interface File extends Media {

}

interface Image extends Media {

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
  PLANNING: {
    key: 'planning',
    name: 'Plannings',
  },
};

export type State = {
  mediaById: Array<Media>,
  mediaByType: {[key: string]: {
    isFetching: boolean,
    didInvalidate: boolean,
    items: number[]
  }},
};
