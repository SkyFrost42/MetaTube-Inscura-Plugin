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

const URL_REWRITE_RULES = [
    {
        hostname: "www.javbus.com",
        replaceWith: "www.dmmbus.bond",
    },
];

function parseUrlParts(value) {
    const parts = /^((?:[a-z][a-z0-9+.-]*:)?\/\/)([^/?#]+)([\s\S]*)$/i.exec(value);
    if (!parts) {
        return null;
    }
    const authority = /^(.*@)?(\[[^\]]+\]|[^:]+)(:\d+)?$/.exec(parts[2]);
    if (!authority) {
        return null;
    }
    return {
        prefix: parts[1],
        userInfo: authority[1] ?? "",
        hostname: authority[2],
        port: authority[3] ?? "",
        suffix: parts[3],
    };
}

function rewriteUrl(value) {
    if (typeof value !== "string" || !value) {
        return value;
    }
    const parts = parseUrlParts(value);
    if (!parts) {
        return value;
    }
    const rule = URL_REWRITE_RULES.find(function (item) {
        return item.hostname === parts.hostname;
    });
    if (!rule) {
        return value;
    }
    return `${parts.prefix}${parts.userInfo}${rule.replaceWith}${parts.port}${parts.suffix}`;
}

function rewriteUrls(values) {
    if (!Array.isArray(values)) {
        return values ?? [];
    }
    return values.map(rewriteUrl);
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
                thumbUrl: rewriteUrl(item.thumb_url ?? ""),
                coverUrl: rewriteUrl(item.cover_url ?? ""),
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
            thumbUrl: rewriteUrl(d.thumb_url ?? ""),
            bigThumbUrl: rewriteUrl(d.big_thumb_url ?? ""),
            coverUrl: rewriteUrl(d.cover_url ?? ""),
            bigCoverUrl: rewriteUrl(d.big_cover_url ?? ""),
            previewVideoUrl: rewriteUrl(d.preview_video_url ?? ""),
            photos: rewriteUrls(d.preview_images),
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
                avatar: rewriteUrl(item.images?.[0] ?? ""),
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
            debutDate: d.debut_date ?? "",
            height: d.height ? String(d.height) : "",
            measurements: d.measurements ?? "",
            nationality: d.nationality ?? "",
            avatar: rewriteUrl(d.images?.[0] ?? ""),
            photos: rewriteUrls(d.images),
            skills: d.skill ? [d.skill] : [],
            socialLinks: [],
            hobby: d.hobby ?? "",
            bloodType: d.blood_type ?? "",
            cupSize: d.cup_size ?? "",
        };
    },
};

export default plugin;
