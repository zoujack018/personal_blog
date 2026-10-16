#!/usr/bin/env bash
# 从 SVG 重新生成 public/ 下的 PNG 图标（用 macOS 自带的 QuickLook 渲染）
set -euo pipefail
cd "$(dirname "$0")"
tmp=$(mktemp -d)
qlmanage -t -s 512 -o "$tmp" touch-icon.svg ../../public/favicon.svg >/dev/null
sips -z 180 180 "$tmp/touch-icon.svg.png" --out ../../public/apple-touch-icon.png >/dev/null
sips -z 192 192 "$tmp/touch-icon.svg.png" --out ../../public/icon-192.png >/dev/null
cp "$tmp/touch-icon.svg.png" ../../public/icon-512.png
sips -z 32 32 "$tmp/favicon.svg.png" --out ../../public/icon-32.png >/dev/null
rm -rf "$tmp"
