.PHONY: ssr publish

publish:
	dotnet publish -c Release -o bin/release

ssr: publish
	taskset -c 0 ./bin/release/asp --urls http://localhost:3000
