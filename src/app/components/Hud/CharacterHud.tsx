import { FC, JSX } from 'react';
import StatBar from './StatBar';
import { Heart, Flame, Droplet, Star, Swords, Shield, Sparkles, Skull } from 'lucide-react';
import { useCharacter } from '../../providers/CharacterProvider';
import { ResourceType } from '../../types/types';

const CharacterHUD: FC = () => {
  const { selectedCharacter } = useCharacter();

  if (!selectedCharacter || !selectedCharacter.stat) return null;

  const { name, stat } = selectedCharacter;
  const { level, hp, maxHp, intelligence, strength, agility } = stat;
  console.log('selectedCharacter', selectedCharacter);
  const characterClass = selectedCharacter.class;

  const resourceType: ResourceType =
    intelligence >= strength ? 'mana' : strength > agility ? 'rage' : 'energy';
  const maxResourceType: ResourceType =
    resourceType === 'mana' ? 'maxMana' : resourceType === 'rage' ? 'maxRage' : 'maxEnergy';
  const currentResource = selectedCharacter.stat[resourceType];
  const maxResource = selectedCharacter.stat[maxResourceType];

  const statusEffects = ['Burning', 'Shielded'];
  const effectIcons: Record<string, JSX.Element> = {
    Burning: <Flame className="text-red-500 w-4 h-4" aria-label="Burning" />,
    Shielded: <Shield className="text-blue-300 w-4 h-4" aria-label="Shielded" />,
    Blessed: <Sparkles className="text-yellow-300 w-4 h-4" aria-label="Blessed" />,
    Cursed: <Skull className="text-purple-400 w-4 h-4" aria-label="Cursed" />,
  };

  return (
    <div className="fixed top-4 left-4 z-50 bg-black/70 text-white rounded-xl p-4 border border-white/10 shadow-lg w-80 space-y-4 max-w-full sm:max-w-md">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-sm text-white/60">
            Level {level}{' '}
            <span className="ml-2 text-xs text-white/40">
              ({characterClass.name || 'Adventurer'})
            </span>
          </p>
        </div>
        <Star className="w-6 h-6 text-yellow-300" />
      </div>

      <div className="w-full h-24 bg-white/10 rounded-md flex items-center justify-center border border-white/10">
        <Swords className="w-10 h-10 text-white/50" />
      </div>

      <StatBar
        label="HP"
        value={hp}
        max={maxHp}
        type="hp"
        icon={<Heart className="text-green-400 w-4 h-4" />}
        tooltip="Your current health"
      />

      <StatBar
        label={resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}
        value={currentResource}
        max={maxResource}
        type={resourceType}
        icon={<Droplet className="text-blue-400 w-4 h-4" />}
        tooltip={`Your current ${resourceType}`}
      />

      <StatBar
        label="XP"
        value={selectedCharacter.stat.xp}
        max={300}
        type="xp"
        icon={<Flame className="text-purple-400 w-4 h-4" />}
        tooltip="Experience points"
      />

      {statusEffects.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10 mt-2">
          {statusEffects.map((effect) => (
            <div
              key={effect}
              className="bg-white/10 px-2 py-1 rounded-md text-xs flex items-center gap-1"
              title={effect}
            >
              {effectIcons[effect]}
              <span>{effect}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterHUD;
