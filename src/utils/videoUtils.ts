import { Video, videos } from '../data/videos';

export function getRandomVideo(excludeId?: string, excludeLoved: boolean = false, lovedIds: string[] = []): Video {
  let availableVideos = videos;

  // Filter out the current video if excludeId is provided
  if (excludeId) {
    availableVideos = availableVideos.filter(video => video.id !== excludeId);
  }

  // Filter out loved videos if excludeLoved is true
  if (excludeLoved) {
    availableVideos = availableVideos.filter(video => !lovedIds.includes(video.id));
  }

  // If no videos are available after filtering, return any random video except current
  if (availableVideos.length === 0) {
    availableVideos = excludeId ? 
      videos.filter(video => video.id !== excludeId) : 
      videos;
  }

  const randomIndex = Math.floor(Math.random() * availableVideos.length);
  return availableVideos[randomIndex];
}