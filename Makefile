node_version:=$(shell node -v)
npm_version:=$(shell npm -v)
timeStamp:=$(shell date +%Y%m%d%H%M%S)


.PHONY: install build archive test clean

node_modules:
	npm install

all: android ios
	zip -r platforms/all/app-release-all.zip platforms/ios platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk platforms/android/app/build/outputs/apk/debug/app-debug.apk

resources/android:
	npx cordova-res android

resources/ios:
	npx cordova-res ios

android: node_modules build resources/android
	npx ionic capacitor sync android

ios: node_modules build resources/ios
	npx ionic capacitor sync ios

show:
	@ echo Timestamp: "$(timeStamp)"
	@ echo Node Version: $(node_version)
	@ echo npm_version: $(npm_version)

clean:
	@ rm -rf dist node_modules www platform plugins
	@ rm -rf dist.tar.gz

INFO := @bash -c '\
  printf $(YELLOW); \
  echo "=> $$1"; \
