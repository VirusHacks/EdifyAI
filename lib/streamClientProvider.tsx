"use client";

import { ReactNode, useEffect, useState } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import {
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";

import { tokenProvider } from "./streamAction.action";
import Loader from "../app/(meeting)/_components/Loader";

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { user, isAuthenticated } = useKindeBrowserClient();

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    if (!API_KEY) throw new Error("Stream API key is missing");

    const client = new StreamVideoClient({
      apiKey: API_KEY,
      user: {
        id: user?.id,
        name: user?.given_name || user?.id,
        image: user?.picture || undefined,
      },
      tokenProvider,
    });

    setVideoClient(client);
  }, [user, isAuthenticated]);

  return videoClient ? (
    <StreamVideo client={videoClient}>{children}</StreamVideo>
  ) : (
    <Loader />
  );
};

export default StreamVideoProvider;