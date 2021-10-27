node_version:=$(shell node -v)
npm_version:=$(shell npm -v)
timeStamp:=$(shell date +%Y%m%d%H%M%S)
version:=$(shell xml2 < config.xml | grep version | cut -d= -f 2)
versionName:=$(shell xml2 < config.xml | grep version | cut -d= -f 2 | cut -d. -f 1,2)
versionCode:=$(shell xml2 < config.xml | grep version | cut -d= -f 2 | cut -d. -f 3)
UNAME_S:=$(shell uname -s)

ifeq ($(ANDROID_SDK_ROOT),)
export ANDROID_SDK_ROOT := /opt/android-sdk-linux
endif


ifeq ($(UNAME_S),Darwin)
SEDARG += -i ".bkp"
else
SEDARG += -i
endif

.PHONY: android-version

node_modules:
	npm install

all: android-prod ios-xcode
	mkdir -p platforms/all
	zip -r platforms/all/app-release-all.zip ios android/app/build/outputs/bundle/release/app-release.aab android/app/build/outputs/apk/release/app-release-unsigned.apk

build:
	npx ionic build

android: node_modules build
	npx ionic capacitor add android
	npx cordova-res android
	npx cordova-res android --skip-config --copy --icon-background-source '#17161b'
	sed -i 's/versionName.*/versionName "$(versionName)"/g' android/app/build.gradle
	sed -i 's/versionCode.*/versionCode $(versionCode)/g' android/app/build.gradle

android-prod: android
	cd android && ./gradlew assembleRelease
	cd android && ./gradlew bundle

android-dev: node_modules build android
	cd android && ./gradlew assembleDebug

ios: node_modules build
	npx ionic capacitor add ios
	npx cordova-res ios --skip-config --copy

ios-xcode: ios

show:
	@ echo Timestamp: "$(timeStamp)"
	@ echo Node Version: $(node_version)
	@ echo npm_version: $(npm_version)

clean:
	@ rm -rf node_modules build android ios
	@ rm -rf resources/android/icon resources/android/splash resources/ios
	@ rm -rf dist.tar.gz

INFO := @bash -c '\
  printf $(versionCode); \
  echo "=> $$1"; \
