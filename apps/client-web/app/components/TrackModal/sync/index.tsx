import { useCallback, useState } from "react";
import axios from "shared/axios";
import type { SongRequestRecord } from "@station/shared/schema/types";
import type { ModalState } from "~/components/Modal";
import Modal from "~/components/Modal";

import { SyncMusicItem } from "./item";
import type { SearchActionResponse } from "@station/shared/api";
import { SubmitButton } from "@station/client/SubmitButton";
import { getFirestore, doc, writeBatch } from "firebase/firestore";
import { resetStore, syncModalStore } from "./store";

export const SyncMusicModal = ({
  tracks,
  isOpen,
  closeModal,
}: ModalState & { tracks: SongRequestRecord[] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const searchMusic = useCallback(async () => {
    if (tracks.length > 0) {
      const trackQueries = tracks.map((v) => `${v.artists[0]} ${v.name}`);
      try {
        setIsLoading(true);
        const { data } = await axios.post<SearchActionResponse>(
          "/pm-station/app/songrequests/stream/search",
          { q: trackQueries }
        );
        console.log(syncModalStore.getState());
        syncModalStore.setState({ results: data.data });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [tracks]);

  const saveResults = useCallback(async () => {
    const firestore = getFirestore();

    const batch = writeBatch(firestore);
    const { results, customResults } = syncModalStore.getState();
    if (!results || results.length !== tracks.length) return;
    tracks.forEach((track, i) => {
      const updateData: Partial<SongRequestRecord> = {
        youtubeId: (customResults.get(i) ?? results[i]).videoId,
      };
      batch.update(doc(firestore, "songrequests", track.id), updateData);
    });
    await batch.commit();
    closeModal();
  }, [tracks, closeModal]);

  const onClose = useCallback(() => {
    resetStore();
  }, []);

  const searched = syncModalStore(({ results }) => results !== null);
  return (
    <Modal
      onClose={onClose}
      canClose={!isLoading}
      isOpen={isOpen}
      closeModal={closeModal}
    >
      <div className="flex flex-col gap-4 w-full">
        <div className="space-y-2">
          <h1 className="font-bold text-2xl">Auto Sync</h1>
          <p className="text-sm text-gray-200">
            ค้นหารายการใน YouTube Music เพื่อซิงก์รายการเพลงจาก Spotify
            สำหรับเปิดในระบบโดยอัตโนมัติ
          </p>
        </div>
        <SubmitButton
          disabled={searched}
          onClick={searchMusic}
          loading={!searched && isLoading}
        >
          ค้นหารายการ
        </SubmitButton>
        <div className="flex flex-wrap flex-col text-left gap-4">
          {tracks?.map((track, i) => (
            <SyncMusicItem index={i} key={track.id} track={track} />
          ))}
        </div>
        <SubmitButton
          disabled={!searched}
          onClick={saveResults}
          loading={searched && isLoading}
        >
          บันทึกข้อมูล
        </SubmitButton>
      </div>
    </Modal>
  );
};
