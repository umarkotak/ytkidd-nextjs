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
    this.channel_id = ytVideo.channel_id

    this.shorted_video_title = this.ShortVideoTitle(ytVideo.video_title)
    this.video_stat_key = `YTKIDD:VIDEO_STAT:${ytVideo.video_id}`
  }

  ShortVideoTitle(title) {
    if (`${title}`.length > 55) {
      return `${`${title}`.slice(0, 60)}...`
    }
    return `${title}`
  }

  IncreaseWatchDuration(videoID, durationSecond) {
    var key = `YTKIDD:VIDEO_STAT:${videoID}`
    var videoStat = this.GetLocalVideoStat(key)
    videoStat.total_watch_duration += durationSecond
    localStorage.setItem(key, JSON.stringify(videoStat))
    console.log(key, durationSecond)
  }

  GetLocalVideoStat(key) {
    var videoStat = {
      "total_watch_duration": 0,
      "view_count": 0,
      "latest_watched_at_unix": 0
    }

    if (typeof(localStorage) === "undefined") {return 0}

    if (localStorage.getItem(key)) {
      videoStat = JSON.parse(localStorage.getItem(key))
    } else {
      localStorage.setItem(key, JSON.stringify(videoStat))
    }

    return videoStat
  }

  GetViewedCount() {
    return 0
  }

  GetWatchedDuration(videoID) {
    var selectedVideoID = this.video_id
    if (videoID !== "") {
      selectedVideoID = videoID
    }

    if (typeof(localStorage) === "undefined") {return 0}

    var key = `YTKIDD:VIDEO_STAT:${selectedVideoID}`
    if (!localStorage.getItem(key)) {return 0}
    var videoStat = JSON.parse(localStorage.getItem(key))
    return Math.floor(videoStat.total_watch_duration/60)
  }
}
