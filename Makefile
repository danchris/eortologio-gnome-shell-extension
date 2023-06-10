.PHONY: clean zip

clean:
	rm eortologio@danchrist.github.io/eortologio@danchrist.github.io.zip || echo "No exists"

zip: clean
	cd ./eortologio@danchris.github.io && zip -r eortologio@danchrist.github.io.zip .