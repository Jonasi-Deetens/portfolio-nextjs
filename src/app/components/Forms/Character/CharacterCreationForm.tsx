"use client";

import { FC } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { trpc } from "../../../../utils/trpc";

interface CharacterFormValues {
  name: string;
  class: string;
  strength: number;
  agility: number;
  intellect: number;
  charisma: number;
  luck: number;
  userId: string;
  storyTemplateId: number;
}

const initialValues: CharacterFormValues = {
  name: "",
  class: "",
  strength: 5,
  agility: 5,
  intellect: 5,
  charisma: 5,
  luck: 5,
  storyTemplateId: 0,
  userId: "5ae8a3cd-1e79-4f6d-b685-45fe96a9e6e8",
};

const validationSchema = Yup.object({
  name: Yup.string().min(2).max(32).required("Name is required"),
  class: Yup.string()
    .oneOf(["Warrior", "Rogue", "Mage"])
    .required("Class is required"),
  strength: Yup.number().min(1).max(20).required(),
  agility: Yup.number().min(1).max(20).required(),
  intellect: Yup.number().min(1).max(20).required(),
  charisma: Yup.number().min(1).max(20).required(),
  luck: Yup.number().min(1).max(20).required(),
});

export const CharacterCreationForm: FC = () => {
  const createCharacter = trpc.character.createCharacter.useMutation();
  const storieTemplatesQuery = trpc.story.getStoryTemplates.useQuery();
  const storieTemplates = storieTemplatesQuery.data;

  const handleSubmit = async (values: CharacterFormValues) => {
    try {
      const data = await createCharacter.mutateAsync({
        ...values,
        storyTemplateId: +values.storyTemplateId || 0,
      });
      console.log("Character created:", data);
    } catch (error) {
      console.error("TRPC error:", error);
    }
  };

  return (
    <div className="relative max-w-md w-full bg-black/60 dark:bg-black/80 backdrop-blur-lg rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] p-8 border border-white/10 mt-8 mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6 text-center drop-shadow">
        🛡️ Character Creation
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="space-y-6 text-white">
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Name
            </label>
            <Field
              name="name"
              className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-400 text-sm mt-1"
            />
          </div>

          <div>
            <label htmlFor="class" className="block font-medium mb-1">
              Class
            </label>
            <Field
              as="select"
              name="class"
              className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="">Select a class</option>
              <option value="Warrior">Warrior</option>
              <option value="Rogue">Rogue</option>
              <option value="Mage">Mage</option>
            </Field>
            <ErrorMessage
              name="class"
              component="div"
              className="text-red-400 text-sm mt-1"
            />
          </div>

          <div>
            <label htmlFor="story" className="block font-medium mb-1">
              Story
            </label>
            <Field
              as="select"
              name="storyTemplateId"
              className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="">Select a story</option>
              {storieTemplates?.map((story) => (
                <option key={`story-${story.id}`} value={story.id}>
                  {story.name}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="class"
              component="div"
              className="text-red-400 text-sm mt-1"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="strength" className="block mb-1 font-medium">
                Strength
              </label>
              <Field
                type="number"
                name="strength"
                className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            <div>
              <label htmlFor="agility" className="block mb-1 font-medium">
                Agility
              </label>
              <Field
                type="number"
                name="agility"
                className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            <div>
              <label htmlFor="intellect" className="block mb-1 font-medium">
                Intellect
              </label>
              <Field
                type="number"
                name="intellect"
                className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-white/70 hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/20 border border-gray-300 dark:border-white/20 rounded-xl transition-all duration-150 text-lg font-medium text-gray-900 dark:text-white shadow-inner hover:shadow-lg"
          >
            Create Character
          </button>
        </Form>
      </Formik>
    </div>
  );
};
