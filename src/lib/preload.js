/**
 * Preload a list of image URLs, reporting progress as images settle.
 * Failed loads still count toward progress so the loader can never stall.
 * Resolves with a map of url -> HTMLImageElement (only successful loads).
 */
export function preloadImages(urls, onProgress) {
  let settled = 0;
  const loaded = new Map();

  const tick = () => {
    settled += 1;
    onProgress?.(settled / urls.length);
  };

  return Promise.all(
    urls.map(
      (url) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            loaded.set(url, img);
            tick();
            resolve();
          };
          img.onerror = () => {
            tick();
            resolve();
          };
          img.src = url;
        })
    )
  ).then(() => loaded);
}
