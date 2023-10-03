export type Pixel = {
  user: string;
  color: string;
};

export type PixelPosition = `${number}-${number}`;

export type Pixels = Record<PixelPosition, Pixel>;
