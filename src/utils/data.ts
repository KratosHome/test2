import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";

export const DateUtil = dayjs;

DateUtil.extend(timezone);
DateUtil.extend(relativeTime);
DateUtil.extend(calendar);
DateUtil.extend(localizedFormat);

export type DayjsCalendar = {
  // The same day ( Today at 2:30 AM )
  sameDay: string;
  // The next day ( Tomorrow at 2:30 AM )
  nextDay: string;
  // The next week ( Sunday at 2:30 AM )
  nextWeek: string;
  // The day before ( Yesterday at 2:30 AM )
  lastDay: string;
  // Last week ( Last Monday at 2:30 AM )
  lastWeek: string;
  // Everything else ( 17/10/2011 )
  sameElse: string;
};

declare module "dayjs" {
  interface Dayjs {
    calendar(
      referenceTime?: ConfigType,
      formats?: Partial<DayjsCalendar>,
    ): string;
  }
}
