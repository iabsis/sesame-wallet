node_version:=$(shell node -v)
npm_version:=$(shell npm -v)
timeStamp:=$(shell date +%Y%m%d%H%M%S)


#.PHONY: android ios

node_modules:
	npm install

all: android-prod ios-xcode
	mkdir -p platforms/all
	zip -r platforms/all/app-release-all.zip ios android/app/build/outputs/bundle/release/app-release.aab android/app/build/outputs/apk/release/app-release-unsigned.apk

build:
	npx ionic build

android: node_modules build
	npx ionic capacitor add android
	npx cordova-res android --skip-config --copy

android-prod: android
	cd android && ./gradlew assembleRelease
	cd android && ./gradlew bundle

android-dev: node_modules build android
	npx cordova-res ios --skip-config --copy
	cd android && ./gradlew assembleDebug

ios: node_modules build
	npx ionic capacitor add ios

ios-xcode: ios

show:
	@ echo Timestamp: "$(timeStamp)"
	@ echo Node Version: $(node_version)
	@ echo npm_version: $(npm_version)

clean:
	@ rm -rf node_modules build android ios resources/android resources/ios
	@ rm -rf dist.tar.gz

INFO := @bash -c '\
  printf $(YELLOW); \
  echo "=> $$1"; \
