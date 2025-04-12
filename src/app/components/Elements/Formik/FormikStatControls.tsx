'use client';

import { useField, useFormikContext } from 'formik';
import { CharacterCreateValues, SCharacterClass } from '../../../types/types';
import { useEffect, useState } from 'react';
import { trpc } from '../../../../utils/trpc';
import { Button } from '../Buttons/Button';

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

export const STAT_POINT_POOL = 40;

export const FormikStatControls = () => {
  const formik = useFormikContext<CharacterCreateValues>();
  const [selectedClassField] = useField<number>('classId');
  const selectedClass = selectedClassField.value;
  const [baseStats, setBaseStats] = useState<Record<string, number>>({});
  const [assignedPoints, setAssignedPoints] = useState(0);

  const classId = selectedClass;
  console.log('classId', classId);
  const classQuery = trpc.class.getClassById.useQuery(
    { id: selectedClass },
    { enabled: !!selectedClass }
  );
  const classData: SCharacterClass | null | undefined = classQuery.data;

  useEffect(() => {
    setBaseStats(CLASS_BASE_STATS[classData?.name ?? '']);
  }, [classData?.name]);

  useEffect(() => {
    if (!baseStats) return;
    STAT_FIELDS.forEach((stat) => {
      formik.setFieldValue(stat, baseStats[stat]);
    });
  }, [baseStats]);

  useEffect(() => {
    const points = STAT_FIELDS.reduce((total, stat) => {
      const current = formik.values[stat];
      return total + current;
    }, 0);
    setAssignedPoints(points);
  }, [formik.values]);

  const pointsRemaining = STAT_POINT_POOL - assignedPoints;

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
          const base = baseStats?.[stat] ?? 0;

          return (
            <div key={stat} className="flex flex-col items-center">
              <label className="capitalize text-sm mb-1">{stat}</label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => handleChange(stat, 'down')}
                  disabled={value <= base}
                  className="bg-white/10 text-white px-2 py-1 rounded-lg border border-white/20 disabled:opacity-30 w-8 h-8"
                >
                  –
                </Button>

                <span className="w-8 text-center text-white font-medium">{value}</span>

                <Button
                  type="button"
                  onClick={() => handleChange(stat, 'up')}
                  disabled={pointsRemaining <= 0 || value >= 20}
                  className="bg-white/10 text-white px-2 py-1 rounded-lg border border-white/20 disabled:opacity-30 w-8 h-8"
                >
                  +
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
