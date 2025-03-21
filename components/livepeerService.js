const LIVEPEER_API_KEY = "f0dbf9a5-7dd5-438c-af6e-711c983e534b";
const LIVEPEER_API_URL = "https://livepeer.studio/api/stream";

export const createLiveStream = async () => {
  try {
    const response = await fetch(LIVEPEER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LIVEPEER_API_KEY}`,
      },
      body: JSON.stringify({
        name: "My Live Stream",
        playbackPolicy: { type: "public" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error: ${response.status} - ${errorText}`);
      return null;
    }

    const data = await response.json();
    console.log("Live Stream Data:", data);

    return {
      streamKey: data.streamKey,
      playbackUrl: `https://livepeercdn.com/hls/${data.playbackId}/index.m3u8`,
    };
  } catch (error) {
    console.error("Error creating live stream:", error);
    return null;
  }
};
