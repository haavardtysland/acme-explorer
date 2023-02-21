export type Picture = {
  name: string;
  description: string;
  img: Image;
};

export type Image = {
  data: object;
  contentType: string;
};
