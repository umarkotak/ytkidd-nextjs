export default class YtVideo {
  constructor(ytVideo) {
    this.YtVideo = ytVideo
    this.ytkidd_id = ytVideo.ytkidd_id
    this.video_id = ytVideo.video_id
    this.video_title = ytVideo.video_title
    this.video_image_url = ytVideo.video_image_url
    this.creator_name = ytVideo.creator_name
    this.creator_image_url = ytVideo.creator_image_url
    this.string_tags = ytVideo.string_tags

    this.shorted_video_title = this.ShortVideoTitle(ytVideo.video_title)
  }

  ShortVideoTitle(title) {
    if (`${title}`.length > 63) {
      return `${`${title}`.slice(0, 60)}...`
    }
    return `${title}`
  }

  GetViewedCount() {
    return 0
  }

  GetWatchedDuration() {
    return 0
  }
}
