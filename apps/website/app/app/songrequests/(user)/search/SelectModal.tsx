"use client";

import { useCallback, useState, useTransition } from "react";
import { SubmitButton } from "@station/client/SubmitButton";
import { TrackModal } from "@/components/client";
import { songRequestModalStore } from "@/shared/modalStore";
import { useRouter } from "next/navigation";
import ky from "ky";
import { toast } from "react-toastify";
import { errorToast } from "@/shared/toast";

export const SelectTrackModal = () => {
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const selectTrack = useCallback(async () => {
    const { selectedTrack } = songRequestModalStore.getState();
    if (!selectedTrack) return;
    try {
      setIsLoading(true);
      const id = selectedTrack.id;
      await ky.post("/api/songrequests/submit", {
        searchParams: {
          id,
        },
      });
      replace(`/app/songrequests/submit?id=${id}`);
    } catch (error) {
      console.error(error);
      errorToast(error, { title: "เลือกรายการเพลงไม่สำเร็จ" });
    } finally {
      setIsLoading(false);
    }
  }, [replace]);

  return (
    <TrackModal>
      <SubmitButton
        testId="select-track"
        onClick={selectTrack}
        loading={isLoading || isPending}
      >
        เลือกเพลงนี้
      </SubmitButton>
    </TrackModal>
  );
};