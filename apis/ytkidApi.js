class YtkiddAPI {
  constructor() {
    if (typeof(window) !== "undefined" && window.location.protocol === "https:") {
      this.Host = "https://ytkidd-api-m4.cloudflare-avatar-id-1.site"
    } else {
      this.Host = "https://ytkidd-api-m4.cloudflare-avatar-id-1.site"
      // this.Host = "http://localhost:33000"
    }
  }

  // EXAMPLE

  async SamplePost(params) {
    return this.Post(`/api/post`, "", {}, params)
  }

  async SampleGet(authToken, params) {
    return this.Get(`/api/get`, authToken, {}, params)
  }

  async SampleDelete(authToken, params) {
    return this.Delete(`/api/delete/${params.user_id}`, authToken, {}, params)
  }

  async SampleUpdate(authToken, params) {
    return this.Patch(`/api/update/${params.user_id}`, authToken, {}, params)
  }

  // ACTUAL

  async GetVideos(authToken, h, params) {
    if (localStorage.getItem(`COOKIEKID:BLACKLIST_CHANNEL_MAP`)) {
      var blacklistMap = JSON.parse(localStorage.getItem(`COOKIEKID:BLACKLIST_CHANNEL_MAP`))
      params.exclude_channel_ids = Object.keys(blacklistMap).filter((k)=>blacklistMap[k]).map((k)=>`${k}`).join(",")
    }

    return this.Get(`/ytkidd/api/youtube_videos`, authToken, h, params)
  }

  async GetVideoDetail(authToken, h, params) {
    return this.Get(`/ytkidd/api/youtube_video/${params.youtube_video_id}`, authToken, h, params)
  }

  async GetChannels(authToken, h, params) {
    return this.Get(`/ytkidd/api/youtube_channels`, authToken, h, params)
  }

  async GetBooks(authToken, h, params) {
    return this.Get(`/ytkidd/api/books`, authToken, h, params)
  }

  async GetBookDetail(authToken, h, params) {
    return this.Get(`/ytkidd/api/book/${params.book_id}`, authToken, h, params)
  }

  async GetChannelDetail(authToken, h, params) {
    return this.Get(`/ytkidd/api/youtube_channel/${params.channel_id}`, authToken, h, params)
  }

  async DeleteBook(authToken, h, params) {
    return this.Delete(`/ytkidd/api/book/${params.book_id}`, authToken, h, params)
  }

  async PostAIChat(authToken, h, params) {
    return this.Post(`/ytkidd/api/ai/chat`, authToken, h, params)
  }

  async GetComfyUIOutput(authToken, h, params) {
    return this.Get(`/ytkidd/api/comfy_ui/output`, authToken, h, params)
  }

  // REUSABLE

  async Get(path, authToken, h, params) {
    var uri = `${this.GenHost()}${path}?${new URLSearchParams(params)}`
    const response = await fetch(uri, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        ...h,
      }
    })
    return response
  }

  async Delete(path, authToken, h, params) {
    var uri = `${this.GenHost()}${path}?${new URLSearchParams(params)}`
    const response = await fetch(uri, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        ...h,
      },
    })
    return response
  }

  async Post(path, authToken, h, params) {
    var uri = `${this.GenHost()}${path}`
    const response = await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        ...h,
      },
      body: JSON.stringify(params),
    })
    return response
  }

  async Patch(path, authToken, h, params) {
    var uri = `${this.GenHost()}${path}`
    const response = await fetch(uri, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        ...h,
      },
      body: JSON.stringify(params),
    })
    return response
  }

  GenHost() {
    try {
      // if (window && localStorage && localStorage.getItem("VDUB:SETTING:SERVER_URL") && localStorage.getItem("VDUB:SETTING:SERVER_URL") !== "") {
      //   return localStorage.getItem("VDUB:SETTING:SERVER_URL")
      // }
      return this.Host
    } catch(e) {
      return this.Host
    }
  }
}

const ytkiddAPI = new YtkiddAPI()

export default ytkiddAPI
