import { useCallback, useEffect, useState, ReactElement } from "react";
import { Pixel, PixelPosition, Pixels } from "../models/Pixel";

type Props = {
  distantPixels: Pixels;
  user: string;
  color: string;
  updatePixel: (position: string) => {};
};

type CurrentPixel = Pixel & {
  position: PixelPosition;
};

const DEFAULT_PIXEL: Pixel = {
  user: "",
  color: "white",
};
export const PixelGrid = ({
  distantPixels,
  user,
  color,
  updatePixel,
}: Props) => {
  const [elementsGrid, setElementsGrid] = useState<ReactElement[][]>([]);
  const [currentPixel, setCurrentPixel] = useState<CurrentPixel | null>(null);

  const renderPixel = useCallback(
    (pixel: Pixel, position: PixelPosition): ReactElement => {
      return (
        <div
          style={{
            height: 10,
            width: 10,
            backgroundColor: pixel.color,
            border:
              pixel.color === DEFAULT_PIXEL.color
                ? "1px solid #e6e6e6"
                : "1px solid transparent",
          }}
          onClick={() => {
            updatePixel(position);
            setCurrentPixel({ user, color, position });
          }}
          onMouseEnter={() => {
            setCurrentPixel({ ...pixel, position });
          }}
          onMouseLeave={() => setCurrentPixel(null)}
        />
      );
    },
    [updatePixel, user, color],
  );

  useEffect(() => {
    const pixelsElements: ReactElement[][] = [];
    for (let i = 0; i < 50; i++) {
      pixelsElements[i] = [];
      for (let j = 0; j < 50; j++) {
        const position: PixelPosition = `${i}-${j}`;
        pixelsElements[i].push(
          renderPixel(
            !!distantPixels[position] ? distantPixels[position] : DEFAULT_PIXEL,
            position,
          ),
        );
      }
    }
    setElementsGrid(pixelsElements);
  }, [distantPixels, renderPixel]);

  return (
    <div>
      <p>
        {currentPixel
          ? `User : ${currentPixel.user}, Color: ${currentPixel.color}, Position: ${currentPixel.position}`
          : "Hover over a pixel to see its details"}
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {elementsGrid.map((line) => {
          return (
            <div style={{ display: "flex", flexDirection: "row" }}>{line}</div>
          );
        })}
      </div>
    </div>
  );
};
