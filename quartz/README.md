# Awakening from the Meaning Crisis — Knowledge Graph

A knowledge graph of the ideas in John Vervaeke's *Awakening from the Meaning
Crisis* lecture series: concepts, thinkers, traditions, and practices, linked by
typed relationships (`builds_on`, `contrasts_with`, `responds_to`, `part_of`,
`exemplified_by`, `developed_by`).

**Live site:** https://touyette.github.io/AMC-KG/

This is a derivative study aid built from Vervaeke's lectures. All credit for the
ideas themselves belongs to him — notes here paraphrase his framing and never
reproduce transcript text.

## What's in this repo

This repo only contains the **published site**, built with [Quartz
5](https://quartz.jzhao.xyz/). The source Obsidian vault (the actual notes,
transcripts, and authoring tooling) lives outside of this published folder and
is not part of the public site.

```
content/             the notes that make up the site (concepts, thinkers,
                       traditions, practices, episodes, MOCs)
quartz.config.yaml    site configuration (title, theme, plugins)
scripts/build-typed-graph.mjs   generates the typed graph page (see below)
```

## Building locally

```bash
npm ci
npx quartz plugin install
npx quartz build --serve
```

Then open http://localhost:8080.

The typed graph page (see below) is generated separately and isn't part of
`--serve`'s live-reload; run it once against a finished build if you want to
preview it locally:

```bash
npx quartz build
npm run typed-graph
npx serve public
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
site with Quartz, generates the typed graph page, and publishes both to
GitHub Pages automatically.

## Typed graph

Quartz's built-in graph view treats every link the same — it can't show that
`[[Salience]]` "builds on" `[[Insight]]` while "contrasting with"
`[[Inference]]`. `scripts/build-typed-graph.mjs` parses each note's
frontmatter `type:` and `## Relationships` block (the `predicate:: [[Target]]`
fields defined in the vault's schema) into `public/static/typed-graph-data.json`,
and `scripts/typed-graph.html` renders it as a standalone page at `/typed-graph/`
with edges colored by predicate and filters for both node type and predicate.

## Known limitation

Typed relationships are authored as Dataview inline fields (`predicate::
[[Target]]`) in the source vault, which require the Obsidian Dataview plugin.
On this static site, the wikilinks still work (they feed the graph view and
backlinks), but the field syntax itself renders as literal text rather than
styled prose.
