node_version:=$(shell node -v)
npm_version:=$(shell npm -v)
timeStamp:=$(shell date +%Y%m%d%H%M%S)


.PHONY: android ios

node_modules:
	npm install

all: android ios
	zip -r app-release-all.zip ios android/app/build/outputs/bundle/release/app-release.aab android/app/build/outputs/apk/release/app-release-unsigned.apk

resources/android:
	npx cordova-res android

resources/ios:
	npx cordova-res ios

android: node_modules build resources/android
	npx ionic capacitor sync android
	cd android && ./gradlew assembleRelease
	cd android && ./gradlew bundle

ios: node_modules build resources/ios
	npx ionic capacitor sync ios

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
