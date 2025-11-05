package config

import (
	"fmt"
	"os"

	"github.com/linhhuynhcoding/web-my-pham/server/pkg/consts"
	"github.com/spf13/viper"
)

type Config struct {
	DBSource string `mapstructure:"DB_SOURCE"`

	HttpPort int `mapstructure:"HTTP_PORT"`
	GrpcPort int `mapstructure:"GRPC_PORT"`

	RedisAddress        string              `mapstructure:"REDIS_ADDRESS"`
	UploadFolder        string              `mapstructure:"UPLOAD_FOLDER"`
	CoinMarketCapConfig CoinMarketCapConfig `mapstructure:"COIN_MARKET_CAP_CONFIG"`

	Password string `mapstructure:"PASSWORD"`
	Token    string `mapstructure:"TOKEN"`

	TokenConfig TokenConfig `mapstructure:"TOKEN_CONFIG"`
}

type CoinMarketCapConfig struct {
	ApiKey string `mapstructure:"API_KEY"`
	ApiUrl string `mapstructure:"API_URL"`
}

type TokenConfig struct {
	AccessSecretKey string `mapstructure:"ACCESS_SECRET_KEY"`
	RefresSecretKey string `mapstructure:"REFRESH_SECRET_KEY"`
	AccessTokenTTL  int    `mapstructure:"ACCESS_TOKEN_TTL"`
	RefreshTokenTTL int    `mapstructure:"REFRESH_TOKEN_TTL"`
}

func NewConfig() *Config {
	configPath := os.Getenv("CONFIG_PATH")
	if configPath == "" {
		configPath = "./"
	}

	config, err := LoadConfig(configPath)
	if err != nil {
		panic(err)
	}
	return &config
}

func LoadDefaultConfig(cfg *Config) {
	cfg.UploadFolder = consts.DEFAULT_UPLOAD_FOLDER
	cfg.HttpPort = consts.HTTP_PORT
	cfg.GrpcPort = consts.GRPC_PORT
	cfg.CoinMarketCapConfig.ApiUrl = "https://pro-api.coinmarketcap.com"
}

func LoadConfig(path string) (config Config, err error) {
	LoadDefaultConfig(&config)

	viper.AddConfigPath(path)
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")

	viper.AutomaticEnv()

	err = viper.ReadInConfig()
	if err != nil {
		fmt.Printf("looking for config in: %v\n", viper.ConfigFileUsed())
		return
	}

	err = viper.Unmarshal(&config)
	return
}
