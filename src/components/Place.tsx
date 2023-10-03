import React, { useCallback, useState } from "react";
import axios from "axios";
import useAsyncEffect from "use-async-effect";
import { PixelPosition, Pixels } from "../models/Pixel";
import { PixelGrid } from "./Grid";

export const Place = () => {
  const [pseudo, setPseudo] = useState("");
  const [color, setColor] = useState("");
  const [distantPixels, setDistantPixels] = useState<Pixels | null>(null);

  const [allPixels, setAllPixels] = useState<Pixels>({});

  const refreshPixels = async () => {
    const result = await axios.get("http://localhost:8000/");
    setDistantPixels(result.data);
  };

  const initialPixels = () => {
    const initialPixels: Pixels = {};
    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < 50; j++) {
        const position: PixelPosition = `${i}-${j}`;
        allPixels[position] = { color: "white", user: "" };
      }
    }
    setAllPixels(initialPixels);
  };

  useAsyncEffect(async () => {
    await refreshPixels();
  }, []);

  const onPseudoInput: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setPseudo(event.target.value);
  };

  const onColorInput: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setColor(event.target.value);
  };

  const updatePixel = useCallback(
    async (position: string) => {
      try {
        await axios.post("http://localhost:8000", {
          coordinates: position,
          user: pseudo,
          color,
        });
        await refreshPixels();
      } catch (e) {
        console.log(e);
      }
    },
    [pseudo, color],
  );

  return (
    <>
      <h1>r/Place</h1>
      <div>
        <input
          placeholder={"User"}
          value={pseudo}
          onChange={onPseudoInput}
          style={{ marginRight: 20 }}
        />
        <input placeholder={"Color"} value={color} onChange={onColorInput} />
      </div>
      {distantPixels && (
        <PixelGrid
          distantPixels={distantPixels}
          color={color}
          user={pseudo}
          updatePixel={updatePixel}
        />
      )}
    </>
  );
};
