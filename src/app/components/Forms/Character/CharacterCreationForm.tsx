'use client';

import { FC } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { trpc } from '../../../../utils/trpc';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '../../Elements/Buttons/Button';
import { FormikSelect } from '../../Elements/Formik/FormikSelect';
import { FormikStatControls } from '../../Elements/Formik/FormikStatControls';

export const CLASS_OPTIONS = [
  { label: 'Warrior', value: 'Warrior' },
  { label: 'Rogue', value: 'Rogue' },
  { label: 'Mage', value: 'Mage' },
];

const validationSchema = Yup.object({
  name: Yup.string().min(2).max(32).required('Name is required'),
  classId: Yup.number().min(1).required('Class is required'),
  storyTemplateId: Yup.number().min(1).required('Story is required'),
  strength: Yup.number().min(1).max(20).required(),
  agility: Yup.number().min(1).max(20).required(),
  intelligence: Yup.number().min(1).max(20).required(),
  charisma: Yup.number().min(1).max(20).required(),
  luck: Yup.number().min(1).max(20).required(),
});

export const CharacterCreationForm: FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const createCharacter = trpc.character.createCharacter.useMutation();
  const { data: classes } = trpc.class.getAll.useQuery();
  const { data: storyTemplates } = trpc.story.getStoryTemplates.useQuery();

  const initialValues = {
    name: '',
    classId: 1,
    storyTemplateId: storyTemplates?.[0]?.id || 0,
    strength: 8,
    agility: 4,
    intelligence: 2,
    charisma: 3,
    luck: 3,
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (!session?.user?.id) throw new Error('User not authenticated');
      const character = await createCharacter.mutateAsync({
        ...values,
        userId: session.user.id,
        storyTemplateId: +values.storyTemplateId,
      });

      localStorage.setItem('selectedCharacterId', String(character?.characterId));

      router.push('/character-select');
    } catch (err) {
      console.error('Character creation failed:', err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white/60 dark:bg-black/70 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg text-white">
      <h1 className="text-3xl font-bold text-center mb-8">🛡️ Create Your Hero</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        <Form className="space-y-6">
          <div>
            <label htmlFor="name" className="block font-semibold mb-1">
              Name
            </label>
            <Field
              name="name"
              className="w-full bg-white/70 hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/20 
            border border-gray-300 dark:border-white/20 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <ErrorMessage name="name" className="text-red-400 text-sm mt-1" component="div" />
          </div>

          <div>
            <FormikSelect
              name="classId"
              label="Class"
              options={
                classes
                  ? classes.map((cls) => ({
                      label: cls.name,
                      value: cls.id,
                    }))
                  : []
              }
            />
          </div>

          <div>
            <FormikSelect
              name="storyTemplateId"
              label="Story"
              options={
                storyTemplates?.map((story) => ({
                  label: story.name,
                  value: story.id,
                })) ?? []
              }
            />
          </div>

          <div>
            <FormikStatControls />
          </div>

          <Button className="w-full py-3 bg-white/80 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20 border border-white/20 text-gray-900 dark:text-white rounded-xl font-medium transition-all shadow-inner hover:shadow-xl">
            Create Character
          </Button>
        </Form>
      </Formik>
    </div>
  );
};
