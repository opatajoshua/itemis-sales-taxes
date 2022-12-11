import { SessionType, TrackManager } from "./track-manager";

test("track-manager can create new track", () => {
  const trackManager = new TrackManager();
  // track list should be empty
  expect(trackManager.tracks.length).toStrictEqual(0);
  trackManager.addTalk({ title: "Some Hello World", duration: "lightning" });
  // track list should be one now
  expect(trackManager.tracks.length).toStrictEqual(1);
});

test("track-manager sessions can contain multiple talks", () => {
  const trackManager = new TrackManager();

  trackManager.addTalk({ title: "talk one (half of morning)", duration: 90 });
  trackManager.addTalk({
    title: "talk two (almost consumes remaining morning talks)",
    duration: 80,
  });
  trackManager.addTalk({
    title: "Should be forced into afternoon",
    duration: 30,
  });
  trackManager.addTalk({ title: "Should go into afternoon", duration: 30 });
  trackManager.addTalk({ title: "Third afternoon talk", duration: 40 });
  // morning session should have 2 talks
  expect(trackManager.tracks[0].morningSession.talks.length).toStrictEqual(2);
  expect(trackManager.tracks[0].afternoonSession.talks.length).toStrictEqual(3);
});

test("track-manager makes use of all available spaces", () => {
  const trackManager = new TrackManager();

  // add and test track one morning talks
  trackManager.addTalk({ title: "Takes half of morning", duration: 90 });
  trackManager.addTalk({
    title: "Leaves 10 mins for a small talk",
    duration: 80,
  });
  expect(trackManager.tracks[0].morningSession.talks.length).toStrictEqual(2);
  expect(trackManager.tracks[0].morningSession.remainingSlot).toStrictEqual(10);

  // add and test track one afternoon talks
  trackManager.addTalk({
    title: "Bigger than remaining morning space left",
    duration: 30,
  });
  trackManager.addTalk({
    title: "Take all remaining afternoon space",
    duration: 210,
  });
  expect(trackManager.tracks[0].afternoonSession.talks.length).toStrictEqual(2);
  expect(trackManager.tracks[0].afternoonSession.remainingSlot).toStrictEqual(
    0
  );

  // add and test track two morning talks
  trackManager.addTalk({
    title: "Go to Track 2 morning session",
    duration: 210,
  });
  expect(trackManager.tracks[1]).toBeTruthy();
  // this recent talk should go into afternoon session for track two
  expect(trackManager.tracks[1].morningSession.talks.length).toStrictEqual(0);
  expect(trackManager.tracks[1].afternoonSession.talks.length).toStrictEqual(1);

  // track one morning has some 10 mins space so we expect it to consume this 10 min talks
  trackManager.addTalk({
    title: "Should fit into track 1 morning",
    duration: 10,
  });
  // track one morning session should now have 3 talks instead of 2 talks
  expect(trackManager.tracks[0].morningSession.talks.length).toStrictEqual(3);
  // track one morning session's third talk should be the recent talk we added
  expect(trackManager.tracks[0].morningSession.talks[2].title).toStrictEqual(
    "Should fit into track 1 morning"
  );
});

test("full sessions are removed from available list", () => {
  const trackManager = new TrackManager();

  trackManager.addTalk({ title: "talk one (half of morning)", duration: 90 });
  trackManager.addTalk({
    title: "talk two (almost consumes remaining morning talks)",
    duration: 80,
  });
  trackManager.addTalk({
    title: "Should be forced into afternoon",
    duration: 30,
  });
  trackManager.addTalk({ title: "Should go into afternoon", duration: 30 });
  expect(trackManager.availableSessions.length).toStrictEqual(2);
  trackManager.addTalk({ title: "Third afternoon talk", duration: 10 });
  // morning session should be removed from available list
  expect(trackManager.availableSessions.length).toStrictEqual(1);
  expect(trackManager.availableSessions[0].sessionType).toStrictEqual(
    SessionType.afternoon
  );
});

