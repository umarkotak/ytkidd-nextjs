package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/sirupsen/logrus"
)

type (
	VideoData struct {
		YtkiddID        string `json:"ytkidd_id"`
		VideoID         string `json:"video_id"`
		VideoTitle      string `json:"video_title"`
		VideoImageURL   string `json:"video_image_url"`
		CreatorName     string `json:"creator_name"`
		CreatorImageURL string `json:"creator_image_url"`
		StringTags      string `json:"string_tags"`
	}

	YoutubeResponse struct {
		Kind          string `json:"kind"`
		Etag          string `json:"etag"`
		NextPageToken string `json:"nextPageToken"`
		RegionCode    string `json:"regionCode"`
		PageInfo      struct {
			TotalResults   int `json:"totalResults"`
			ResultsPerPage int `json:"resultsPerPage"`
		} `json:"pageInfo"`
		Items []struct {
			Kind string `json:"kind"`
			Etag string `json:"etag"`
			ID   struct {
				Kind    string `json:"kind"`
				VideoID string `json:"videoId"`
			} `json:"id"`
			Snippet struct {
				PublishedAt time.Time `json:"publishedAt"`
				ChannelID   string    `json:"channelId"`
				Title       string    `json:"title"`
				Description string    `json:"description"`
				Thumbnails  struct {
					Default struct {
						URL    string `json:"url"`
						Width  int    `json:"width"`
						Height int    `json:"height"`
					} `json:"default"`
					Medium struct {
						URL    string `json:"url"`
						Width  int    `json:"width"`
						Height int    `json:"height"`
					} `json:"medium"`
					High struct {
						URL    string `json:"url"`
						Width  int    `json:"width"`
						Height int    `json:"height"`
					} `json:"high"`
				} `json:"thumbnails"`
				ChannelTitle         string    `json:"channelTitle"`
				LiveBroadcastContent string    `json:"liveBroadcastContent"`
				PublishTime          time.Time `json:"publishTime"`
			} `json:"snippet"`
		} `json:"items"`
	}
)

func main() {
	fmt.Printf("START SCRAPING YOUTUBE DATA!\n")

	channelId := "UCVzLLZkDuFGAE2BGdBuBNBg"
	channelImageUrl := "https://yt3.ggpht.com/ytc/AOPolaTOW1xJWre86fCwse8DQMYRGGY71y4HQHstXzXNBA=s88-c-k-c0x00ffffff-no-rj"
	stringTags := "kids,family"
	nextPageToken := "CDIQAA"

	youtubeApi := "https://www.googleapis.com/youtube/v3/search?"
	params := []string{
		"key=AIzaSyDL9jzmqn7zo2EDs0LGT82wu3_sQykZqaE",
		fmt.Sprintf("channelId=%s", channelId),
		"part=snippet,id",
		"order=date",
		"maxResults=50",
	}

	if nextPageToken != "" {
		params = append(params, fmt.Sprintf("pageTokenq=%v", nextPageToken))
	}

	finalUrl := fmt.Sprintf("%v%v", youtubeApi, strings.Join(params, "&"))
	logrus.Infof("%s", finalUrl)

	client := &http.Client{}
	req, err := http.NewRequest("GET", finalUrl, nil)
	if err != nil {
		logrus.Error(err)
		return
	}

	res, err := client.Do(req)
	if err != nil {
		logrus.Error(err)
		return
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		logrus.Error(err)
		return
	}

	youtubeResponse := YoutubeResponse{}
	err = json.Unmarshal(body, &youtubeResponse)
	if err != nil {
		logrus.Error(err)
		return
	}

	jsonFile, err := os.Open("public/data/db.json")
	if err != nil {
		logrus.Error(err)
		return
	}
	defer jsonFile.Close()

	byteValue, err := ioutil.ReadAll(jsonFile)
	if err != nil {
		logrus.Error(err)
		return
	}

	ytIdMap := map[string]bool{}

	dbVid := []VideoData{}
	err = json.Unmarshal(byteValue, &dbVid)
	if err != nil {
		logrus.Error(err)
		return
	}

	for _, oneDbVid := range dbVid {
		ytIdMap[oneDbVid.VideoID] = true
	}

	for _, oneYoutubeVid := range youtubeResponse.Items {
		if ytIdMap[oneYoutubeVid.ID.VideoID] {
			continue
		}

		dbVid = append(dbVid, VideoData{
			YtkiddID:        fmt.Sprintf("%v", len(dbVid)),
			VideoID:         oneYoutubeVid.ID.VideoID,
			VideoTitle:      oneYoutubeVid.Snippet.Title,
			VideoImageURL:   oneYoutubeVid.Snippet.Thumbnails.Medium.URL,
			CreatorName:     oneYoutubeVid.Snippet.ChannelTitle,
			CreatorImageURL: channelImageUrl,
			StringTags:      stringTags,
		})
		ytIdMap[oneYoutubeVid.ID.VideoID] = true
	}

	resByte, err := json.MarshalIndent(dbVid, "", "    ")
	if err != nil {
		logrus.Error(err)
		return
	}

	err = os.WriteFile("public/data/db.json", resByte, 0644)
	if err != nil {
		logrus.Error(err)
		return
	}

	logrus.Infof("Next page token: %v\n", youtubeResponse.NextPageToken)
}
