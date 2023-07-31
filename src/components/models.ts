export interface Gif {
  type: string;
  id: string;
  url: string;
  images: {
    original: {
      url: string;
      width: string;
      height: string;
    };
    fixed_height: {
      url: string;
      width: string;
      height: string;
    };
    fixed_width: {
      url: string;
      width: string;
      height: string;
    };
  };
}