node_version:=$(shell node -v)
npm_version:=$(shell npm -v)
timeStamp:=$(shell date +%Y%m%d%H%M%S)


.PHONY: install build archive test clean

nodes_modules:
	npm install

all: android ios
	mkdir platforms/all
	zip -r platforms/all/app-release-all.zip platforms/ios platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk platforms/android/app/build/outputs/apk/debug/app-debug.apk

android: nodes_modules
	npx ionic capacitor platform add android --prod --release
	npx ionic capacitor build android --release --prod

ios: nodes_modules
	npx ionic capacitor platform add ios --prod --release
	npx ionic capacitor prepare ios --release --prod

show:
	@ echo Timestamp: "$(timeStamp)"
	@ echo Node Version: $(node_version)
	@ echo npm_version: $(npm_version)

clean:
	@ rm -rf dist nodes_modules www platform plugins
	@ rm -rf dist.tar.gz

INFO := @bash -c '\
  printf $(YELLOW); \
  echo "=> $$1"; \
