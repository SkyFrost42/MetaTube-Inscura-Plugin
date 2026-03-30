function normalizeBaseUrl(config) {
    return (config.apiUrl ?? "").replace(/\/+$/, "");
}

function requireBaseUrl(config) {
    const baseUrl = normalizeBaseUrl(config);
    if (!baseUrl) {
        throw new Error("apiUrl not configured");
    }
    return baseUrl;
}

async function readJson(resp) {
    if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
    }
    return resp.json();
}

const plugin = {
    async test(ctx) {
        const baseUrl = normalizeBaseUrl(ctx.config);
        if (!baseUrl) {
            return { ok: false, error: "apiUrl not configured" };
        }
        try {
            const resp = await ctx.fetch(baseUrl);
            if (resp.ok) {
                return { ok: true };
            }
            return { ok: false, error: `HTTP ${resp.status}` };
        } catch (err) {
            return { ok: false, error: err?.message ?? String(err) };
        }
    },

    async searchMovies(keyword, ctx) {
        const baseUrl = requireBaseUrl(ctx.config);
        const resp = await ctx.fetch(
            `${baseUrl}/v1/movies/search?q=${encodeURIComponent(keyword)}`,
        );
        const json = await readJson(resp);
        const items = json.data ?? [];
        return items.map(function (item) {
            return {
                id: item.id ?? "",
                provider: item.provider ?? "",
                number: item.number ?? "",
                title: item.title ?? "",
                thumbUrl: item.thumb_url ?? "",
                coverUrl: item.cover_url ?? "",
                score: item.score ?? 0,
                actors: item.actors ?? [],
                releaseDate: item.release_date ?? "",
            };
        });
    },

    async getMovieDetail(provider, id, ctx) {
        const baseUrl = requireBaseUrl(ctx.config);
        const url = `${baseUrl}/v1/movies/${encodeURIComponent(provider)}/${encodeURIComponent(id)}`;
        const resp = await ctx.fetch(url);
        const json = await readJson(resp);
        const d = json.data ?? {};
        return {
            id: d.id ?? "",
            provider: d.provider ?? "",
            number: d.number ?? "",
            title: d.title ?? "",
            summary: d.summary ?? "",
            director: d.director ?? "",
            actors: d.actors ?? [],
            thumbUrl: d.thumb_url ?? "",
            bigThumbUrl: d.big_thumb_url ?? "",
            coverUrl: d.cover_url ?? "",
            bigCoverUrl: d.big_cover_url ?? "",
            previewVideoUrl: d.preview_video_url ?? "",
            photos: d.sample_images ?? [],
            maker: d.maker ?? "",
            label: d.label ?? "",
            series: d.series ?? "",
            genres: d.genres ?? [],
            score: d.score ?? 0,
            releaseDate: d.release_date ?? "",
        };
    },

    async searchActors(name, ctx) {
        const baseUrl = requireBaseUrl(ctx.config);
        const resp = await ctx.fetch(
            `${baseUrl}/v1/actors/search?q=${encodeURIComponent(name)}`,
        );
        const json = await readJson(resp);
        const items = json.data ?? [];
        return items.map(function (item) {
            return {
                id: item.id ?? "",
                provider: item.provider ?? "",
                name: item.name ?? "",
                avatar: item.images?.[0] ?? "",
                matchScore: "",
            };
        });
    },

    async getActorDetail(provider, id, ctx) {
        const baseUrl = requireBaseUrl(ctx.config);
        const url = `${baseUrl}/v1/actors/${encodeURIComponent(provider)}/${encodeURIComponent(id)}`;
        const resp = await ctx.fetch(url);
        const json = await readJson(resp);
        const d = json.data ?? {};
        return {
            id: d.id ?? "",
            provider: d.provider ?? "",
            name: d.name ?? "",
            description: "",
            aliases: d.aliases ?? [],
            birthday: d.birthday ?? "",
            debutDate: "",
            height: d.height ? String(d.height) : "",
            measurements: d.measurements ?? "",
            nationality: d.nationality ?? "",
            avatar: d.images?.[0] ?? "",
            photos: d.images ?? [],
            skills: [],
            socialLinks: [],
        };
    },
};

module.exports = plugin;
