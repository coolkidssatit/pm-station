import React, { useMemo } from "react";
import { classNames } from "@station/client/utils";
import type { TrackResponse } from "@station/shared/schema/types";

type BadgeComponentProps = Pick<
  React.HTMLAttributes<HTMLElement>,
  "onClick" | "title" | "className" | "children"
>;

export type TrackThumbnailProps = {
  className: { wrapper: string; badge?: string; image?: string };
  badge?: {
    title: string;
    onClick?: () => void;
  };
  children?: React.ReactNode;
  track: Pick<TrackResponse, "albumImage" | "name" | "artists">;
};

export default function TrackThumbnail({
  className,
  track,
  children,
  badge,
}: TrackThumbnailProps) {
  const Badge = useMemo(
    () =>
      function Badge(props: BadgeComponentProps) {
        return props.onClick ? <button {...props} /> : <div {...props} />;
      },
    []
  );
  return (
    <div
      className={classNames(className.wrapper, children && badge && "relative")}
    >
      <img
        referrerPolicy="no-referrer"
        draggable={false}
        src={track?.albumImage?.url}
        className={className.image}
        alt={`${track?.name} - ${track?.artists[0]}`}
        title={`${track?.name} - ${track?.artists[0]}`}
      />
      {badge && children && (
        <Badge
          onClick={badge.onClick}
          title={badge.title}
          className={classNames(
            "absolute z-10 rounded-full shadow-md p-4 scale-75 md:scale-100",
            className.badge,
            "transition-transform focus:outline-none",
            badge.onClick && "hover:scale-90 md:hover:scale-110"
          )}
        >
          {children}
        </Badge>
      )}
    </div>
  );
}
