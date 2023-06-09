import { useCallback, useEffect, useMemo, useState } from "react";
import loadable from "@loadable/component";
import { useSWRConfig } from "swr";
import { getDocument, isDocumentValid } from "@lemasc/swr-firestore";
import type { TypeOf } from "zod";
import dayjs from "shared/dayjs";

import type { SongRequestSearchRecord } from "@station/shared/schema/types";
import { SongRequestRecord } from "@station/shared/schema";
import { UserRole, useUser } from "~/utils/pm-station/client";
import { getStatusFromDate } from "~/utils/pm-station/songrequests";
import { zodValidator } from "shared/utils";

import type { TrackModalProps } from "./base";
import TrackModal, { useStableTrack } from "./base";
import type { CommandAction, CommandActionProps } from "./commands/types";
import { SongRequestListStore } from "../SongRequest/admin/store";

export type AdminTrackModalProps<
  A extends CommandAction | undefined,
  T extends SongRequestSearchRecord
> = Omit<TrackModalProps, "track"> & {
  track?: T;
  type?: A;
} & CommandActionProps<A>;

const Commands = loadable(() => import("./commands"));

export const AdminTrackModal = <
  A extends CommandAction | undefined,
  T extends SongRequestSearchRecord
>(
  props: AdminTrackModalProps<A, T>
) => {
  const { user } = useUser();
  const [record, setRecord] = useState<TypeOf<typeof SongRequestRecord>>();
  const stableTrack = useStableTrack(record);
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (props.track) {
      try {
        setRecord(SongRequestRecord.parse(props.track));
      } catch {
        // This is not a full SongRequestRecord.
        // Fetch a new one before continue.
        const key = `songrequests/${props.track.id}`;
        getDocument(key, {
          validator: zodValidator(SongRequestRecord),
          mutate,
        }).then((doc) => {
          // mutate locally so that we can reference it later
          mutate(key, doc, false);
          if (doc && isDocumentValid(doc)) {
            SongRequestListStore.setState((state) => ({
              ...state,
              firestoreRecords: new Set(state.firestoreRecords).add(doc.id),
            }));
            setRecord(doc);
          }
        });
      }
    } else {
      setRecord(undefined);
    }
  }, [props.track, mutate]);

  const { track, closeModal } = stableTrack;

  const canShowCommands = useMemo(
    () => user && user.role && user.role >= UserRole.EDITOR,
    [user]
  );

  useEffect(() => {
    if (canShowCommands) {
      Commands.preload();
    }
  }, [canShowCommands]);

  const actionHandler = useCallback(
    (track: TypeOf<typeof SongRequestRecord>) => {
      if (props.type) {
        if (track && props.type === "removeFromPlaylist") {
          (
            props as unknown as CommandActionProps<"removeFromPlaylist">
          ).onAction(track);
        }
        closeModal();
      }
    },
    [props, closeModal]
  );

  return (
    <TrackModal
      className="text-sm flex flex-col gap-1"
      onClose={props.onClose}
      {...stableTrack}
    >
      <span>คนส่งคำขอทั้งหมด {track?.submissionCount} คน</span>
      <span>
        เปลี่ยนแปลงล่าสุดเมื่อ {dayjs(track?.lastUpdatedAt).format("LLL น.")}
      </span>
      {getStatusFromDate(track?.lastPlayedAt) === "played" && (
        <span>เปิดล่าสุดเมื่อ {dayjs(track?.lastPlayedAt).format("LL")}</span>
      )}
      {canShowCommands && (
        <Commands type={props.type} track={track} onAction={actionHandler} />
      )}
    </TrackModal>
  );
};
