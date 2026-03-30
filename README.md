# MetaTube Plugin for Inscura

[![Release](https://img.shields.io/github/v/release/SkyFrost42/MetaTube-Inscura-Plugin?display_name=tag)](https://github.com/SkyFrost42/MetaTube-Inscura-Plugin/releases/latest)
![Inscura API](https://img.shields.io/badge/Inscura%20API-v1-0ea5e9)
![Capabilities](https://img.shields.io/badge/Capabilities-movie%20%7C%20actor-10b981)
![MetaTube Compatible](https://img.shields.io/badge/MetaTube-compatible-f59e0b)

[![Download Latest Release](https://img.shields.io/badge/Download-Latest%20Release-2ea44f?style=for-the-badge)](https://github.com/SkyFrost42/MetaTube-Inscura-Plugin/releases/latest)

Languages: English | [简体中文](docs/README.zh-CN.md) | [繁體中文](docs/README.zh-TW.md) | [日本語](docs/README.ja.md) | [한국어](docs/README.ko.md)

This is a MetaTube metadata scraper plugin for Inscura. It retrieves movie and actor metadata through a MetaTube-compatible API.
The plugin itself does not provide any metadata service and does not bundle any site data. It only forwards Inscura scraping requests to the MetaTube API service configured by the user.

The plugin is implemented according to the Inscura plugin specification and currently supports:

- Movie search and movie detail scraping
- Actor search and actor detail scraping

## Features

This plugin declares both `movie` and `actor` capabilities, so it can be used in Inscura for:

- Searching movies by code, title, or keyword
- Fetching movie details including title, summary, director, actors, score, release date, cover art, sample images, and preview video
- Searching actors
- Fetching actor details including aliases, birthday, height, measurements, nationality, avatar, and photos

## Installation

1. Download the officially released plugin `.zip` package from the project's [GitHub Releases](https://github.com/SkyFrost42/MetaTube-Inscura-Plugin/releases) page.
2. Install the `.zip` package from Inscura's plugin management interface.
3. Fill in the `API Base URL` plugin setting after installation.
4. Run the test and enable the plugin.

If the test passes, Inscura is able to reach your configured MetaTube service.

## Configuration

The plugin currently has only one required configuration field:

- `apiUrl`: the base URL of the MetaTube API

Example:

```text
https://your-metatube-server.com
```

Enter the service root URL and do not append `/v1` manually. The plugin automatically calls these endpoints:

- `/v1/movies/search?q=...`
- `/v1/movies/{provider}/{id}`
- `/v1/actors/search?q=...`
- `/v1/actors/{provider}/{id}`

## Usage

After installation and configuration, you can use the plugin directly in Inscura:

1. Enable the MetaTube plugin in plugin management.
2. Make sure the `API Base URL` is reachable.
3. Select this plugin in the movie or actor scraping interface.
4. Enter a keyword to search.
5. Choose the correct result and write the metadata.

## Testing and Activation

The plugin implements `test(ctx)`. When Inscura tests or activates the plugin, it first requests the root of your configured `apiUrl`.

This means:

- `apiUrl` must not be empty
- The target service must be reachable from the environment where Inscura runs
- The root URL must return a successful status code, otherwise the plugin test will fail

Common causes of test failures are an incorrect URL, a stopped service, an unreachable host, or a wrong path.

## Notes

- This plugin depends on a remote MetaTube service and cannot work offline.
- The plugin does not scrape websites directly. It depends on structured data returned by a MetaTube-compatible API.
- It is recommended to install only the official release package from the Releases page and avoid unknown or redistributed builds.
- `apiUrl` should be the site root, such as `https://example.com`, not `https://example.com/v1`.
- Final data quality for movies and actors depends on the MetaTube service you connect to and its upstream data sources.
- Any non-2xx response from the service is treated as a failure.
- If fields are missing in the server response, the plugin falls back to empty strings, empty arrays, or `0`, so some entries may be incomplete.
- This plugin targets Inscura API Version 1.

## Compliance and Legal Risk Notice

- This plugin is intended only for lawful media organization, indexing, and metadata management.
- You are responsible for ensuring that you have lawful access and usage rights for the target MetaTube service, its upstream data sources, and any related media content.
- Follow the laws and regulations in your jurisdiction, as well as the target service's terms of use, copyright rules, privacy rules, and data scraping policies.
- Do not use this plugin to obtain, organize, distribute, or republish content that infringes copyright, privacy, portrait rights, or any other legal rights.
- If relevant content is restricted in your region by age rating, content classification, network access, or distribution rules, you are responsible for your own compliance decisions and use.
- The plugin author and maintainers make no warranty regarding the legality, completeness, availability, or continuity of data returned by third-party services.
- This plugin does not include protected media content and does not provide capabilities for bypassing payment gates, authentication, geographic restrictions, or other access controls.

This notice is not legal advice. If your use case involves copyright, content compliance, or cross-border access risks, seek professional legal advice first.

## Returned Data

Movie data usually includes:

- Basic identifiers: `id`, `provider`, `number`
- Text fields: `title`, `summary`, `director`
- Related information: `actors`, `maker`, `label`, `series`, `genres`
- Media assets: `thumbUrl`, `coverUrl`, `bigThumbUrl`, `bigCoverUrl`, `previewVideoUrl`, `photos`
- Other fields: `score`, `releaseDate`

Actor data usually includes:

- Basic identifiers: `id`, `provider`, `name`
- Personal information: `aliases`, `birthday`, `height`, `measurements`, `nationality`
- Media assets: `avatar`, `photos`

## Intended Users

This plugin is suitable for:

- Inscura users who already run or can access a MetaTube-compatible service
- Users who want to use MetaTube data in Inscura for both movie and actor scraping
- Users who want to connect Inscura with the MetaTube community ecosystem

## Known Limitations

- The plugin currently does not provide additional advanced filtering options.
- The plugin does not handle account login, anti-bot measures, proxy setup, or service deployment.
- Actor descriptions, debut dates, skills, and social links are not currently filled by the plugin.
- Actual available fields depend on the server response and are not guaranteed to be complete for every entry.

## Language Versions

- English
- [简体中文](docs/README.zh-CN.md)
- [繁體中文](docs/README.zh-TW.md)
- [日本語](docs/README.ja.md)
- [한국어](docs/README.ko.md)
