"use client";

import { useEffect, useState } from "react";

type Activity = { visitors: number; online: number };
const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

export default function LiveActivity() {
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const response = await fetch("/api/analytics", { cache: "no-store" });
        if (!response.ok) throw new Error("Activity unavailable");
        const data = await response.json();
        if (active && Number.isFinite(data.visitors) && Number.isFinite(data.online)) {
          setActivity({ visitors: data.visitors, online: data.online });
        }
      } catch {
        if (active) setActivity(null);
      }
    };
    void refresh();
    const timer = window.setInterval(() => {
      if (!document.hidden) void refresh();
    }, 60_000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);

  return (
    <p className="live-activity" aria-live="polite" aria-label={activity
      ? `${activity.visitors.toLocaleString()} visitors, ${activity.online} viewing now`
      : "Live visitor activity"}>
      <span className="live-activity-dot" aria-hidden="true" />
      {activity ? <>
        <span className="desktop-live-number live-visitors">{activity.visitors.toLocaleString()} visitors</span>
        <span className="desktop-live-number live-separator" aria-hidden="true">·</span>
        <span className="desktop-live-number live-now">{activity.online} viewing now</span>
        <span className="mobile-live-number"><span className="live-now">{activity.online} live</span><span> · {compact.format(activity.visitors)} visitors</span></span>
      </> : <span className="live-visitors">Live activity</span>}
    </p>
  );
}
