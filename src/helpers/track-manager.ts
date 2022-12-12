import moment, { Moment } from "moment";

interface Talk {
  title: string;
  /**
   * in minutes
   */
  duration: number | "lightning";
}

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

type ProcessedTalk = Talk & {
  allocatedTime: string;
};

export enum SessionType {
  morning="morning",
  afternoon="afternoon",
}

export type TimelineEvent = Optional<ProcessedTalk, "duration"> & { type?: "empty" };

interface TrackSession {
  talks: ProcessedTalk[];
  sessionType: SessionType;
  remainingSlot: number;
  lastTalkEnd: Moment;
}

const networkingEarliestStart = "16:00";
const timePrintFormat = "hh:mmA";

const remainingSlotToTimelineEvent = (session: TrackSession) => ({
  title: `${session.sessionType} slot left to be filled`,
  allocatedTime: session.lastTalkEnd.format(timePrintFormat),
  duration: session.remainingSlot,
  type:"empty"
} as TimelineEvent);

class Track {
  morningSession: TrackSession = {
    talks: [],
    sessionType: SessionType.morning,
    remainingSlot: 180,
    lastTalkEnd: moment("09:00 am", "h:mm a"),
  };
  afternoonSession: TrackSession = {
    talks: [],
    sessionType: SessionType.afternoon,
    remainingSlot: 240,
    lastTalkEnd: moment("01:00 pm", "h:mm a"),
  };
  get networkingStart() {
    return this.afternoonSession.lastTalkEnd.format("HH:mm") >
      networkingEarliestStart
      ? this.afternoonSession.lastTalkEnd.format(timePrintFormat)
      : networkingEarliestStart;
  }

  get timeline(): TimelineEvent[] {
    return [
      ...this.morningSession.talks,
      ...(this.morningSession.remainingSlot
        ? [remainingSlotToTimelineEvent(this.morningSession)]
        : []),
      { title: "Lunch", allocatedTime: "12:00PM" },
      ...this.afternoonSession.talks,
      ...(this.afternoonSession.remainingSlot
        ? [remainingSlotToTimelineEvent(this.afternoonSession)]
        : []),
      { title: "Networking Event", allocatedTime: "05:00PM" },
    ];
  }
}

export class TrackManager {
  tracks: Track[] = [];
  // currentTrack?: Track = undefined;
  availableSessions: TrackSession[] = [];

  /**
   * adds talk
   * @param talk
   */
  addTalk(talk: Talk): ProcessedTalk {
    const talkMinutes: number =
      talk.duration === "lightning" ? 5 : talk.duration;

    // sort slots for easily finding
    this.availableSessions.sort((a, b) => a.remainingSlot - b.remainingSlot);
    // find perfect slot
    let fittingSession = this.availableSessions.find(
      (session) => session.remainingSlot >= talkMinutes
    );
    if (!fittingSession) {
      const newTrack = new Track();
      this.tracks.push(newTrack);
      const newSessions = [newTrack.morningSession, newTrack.afternoonSession];
      this.availableSessions.push(...newSessions);
      fittingSession = newSessions.find(
        (session) => session.remainingSlot >= talkMinutes
      );
      if (!fittingSession)
        throw new Error("Talk minutes exceeds morning or afternoon slots");
    }

    const processedTalk = {
      ...talk,
      allocatedTime: fittingSession.lastTalkEnd.format(timePrintFormat),
    };
    // update fittingSession
    fittingSession.talks.push(processedTalk);
    fittingSession.remainingSlot -= talkMinutes;
    fittingSession.lastTalkEnd.add(talkMinutes, "minutes");

    // remove full sessions from available list to speed up finding
    if (fittingSession.remainingSlot === 0) {
      this.availableSessions.splice(
        this.availableSessions.indexOf(fittingSession),
        1
      );
    }

    return processedTalk;
  }

  /**
   * generate a string array of timeline just for printing
   * @returns
   */
  timelineLog(): string[] {
    return this.tracks.reduce((prev, track, index) => {
      prev.push(
        ...[
          ...(index !== 0 ? [">"] : []),
          `> Track ${index + 1}:`,
          ...track.timeline.filter(event=>event.type!=='empty').map(
            (talk) =>
              `> ${talk.allocatedTime} ${talk.title}${
                talk.duration
                  ? " " +
                    talk.duration +
                    (talk.duration === "lightning" ? "" : "min")
                  : ""
              }`
          ),
        ]
      );
      return prev;
    }, [] as string[]);
  }
}
