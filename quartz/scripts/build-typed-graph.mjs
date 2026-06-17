#!/usr/bin/env node
// Parses the vault's frontmatter `type:` and `## Relationships` predicate:: [[Target]]
// fields into a typed graph.json, then writes a standalone graph page into public/.
// Run after `npx quartz build` (the predicate edges aren't visible in Quartz's own
// graph view since Dataview inline fields are a runtime-only Obsidian feature).

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const contentDir = path.join(__dirname, "..", "content")
const publicDir = path.join(__dirname, "..", "public")

const PREDICATES = [
  "developed_by",
  "builds_on",
  "contrasts_with",
  "responds_to",
  "part_of",
  "exemplified_by",
  "related",
]

function walk(dir) {
  let results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results = results.concat(walk(full))
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      results.push(full)
    }
  }
  return results
}

function slugify(relPath) {
  return relPath
    .replace(/\.md$/, "")
    .split(path.sep)
    .join("/")
    .toLowerCase()
    .replace(/ /g, "-")
}

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  const fm = {}
  const lines = match[1].split("\n")
  for (const line of lines) {
    const typeMatch = line.match(/^type:\s*(.+)$/)
    if (typeMatch) fm.type = typeMatch[1].trim()
    const aliasMatch = line.match(/^aliases:\s*\[(.*)\]$/)
    if (aliasMatch) {
      fm.aliases = aliasMatch[1]
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean)
    }
  }
  return fm
}

function parseTitle(text, fallback) {
  const match = text.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : fallback
}

function extractWikilinks(value) {
  const links = []
  const re = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g
  let m
  while ((m = re.exec(value))) {
    links.push(m[1].trim())
  }
  return links
}

function extractRelationships(text) {
  const sectionMatch = text.match(/## Relationships\n([\s\S]*?)(\n##\s|\n---|\s*$)/)
  if (!sectionMatch) return []
  const body = sectionMatch[1]
  const edges = []
  for (const predicate of PREDICATES) {
    const re = new RegExp(`^${predicate}::\\s*(.+)$`, "gm")
    let m
    while ((m = re.exec(body))) {
      for (const target of extractWikilinks(m[1])) {
        edges.push({ predicate, target })
      }
    }
  }
  return edges
}

const files = walk(contentDir).filter(
  (f) => !f.startsWith(path.join(contentDir, "_index")) && f !== path.join(contentDir, "index.md"),
)

const nodes = []
const nameToSlug = new Map()

for (const file of files) {
  const text = fs.readFileSync(file, "utf-8")
  const fm = parseFrontmatter(text)
  if (!fm.type) continue
  const relPath = path.relative(contentDir, file)
  const slug = slugify(relPath)
  const title = parseTitle(text, path.basename(file, ".md"))
  nodes.push({ id: slug, title, type: fm.type, file: relPath, edges: [] })
  nameToSlug.set(title.toLowerCase(), slug)
  for (const alias of fm.aliases ?? []) {
    nameToSlug.set(alias.toLowerCase(), slug)
  }
}

const edges = []
for (const node of nodes) {
  const file = path.join(contentDir, node.file)
  const text = fs.readFileSync(file, "utf-8")
  for (const { predicate, target } of extractRelationships(text)) {
    const targetSlug = nameToSlug.get(target.toLowerCase())
    if (!targetSlug) {
      console.warn(`  ! unresolved link target "${target}" from ${node.id} (${predicate})`)
      continue
    }
    edges.push({ source: node.id, target: targetSlug, predicate })
  }
}

const graph = {
  nodes: nodes.map(({ id, title, type }) => ({ id, title, type })),
  edges,
}

fs.mkdirSync(path.join(publicDir, "static"), { recursive: true })
fs.writeFileSync(path.join(publicDir, "static", "typed-graph-data.json"), JSON.stringify(graph))

const graphPageDir = path.join(publicDir, "typed-graph")
fs.mkdirSync(graphPageDir, { recursive: true })
fs.copyFileSync(path.join(__dirname, "typed-graph.html"), path.join(graphPageDir, "index.html"))

console.log(`Typed graph: ${graph.nodes.length} nodes, ${graph.edges.length} edges -> public/typed-graph/`)
