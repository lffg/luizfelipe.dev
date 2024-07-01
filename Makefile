PROD ?= 0
FLAGS := --printI18nWarnings

ifeq ($(PROD),0)
	FLAGS += --buildDrafts
endif

.PHONY: build
build:
	hugo $(FLAGS)

.PHONY: server
server:
	hugo server $(FLAGS)
