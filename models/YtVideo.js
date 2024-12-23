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
    this.video_stat_key = `COOKIEKID:VIDEO_STAT:${ytVideo.video_id}`
  }

  ShortVideoTitle(title) {
    if (`${title}`.length > 55) {
      return `${`${title}`.slice(0, 60)}...`
    }
    return `${title}`
  }

  IncreaseWatchDuration(videoID, durationSecond) {
    var key = `COOKIEKID:VIDEO_STAT:${videoID}`
    var videoStat = this.GetLocalVideoStat(key)
    videoStat.total_watch_duration += durationSecond
    localStorage.setItem(key, JSON.stringify(videoStat))

    this.IncreaseDailyWatchDuration(this.GetCurrentDate(), durationSecond)
  }

  IncreaseViewCount(videoID) {
    var key = `COOKIEKID:VIDEO_STAT:${videoID}`
    var videoStat = this.GetLocalVideoStat(key)
    videoStat.view_count += 1
    localStorage.setItem(key, JSON.stringify(videoStat))

    this.IncreaseDailyViewCount(this.GetCurrentDate())
  }

  GetLocalVideoStat(key) {
    var videoStat = {
      "total_watch_duration": 0,
      "view_count": 0,
      "latest_watched_at_unix": 0
    }

    if (typeof(localStorage) === "undefined") {return {}}

    if (localStorage.getItem(key)) {
      videoStat = JSON.parse(localStorage.getItem(key))
    } else {
      localStorage.setItem(key, JSON.stringify(videoStat))
    }

    return videoStat
  }

  IncreaseDailyWatchDuration(currentDate, durationSecond) {
    var key = `COOKIEKID:DAILY_VIDEO_STAT:${currentDate}`
    var videoStat = this.GetDailyLocalVideoStat(key)

    videoStat.total_watch_duration += durationSecond
    localStorage.setItem(key, JSON.stringify(videoStat))
  }

  IncreaseDailyViewCount(currentDate) {
    var key = `COOKIEKID:DAILY_VIDEO_STAT:${currentDate}`
    var videoStat = this.GetDailyLocalVideoStat(key)

    videoStat.view_count += 1
    localStorage.setItem(key, JSON.stringify(videoStat))
  }

  GetDailyLocalVideoStat(key) {
    var videoStat = {
      "total_watch_duration": 0,
      "view_count": 0,
      "latest_watched_at_unix": 0
    }

    if (typeof(localStorage) === "undefined") {return {}}

    if (localStorage.getItem(key)) {
      videoStat = JSON.parse(localStorage.getItem(key))
    } else {
      localStorage.setItem(key, JSON.stringify(videoStat))
    }

    return videoStat
  }

  GetCurrentDailyLocalVideoStat() {
    var key = `COOKIEKID:DAILY_VIDEO_STAT:${this.GetCurrentDate()}`

    var videoStat = {
      "total_watch_duration": 0,
      "view_count": 0,
      "latest_watched_at_unix": 0
    }

    if (typeof(localStorage) === "undefined") {return {}}

    if (localStorage.getItem(key)) {
      videoStat = JSON.parse(localStorage.getItem(key))
    } else {
      localStorage.setItem(key, JSON.stringify(videoStat))
    }

    return videoStat
  }

  GetViewedCount(videoID) {
    var selectedVideoID = this.video_id
    if (videoID !== "") {
      selectedVideoID = videoID
    }

    if (typeof(localStorage) === "undefined") { return 0 }

    var key = `COOKIEKID:VIDEO_STAT:${selectedVideoID}`
    if (!localStorage.getItem(key)) { return 0 }
    var videoStat = JSON.parse(localStorage.getItem(key))
    return videoStat.view_count
  }

  GetWatchedDuration(videoID) {
    var selectedVideoID = this.video_id
    if (videoID !== "") {
      selectedVideoID = videoID
    }

    if (typeof(localStorage) === "undefined") { return 0 }

    var key = `COOKIEKID:VIDEO_STAT:${selectedVideoID}`
    if (!localStorage.getItem(key)) { return 0 }
    var videoStat = JSON.parse(localStorage.getItem(key))
    return Math.floor(videoStat.total_watch_duration/60)
  }

  PushToDailyWatchHistory(videoID) {
    var dailyWatchHistoryKey = `COOKIEKID:DAILY_VIDEO_HISTORY:${this.GetCurrentDate()}`

    var dailyWatchHistories = []

    if (localStorage.getItem(dailyWatchHistoryKey)) {
      dailyWatchHistories = JSON.parse(localStorage.getItem(dailyWatchHistoryKey))
    }

    dailyWatchHistories = dailyWatchHistories.filter(function( obj ) {
      return obj.video_id !== videoID
    })

    dailyWatchHistories.unshift(this.YtVideo)

    if (!this.YtVideo.video_id) {
      return
    }

    localStorage.setItem(dailyWatchHistoryKey, JSON.stringify(dailyWatchHistories))
  }

  GetCurrentDate() {
    var d = new Date()
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
  }
}
