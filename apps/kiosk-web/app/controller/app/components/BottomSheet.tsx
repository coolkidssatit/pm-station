"use client";

import { useRef, useEffect } from "react";
import Sheet from "react-modal-sheet";
import { controllerStore, toggleShowBottomSheet } from "../store";
import Player from "./Player";

export default function BottomSheet() {
  const show = controllerStore((state) => state.showBottomSheet);
  return (
    <Sheet isOpen={show} onClose={toggleShowBottomSheet} snapPoints={[0.8]}>
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div className="p-4 pt-2 flex-1 gap-4 text-white h-full overflow-auto">
            <Player />
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop
        // @ts-ignore
        onClick={show ? toggleShowBottomSheet : undefined}
      />
    </Sheet>
  );
}
