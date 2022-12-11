import { useCallback, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { TrackManager } from "./helpers/track-manager";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const trackManager = new TrackManager();

const formSchema = yup.object({
  title: yup.string().min(2).required(),
  minutes: yup
    .string()
    .required()
    .test(
      "valid-duration",
      "Must be a number or 'lightning'",
      (value) => !!value && (/^\d+$/.test(value) || value === "lightning")
    ),
});

export function TrackView() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });
  const [timelineLog, setTimeLogs] = useState(trackManager.timelineLog());

  const onSubmit = useCallback(
    (data: FieldValues) => {
      trackManager.addTalk({ title: data.title, duration: data.minutes });
      setTimeLogs(trackManager.timelineLog());
      reset();
    },
    [reset]
  );

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white flex items-center gap-5 px-5 py-3 rounded-lg"
      >
        <label
          htmlFor=""
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Talk title
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register("title", { required: true, minLength: 6 })}
          />
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
            {errors.title?.message as string}
          </p>
        </label>
        <label
          htmlFor=""
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Mins
          <input
            type="text"
            {...register("minutes", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
            {errors.minutes?.message as string}
          </p>
        </label>
        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
          Add
        </button>
      </form>
      <div className="mt-9 bg-gray-700 rounded-lg p-4 text-white">
        <ul>
          {timelineLog.map((task, index) => (
            <li key={index}>{task}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
