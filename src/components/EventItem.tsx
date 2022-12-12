import { TimelineEvent } from "../helpers/track-manager";
import { classNames } from "../helpers/utils";

export function EventItem({ event }: { event: TimelineEvent }) {
  return (
    <li className="mb-8 ml-4">
      <div
        className={classNames(
          "absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border",
          " border-white dark:border-gray-900 dark:bg-gray-700"
        )}
      ></div>
      <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
        {event.allocatedTime}
      </time>
      {event.type === "empty" ? (
        <div className="border-dashed border-2 p-5 bg-gray-100 rounded-md">
          <p className="capitalize text-gray-600">{event.title}</p>
          <span className="text-teal-500">{event.duration} mins</span>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
          {event.duration && (
            <p className=" text-sm font-normal text-gray-500 dark:text-gray-400 float-right">
              {event.duration} {event.duration === "lightning" ? "" : "mins"}
            </p>
          )}
        </>
      )}
    </li>
  );
}
