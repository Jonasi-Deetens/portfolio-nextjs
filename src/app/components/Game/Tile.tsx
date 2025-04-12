import { memo } from 'react';
import { STile } from '../../types/types';
import {
  Trees,
  Mountain,
  Circle,
  BoxIcon,
  User,
  EarthIcon,
  DropletIcon,
  DoorClosedIcon,
  WavesLadderIcon,
} from 'lucide-react';

const tileTypeToIcon = {
  GRASS: EarthIcon,
  WATER: DropletIcon,
  SAND: Circle,
  MOUNTAIN: Mountain,
  FOREST: Trees,
  ROAD: Circle,
  WALL: BoxIcon,
  STAIRS_UP: WavesLadderIcon,
  STAIRS_DOWN: BoxIcon,
  //   CAVE_FLOOR: Circle,
  CAVE_WALL: BoxIcon,
  CHEST: BoxIcon,
  CONTAINER: BoxIcon,
  DOOR: BoxIcon,
  STORAGE: BoxIcon,
  TABLE: BoxIcon,
  TRAP: BoxIcon,
  TREE: Trees,
  ROCK: BoxIcon,
  HOUSE: BoxIcon,
  PORTAL: BoxIcon,
  SIGN: BoxIcon,
  SHRINE: BoxIcon,
  STATUE: BoxIcon,
  WEAPON: BoxIcon,
  FOUNTAIN: BoxIcon,
  BED: BoxIcon,
  BOOKSHELF: BoxIcon,
  ARMOR: BoxIcon,
  POTION: BoxIcon,
  SCROLL: BoxIcon,
  ACCESSORY: BoxIcon,
  ITEM: BoxIcon,
  CONSUMABLE: BoxIcon,
  MISC: BoxIcon,
  KEY: BoxIcon,
  GEM: BoxIcon,
  PAPER: BoxIcon,
  BOOK: BoxIcon,
  QUEST_ITEM: BoxIcon,
  CURRENCY: BoxIcon,
  FURNITURE: EarthIcon,
  CRAFTING_STATION: BoxIcon,
  WORKBENCH: BoxIcon,
  FORGE: BoxIcon,
  SMITHY: BoxIcon,
  ALCHEMY_STATION: BoxIcon,
  TANNERY: BoxIcon,
  DECORATION: BoxIcon,
  SHOP: BoxIcon,
  INN: BoxIcon,
  TAVERN: BoxIcon,
  BARRACKS: BoxIcon,
  TEMPLE: BoxIcon,
  LEVER: BoxIcon,
  BUTTON: BoxIcon,
  LIGHT_SOURCE: BoxIcon,
  DOORWAY: DoorClosedIcon,
};

const Tile = memo(
  ({ tile, isPlayer, className }: { tile: STile | null; isPlayer: boolean; className: string }) => {
    if (!tile) {
      return <div className={`${className} relative`} />;
    }

    if (tile.id === 166) console.log(tile);
    const IconComponent = isPlayer
      ? User
      : tileTypeToIcon[tile.objects?.[0]?.object.type || tile.type];

    return (
      <div className={`${className} relative`}>
        {IconComponent && (
          <div
            className={`absolute inset-0 flex items-center justify-center ${
              isPlayer ? 'transition-transform duration-200 ease-in-out' : ''
            }`}
          >
            <IconComponent className={`w-5 h-5 ${isPlayer ? 'text-blue-400' : ''}`} />
          </div>
        )}
      </div>
    );
  }
);

Tile.displayName = 'Tile';

export default Tile;
