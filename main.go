package main

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
	"google.golang.org/api/option"
	"google.golang.org/api/youtube/v3"
)

const (
	maxPage              = 1
	videosDataFilePath   = "public/data/db.json"
	creatorsDataFilePath = "public/data/creator.json"
)

type (
	Config struct {
		YtKey string
	}

	VideoData struct {
		ChannelID       string `json:"channel_id"`
		YtkiddID        string `json:"ytkidd_id"`
		VideoID         string `json:"video_id"`
		VideoTitle      string `json:"video_title"`
		VideoImageURL   string `json:"video_image_url"`
		CreatorName     string `json:"creator_name"`
		CreatorImageURL string `json:"creator_image_url"`
		StringTags      string `json:"string_tags"`
	}

	Creator struct {
		ChannelId       string `json:"channel_id"`
		ChannelName     string `json:"channel_name"`
		ChannelImageUrl string `json:"channel_image_url"`
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

	GetYoutubeVideoParams struct {
		Creator   Creator
		Query     string
		PageToken string
	}

	NextPage struct {
		PageToken string
	}
)

var (
	config = Config{}
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	config = Config{
		YtKey: os.Getenv("YT_API_KEY"),
	}

	SynchAllChannelsVideo()
}

func SynchAllChannelsVideo() {
	ctx := context.Background()

	creators, err := getCreatorsData()
	if err != nil {
		logrus.Error(err)
		return
	}

	for _, creator := range creators {
		ScrapCreator(ctx, creator, "sync_until_latest")

		time.Sleep(2 * time.Second)

		break
	}
}

func ScrapCreator(ctx context.Context, creator Creator, mode string) error {
	allVideosData, allVideosDataMap, err := getVideosData()
	if err != nil {
		logrus.WithContext(ctx).Error(err)
		return err
	}

	if mode == "first_time" {
		// TODO: Implement logic

	} else if mode == "sync_until_latest" {
		pageToken := ""

		newVideoData := []VideoData{}

		for i := 1; i <= maxPage; i++ {
			videoDatas, nextPage, err := getYoutubeVideos(ctx, GetYoutubeVideoParams{
				Creator:   creator,
				Query:     "",
				PageToken: pageToken,
			})
			if err != nil {
				logrus.WithContext(ctx).WithFields(logrus.Fields{
					"iteration":  i,
					"page_token": pageToken,
					"channel_id": creator.ChannelId,
				}).Error(err)
				return err
			}

			shouldBreak := false

			for _, oneVideoData := range videoDatas {
				if allVideosDataMap[oneVideoData.VideoID] {
					logrus.Infof("Breaking on: %s\n", oneVideoData.VideoID)
					shouldBreak = true
					continue
				}

				newVideoData = append(newVideoData, oneVideoData)
			}

			if shouldBreak {
				break
			}

			if nextPage.PageToken == "" {
				break
			}

			time.Sleep(2 * time.Second)
		}

		allSyncedVideosData := append(allVideosData, newVideoData...)

		err = saveAllVideosData(allSyncedVideosData)
		if err != nil {
			logrus.WithContext(ctx).Error(err)
			return err
		}
	}

	return nil
}

func getYoutubeVideos(ctx context.Context, params GetYoutubeVideoParams) ([]VideoData, NextPage, error) {
	youtubeService, err := youtube.NewService(ctx, option.WithAPIKey(config.YtKey))
	if err != nil {
		logrus.WithContext(ctx).Error(err)
		return []VideoData{}, NextPage{}, err
	}

	call := youtubeService.Search.List([]string{"id", "snippet"})
	call = call.ChannelId(params.Creator.ChannelId)
	call = call.Q(params.Query)
	call = call.Type("video")
	call = call.PageToken(params.PageToken)
	call = call.MaxResults(50) // Get up to 50 results

	videoDatas := []VideoData{}

	response, err := call.Do()
	if err != nil {
		logrus.WithContext(ctx).Error(err)
		return []VideoData{}, NextPage{}, err
	}

	for _, item := range response.Items {
		if item.Id.Kind == "youtube#video" {
			logrus.Infof("Video Title: %s\n", item.Snippet.Title)
			logrus.Infof("Video ID: %s\n", item.Id.VideoId)
			logrus.Infof("------------------------------------\n")

			videoDatas = append(videoDatas, VideoData{
				ChannelID:       params.Creator.ChannelId,
				YtkiddID:        item.Id.VideoId,
				VideoID:         item.Id.VideoId,
				VideoTitle:      item.Snippet.Title,
				VideoImageURL:   item.Snippet.Thumbnails.Medium.Url,
				CreatorName:     params.Creator.ChannelName,
				CreatorImageURL: params.Creator.ChannelImageUrl,
				StringTags:      params.Creator.StringTags,
			})
		}
	}

	return videoDatas, NextPage{
		PageToken: response.NextPageToken,
	}, nil
}

func getCreatorsData() ([]Creator, error) {
	creatorJsonFile, err := os.Open(creatorsDataFilePath)
	if err != nil {
		logrus.Error(err)
		return []Creator{}, err
	}
	defer creatorJsonFile.Close()

	creatorByteValue, err := io.ReadAll(creatorJsonFile)
	if err != nil {
		logrus.Error(err)
		return []Creator{}, err
	}

	creators := []Creator{}
	err = json.Unmarshal(creatorByteValue, &creators)
	if err != nil {
		logrus.Error(err)
		return []Creator{}, err
	}

	return creators, nil
}

func getVideosData() ([]VideoData, map[string]bool, error) {
	videoDataMap := map[string]bool{}

	jsonFile, err := os.Open(videosDataFilePath)
	if err != nil {
		logrus.Error(err)
		return []VideoData{}, videoDataMap, err
	}
	defer jsonFile.Close()

	byteValue, err := io.ReadAll(jsonFile)
	if err != nil {
		logrus.Error(err)
		return []VideoData{}, videoDataMap, err
	}

	allVideoData := []VideoData{}
	err = json.Unmarshal(byteValue, &allVideoData)
	if err != nil {
		logrus.Error(err)
		return []VideoData{}, videoDataMap, err
	}

	for _, oneDbVid := range allVideoData {
		videoDataMap[oneDbVid.VideoID] = true
	}

	return allVideoData, videoDataMap, nil
}

func saveAllVideosData(videosData []VideoData) error {
	resByte, err := json.MarshalIndent(videosData, "", "    ")
	if err != nil {
		logrus.Error(err)
		return err
	}

	err = os.WriteFile(videosDataFilePath, resByte, 0644)
	if err != nil {
		logrus.Error(err)
		return err
	}

	return nil
}
