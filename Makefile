install:
	@docker-compose build

up:
	@docker-compose up


down:
	@docker-compose down --volumes


sh:
	@docker-compose run --rm --service-ports api sh


.PHONY: install up down sh
