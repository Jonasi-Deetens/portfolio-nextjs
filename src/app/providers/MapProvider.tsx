"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useCharacter } from "./CharacterProvider";
import { SMap, STile } from "../types/types";

interface MapContextType {
  currentMap: SMap | null;
  visibleTiles: (STile | null)[][];
  switchMap: (mapId: number) => void;
  VIEWPORT_SIZE: number;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

const VIEWPORT_SIZE = 9;

export function MapProvider({ children }: { children: ReactNode }) {
  const { selectedCharacter } = useCharacter();
  const [currentMap, setCurrentMap] = useState<SMap | null>(null);
  const [visibleTiles, setVisibleTiles] = useState<(STile | null)[][]>([]);

  useEffect(() => {
    if (selectedCharacter?.playthrough?.maps?.[0]) {
      setCurrentMap(selectedCharacter.playthrough.maps[0]);
    }
  }, [selectedCharacter]);

  useEffect(() => {
    if (currentMap?.tiles && selectedCharacter?.tile) {
      const playerX = selectedCharacter.tile.x;
      const playerY = selectedCharacter.tile.y;
      const radius = Math.floor(VIEWPORT_SIZE / 2);

      const generateVisibleTiles = () => {
        const tiles: (STile | null)[][] = [];

        for (let dy = -radius; dy <= radius; dy++) {
          const row: (STile | null)[] = [];
          for (let dx = -radius; dx <= radius; dx++) {
            const x = playerX + dx;
            const y = playerY + dy;

            if (
              x >= 0 &&
              x < currentMap.width &&
              y >= 0 &&
              y < currentMap.height
            ) {
              const currentTile = currentMap.tiles.find(
                (t) => t.x === x && t.y === y
              );
              if (currentTile) {
                row.push(currentTile);
              }
            } else {
              row.push(null);
            }
          }
          if (row) tiles.push(row);
        }

        setVisibleTiles(tiles);
      };

      generateVisibleTiles();
    }
  }, [currentMap, selectedCharacter?.tile]);

  const switchMap = (mapId: number) => {
    const newMap = selectedCharacter?.playthrough?.maps.find(
      (m) => m.id === mapId
    );
    if (newMap) {
      setCurrentMap(newMap);
    }
  };

  return (
    <MapContext.Provider
      value={{
        currentMap,
        visibleTiles,
        switchMap,
        VIEWPORT_SIZE,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
}
