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

export type State = {
  mediaById: Array<Media>,
  mediaByType: {[key: string]: {
    isFetching: boolean,
    didInvalidate: boolean,
    items: number[]
  }},
};
