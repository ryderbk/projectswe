const preloadedMedia = new Map<string, HTMLImageElement | HTMLVideoElement>();
const loadingPromises = new Map<string, Promise<void>>();

export const preloadImage = (src: string): Promise<void> => {
  if (loadingPromises.has(src)) {
    return loadingPromises.get(src)!;
  }

  const promise = new Promise<void>((resolve) => {
    if (preloadedMedia.has(src)) {
      resolve();
      return;
    }

    const img = new Image();
    img.fetchPriority = "high";
    img.decoding = "async";
    img.src = src;
    
    img.onload = () => {
      preloadedMedia.set(src, img);
      resolve();
    };
    
    img.onerror = () => {
      resolve();
    };
  });

  loadingPromises.set(src, promise);
  return promise;
};

export const preloadVideo = (src: string): Promise<void> => {
  if (loadingPromises.has(src)) {
    return loadingPromises.get(src)!;
  }

  const promise = new Promise<void>((resolve) => {
    if (preloadedMedia.has(src)) {
      resolve();
      return;
    }

    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.src = src;
    
    video.oncanplaythrough = () => {
      preloadedMedia.set(src, video);
      resolve();
    };
    
    video.onloadeddata = () => {
      preloadedMedia.set(src, video);
      resolve();
    };
    
    video.onerror = () => {
      resolve();
    };

    video.load();
  });

  loadingPromises.set(src, promise);
  return promise;
};

export const preloadMedia = (src: string): Promise<void> => {
  if (src.endsWith(".mp4") || src.endsWith(".webm") || src.endsWith(".mov")) {
    return preloadVideo(src);
  }
  return preloadImage(src);
};

export const preloadAllMedia = async (sources: string[]): Promise<void> => {
  await Promise.all(sources.map(preloadMedia));
};

export const isMediaLoaded = (src: string): boolean => {
  return preloadedMedia.has(src);
};

export const getLoadedMedia = (src: string): HTMLImageElement | HTMLVideoElement | undefined => {
  return preloadedMedia.get(src);
};
