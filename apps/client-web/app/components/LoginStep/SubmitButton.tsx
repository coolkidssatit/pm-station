import { forwardRef } from "react";

import { ColorRing } from "react-loader-spinner";
export const SubmitButton = forwardRef<
  HTMLButtonElement,
  { children: string; loading?: boolean }
>(function SubmitButton({ children, loading }, ref) {
  return (
    <button
      ref={ref}
      title={children}
      type="submit"
      disabled={loading}
      className={`
  text-sm pm-station-btn bg-green-500 hover:bg-green-600 pm-station-focus-ring focus:ring-green-500 disabled:cursor-not-allowed disabled:bg-green-300`}
    >
      {loading && (
        <ColorRing
          visible={true}
          height="30"
          width="30"
          ariaLabel="loading"
          wrapperStyle={{}}
          wrapperClass="inline -my-1 mr-1"
          colors={Array(5).fill("white") as any}
        />
      )}
      {children}
    </button>
  );
});
