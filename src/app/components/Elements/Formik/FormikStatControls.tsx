'use client';

import { useFormikContext } from 'formik';
import { CharacterCreateValues } from '../../../types/types';
import { useEffect, useRef } from 'react';

export const CLASS_BASE_STATS: Record<string, Record<string, number>> = {
  Warrior: {
    strength: 8,
    agility: 4,
    intelligence: 2,
    charisma: 3,
    luck: 3,
  },
  Rogue: {
    strength: 4,
    agility: 7,
    intelligence: 4,
    charisma: 2,
    luck: 3,
  },
  Mage: {
    strength: 2,
    agility: 3,
    intelligence: 8,
    charisma: 4,
    luck: 3,
  },
};

export const STAT_FIELDS = ['strength', 'agility', 'intelligence', 'charisma', 'luck'] as const;

export const STAT_POINT_POOL = 20;

export const FormikStatControls = () => {
  const formik = useFormikContext<CharacterCreateValues>();
  const selectedClass = formik.values.class;
  const baseStats = CLASS_BASE_STATS[selectedClass] ?? {};

  const assignedPoints = STAT_FIELDS.reduce((total, stat) => {
    const base = baseStats[stat] ?? 0;
    const current = formik.values[stat];
    return total + (current - base);
  }, 0);

  const pointsRemaining = STAT_POINT_POOL - assignedPoints;
  const previousClass = useRef<string | null>(null);

  useEffect(() => {
    const currentClass = formik.values.class;

    if (currentClass !== previousClass.current) {
      const newBase = CLASS_BASE_STATS[currentClass];

      if (newBase) {
        STAT_FIELDS.forEach((stat) => {
          formik.setFieldValue(stat, newBase[stat]);
        });
      }

      previousClass.current = currentClass;
    }
  }, [formik.values.class, formik]);

  const handleChange = (stat: (typeof STAT_FIELDS)[number], direction: 'up' | 'down') => {
    const base = baseStats[stat];
    const current = formik.values[stat];

    if (direction === 'up') {
      if (pointsRemaining <= 0 || current >= 20) return;
      formik.setFieldValue(stat, current + 1);
    }

    if (direction === 'down') {
      if (current <= base) return;
      formik.setFieldValue(stat, current - 1);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full">
      <p className="text-white text-sm text-center mb-4">
        Points remaining: <span className="font-semibold">{pointsRemaining}</span>
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {STAT_FIELDS.map((stat) => {
          const value = formik.values[stat];
          const base = baseStats[stat] ?? 0;

          return (
            <div key={stat} className="flex flex-col items-center">
              <label className="capitalize text-sm mb-1">{stat}</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleChange(stat, 'down')}
                  disabled={value <= base}
                  className="bg-white/10 text-white px-2 py-1 rounded-lg border border-white/20 disabled:opacity-30 w-8 h-8"
                >
                  –
                </button>

                <span className="w-8 text-center text-white font-medium">{value}</span>

                <button
                  type="button"
                  onClick={() => handleChange(stat, 'up')}
                  disabled={pointsRemaining <= 0 || value >= 20}
                  className="bg-white/10 text-white px-2 py-1 rounded-lg border border-white/20 disabled:opacity-30 w-8 h-8"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
