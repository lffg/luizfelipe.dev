FLAGS := --printI18nWarnings

.PHONY: build
build:
	hugo $(FLAGS)

.PHONY: server
server:
	hugo server $(FLAGS)