test("prints correct allocated time for talks, lunch, and networking", () => {
  const trackManager = new TrackManager();

  expect(
    trackManager.addTalk({
      title: "Writing Fast Tests Against Enterprise Rails",
      duration: 60,
    }).allocatedTime
  ).toStrictEqual("09:00AM");

  expect(
    trackManager.addTalk({
      title: "Overdoing it in Python",
      duration: 45,
    }).allocatedTime
  ).toStrictEqual("10:00AM");

  expect(
    trackManager.addTalk({
      title: "Lua for the Masses",
      duration: 30,
    }).allocatedTime
  ).toStrictEqual("10:45AM");

  expect(
    trackManager.addTalk({
      title: "Ruby Errors from Mismatched Gem Versions",
      duration: 45,
    }).allocatedTime
  ).toStrictEqual("11:15AM");

  expect(
    trackManager.addTalk({
      title: "Ruby on Rails: Why We Should Move On ",
      duration: 60,
    }).allocatedTime
  ).toStrictEqual("01:00PM");

  expect(
    trackManager.addTalk({
      title: "Common Ruby Errors",
      duration: 45,
    }).allocatedTime
  ).toStrictEqual("02:00PM");

  expect(
    trackManager.addTalk({
      title: "Pair Programming vs Noise",
      duration: 45,
    }).allocatedTime
  ).toStrictEqual("02:45PM");

  expect(
    trackManager.addTalk({
      title: "Programming in the Boondocks of Seattle",
      duration: 30,
    }).allocatedTime
  ).toStrictEqual("03:30PM");

  expect(
    trackManager.addTalk({
      title: "Ruby vs. Clojure for Back-End Development",
      duration: 30,
    }).allocatedTime
  ).toStrictEqual("04:00PM");

  expect(
    trackManager.addTalk({
      title: "User Interface CSS in Rails Apps",
      duration: 30,
    }).allocatedTime
  ).toStrictEqual("04:30PM");

  expect(trackManager.tracks[0].networkingStart).toStrictEqual("05:00PM");

  expect(
    trackManager.addTalk({
      title: "Communicating Over Distance",
      duration: 60,
    }).allocatedTime
  ).toStrictEqual("09:00AM");

  expect(
    trackManager.addTalk({
      title: "Rails Magic",
      duration: 60,
    }).allocatedTime
  ).toStrictEqual("10:00AM");

  expect(
    trackManager.addTalk({
      title: "Woah",
      duration: 30,
    }).allocatedTime
  ).toStrictEqual("11:00AM");
});

test("prints correct timeline of events", () => {
  const trackManager = new TrackManager();
  trackManager.addTalk({
    title: "Writing Fast Tests Against Enterprise Rails",
    duration: 60,
  });

  trackManager.addTalk({
    title: "Overdoing it in Python",
    duration: 45,
  });

  trackManager.addTalk({
    title: "Lua for the Masses",
    duration: 30,
  });

  trackManager.addTalk({
    title: "Ruby Errors from Mismatched Gem Versions",
    duration: 45,
  });

  trackManager.addTalk({
    title: "Common Ruby Errors",
    duration: 45,
  });

  trackManager.addTalk({
    title: "Rails for Python Developers",
    duration: "lightning",
  });

  trackManager.addTalk({
    title: "Communicating Over Distance",
    duration: 60,
  });

  trackManager.addTalk({
    title: "Accounting-Driven Development ",
    duration: 45,
  });

  trackManager.addTalk({
    title: "Woah",
    duration: 30,
  });

  trackManager.addTalk({
    title: "Sit Down and Write",
    duration: 30,
  });

  trackManager.addTalk({
    title: "Pair Programming vs Noise",
    duration: 45,
  });

  trackManager.addTalk({
    title: "Rails Magic",
    duration: 60,
  });

  trackManager.addTalk({
    title: "Ruby on Rails: Why We Should Move On",
    duration: 60,
  });

  trackManager.addTalk({
    title: "Clojure Ate Scala (on my project)",
    duration: 45,
  });

  trackManager.addTalk({
    title: "Programming in the Boondocks of Seattle",
    duration: 30,
  });

  trackManager.addTalk({
    title: "Ruby vs. Clojure for Back-End Development",
    duration: 30,
  });

  trackManager.addTalk({
    title: "Ruby on Rails Legacy App Maintenance",
    duration: 60,
  });

  trackManager.addTalk({
    title: "A World Without HackerNews",
    duration: 30,
  });

  trackManager.addTalk({
    title: "User Interface CSS in Rails Apps",
    duration: 30,
  });

  expect(trackManager.timelineLog()).toEqual([
    "> Track 1:",
    "> 09:00AM Writing Fast Tests Against Enterprise Rails 60min",
    "> 10:00AM Overdoing it in Python 45min",
    "> 10:45AM Lua for the Masses 30min",
    "> 11:15AM Ruby Errors from Mismatched Gem Versions 45min",
    "> 12:00PM Lunch",
    "> 01:00PM Common Ruby Errors 45min",
    "> 01:45PM Rails for Python Developers lightning",
    "> 01:50PM Communicating Over Distance 60min",
    "> 02:50PM Accounting-Driven Development  45min",
    "> 03:35PM Woah 30min",
    "> 04:05PM Sit Down and Write 30min",
    "> 05:00PM Networking Event",
    ">",
    "> Track 2:",
    "> 09:00AM Pair Programming vs Noise 45min",
    "> 09:45AM Rails Magic 60min",
    "> 10:45AM Ruby on Rails: Why We Should Move On 60min",
    "> 12:00PM Lunch",
    "> 01:00PM Clojure Ate Scala (on my project) 45min",
    "> 01:45PM Programming in the Boondocks of Seattle 30min",
    "> 02:15PM Ruby vs. Clojure for Back-End Development 30min",
    "> 02:45PM Ruby on Rails Legacy App Maintenance 60min",
    "> 03:45PM A World Without HackerNews 30min",
    "> 04:15PM User Interface CSS in Rails Apps 30min",
    "> 05:00PM Networking Event",
  ]);
});
