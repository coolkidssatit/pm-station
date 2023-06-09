import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { AuthenticityTokenProvider } from "remix-utils";
import type { FirebaseOptions } from "firebase/app";
import { useFirebase } from "@station/client/firebase";

import pmStation from "~/styles/pm-station.css";
import toastify from "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer } from "react-toastify";
import { createCSRFToken } from "@station/server/auth/remix";

type PUBLIC_ENV = {
  ENV: {
    firebaseConfig: FirebaseOptions & {
      useEmulator?: boolean;
    };
    csrf: string;
  };
};

export const unstable_shouldReload = () => false;

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: toastify },
  { rel: "stylesheet", href: pmStation },
];

export const meta: MetaFunction = () => ({
  description:
    "โครงการ PM Station โดยคณะกรรมการนักเรียนฝ่ายเทคโนโลยีสารสนเทศ ประจำปีการศึกษา 2565 โรงเรียนมัธยมสาธิตวัดพระศรีมหาธาตุ มหาวิทยาลัยราชภัฏพระนคร",
  "twitter:card": "summary",
});

export const loader: LoaderFunction = async ({ request }) => {
  const firebaseConfig = {
    apiKey: process.env.PM_STATION_FIREBASE_PUBLIC_API_KEY,
    authDomain: process.env.PM_STATION_FIREBASE_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.PM_STATION_FIREBASE_PUBLIC_PROJECT_ID,
    storageBucket: process.env.PM_STATION_FIREBASE_PUBLIC_STORAGE_BUCKET,
    messagingSenderId:
      process.env.PM_STATION_FIREBASE_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.PM_STATION_FIREBASE_PUBLIC_APP_ID,
    measurementId: process.env.PM_STATION_FIREBASE_PUBLIC_MEASUREMENT_ID,
    useEmulator:
      typeof process.env.FIRESTORE_EMULATOR_HOST !== "undefined" ||
      typeof process.env.FIREBASE_AUTH_EMULATOR_HOST !== "undefined",
  };
  const { csrf, headers } = await createCSRFToken(request.headers);
  return json<PUBLIC_ENV>(
    {
      ENV: {
        firebaseConfig,
        csrf,
      },
    },
    await headers()
  );
};

export default function PMStationApp() {
  const {
    ENV: { firebaseConfig, csrf },
  } = useLoaderData<PUBLIC_ENV>();

  useFirebase(firebaseConfig);

  return (
    <>
      <AuthenticityTokenProvider token={csrf}>
        <Outlet />
      </AuthenticityTokenProvider>
      <ToastContainer
        position="top-right"
        closeOnClick
        draggable
        theme="dark"
      />
    </>
  );
}
