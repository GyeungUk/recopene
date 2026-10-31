# RE:COPENE photographic assets

## Web delivery (what the site actually loads)

- `tomato-hero.webp` — 887 × 887 RGBA, the left (whole-tomato) cell of `tomato-beauty-atlas.png`, cropped with no repainting. cwebp q90, lossless-quality alpha. Also the hero's fallback `<img>`.
- `water-splash.webp` — 1536 × 1024 RGBA from `water-splash.png`, cwebp q80.
- `water-drop.webp` — 1024 × 1024 RGBA from `water-drop.png` (downscaled), cwebp q84.
- `concept-a.webp`, `concept-b.webp` — 754 × 892 RGB, survey question 3's two product boards (A안 토마토 스킨, B안 토마토 로션). Cropped from the team's 1536 × 1024 A/B board image with no repainting: A at (10, 12)–(764, 904), B at (773, 12)–(1527, 904). The crop drops each board's outer frame and the "…이 더 마음에 들어요" button baked into the bottom, which the survey draws as a live button instead. PIL WebP q90, method 6. These are concept visuals made for the A/B test, not photographs of finished products.
- `fonts/wanted-sans-subset.woff2` — Wanted Sans variable (wght 400–1000), subset to the characters in `index.html`. Source: https://github.com/wanteddev/wanted-sans (`packages/wanted-sans/fonts/variable/WantedSansVariable.ttf`), SIL OFL 1.1.
- `fonts/wanted-sans-ks.woff2` — the same font cut to the 2,350 common Hangul syllables (KS X 1001), declared as "Wanted Sans KS". Downloaded only for characters the page cut lacks.
- `fonts/bagel-fat-one-subset.woff2` — Bagel Fat One, cut to the marquee and finale-slogan strings plus basic Latin. Source: https://github.com/google/fonts (`ofl/bagelfatone/BagelFatOne-Regular.ttf`), SIL OFL 1.1.

After changing copy, re-cut the page subset (fonttools):

```
pyftsubset WantedSansVariable.ttf --text-file=<all characters in index.html> --unicodes="U+0020-007E,U+00A0,U+00B7,U+2014,U+2018-201D,U+2022,U+2026,U+2190-2199" --layout-features='*' --flavor=woff2 --output-file=assets/fonts/wanted-sans-subset.woff2
```

New Bagel strings need the same treatment with `bagel-fat-one-subset.woff2`. Until then, any missing character falls back to Wanted Sans.

The PNG originals below stay as the masters.

## Current tomato: tomato-beauty-atlas.png

Updated after feedback that the photographic tomato felt too real. Bright coral red, softer lobes, gentle highlights and fewer dew drops. Replaces the original atlas in the website; original preserved.

Saved path: `assets/tomato-beauty-atlas.png`

Mode: built-in image_gen, edit/style-transfer, transparent_background=true. Input: tomato-photo-atlas.png.

Final prompt:

> Use case: style-transfer. Edit target: supplied tomato atlas for the RE:COPENE fresh skincare website. Redesign these two tomatoes into BEAUTIFULLY ART-DIRECTED premium beauty-ad fruit imagery, midway between refined digital illustration and retouched food photography. Preserve the exact 2:1 atlas structure: one whole tomato entirely inside the LEFT square cell, one matching cut tomato half entirely inside the RIGHT square cell, equal diameter and clear transparent padding, truly transparent background. Change the visual character strongly: bright luminous coral tomato red, soft graceful nearly round silhouette with only subtle shallow lobes, smooth satin skin, soft diffuse highlights, evenly luminous red shadows with NO dark maroon/black underside. A delicate elegant fresh green calyx with five softly curling leaves and a slender stem, no bristly hairs or leathery veins. Just 5–8 beautifully spaced small clear dew drops, no dense sweating, no pores, no grain, no gritty macro detail. Cut half: simple lovely 5–6 chamber radial composition, translucent coral-pink juicy flesh, a few delicate light gold seeds, clean luminous interior, subtle jelly translucency, no dark cavities, no fibrous/meaty anatomy. Whole fruit and half must feel fresh, delicious, light and sophisticated, charming but NOT a character or toy. Soft beauty studio light, generous fill, soft peach-red transitions, almost airy editorial polish. NOT hyperreal documentary food photography, NOT deeply ribbed heirloom tomato, NOT plastic toy, NOT rubber, NOT clay, NOT hard lacquer, NOT flat vector, no outlines, no faces. No floor or background shadow, no water splash, no text or logo, no objects besides the two fruit cutouts. Keep the same camera directions as the input, whole tomato slightly above/front, cut face almost forward. The whole tomato should fill about 86% of its cell width, and cut half 86%, entire fruit and stem inside each cell.

Created with the built-in `image_gen` tool on 2026-10-29. These are AI-generated photographic-style visuals, not photographs of the project's actual produce or finished products. Original alpha is preserved. No external stock photos were copied.

## tomato-photo-atlas.png

- 1774 × 887 RGBA, two square cells: whole tomato on the left, cut tomato on the right.
- The website selects each cell with texture UVs or SVG viewports. The source file is not cropped or painted over.
- Used for the hero, macro flesh reveal and small tomato decorations.

Generation prompt:

> Use case: photorealistic-natural. Asset type: high-resolution photographic cutout atlas for a luxury fresh tomato skincare website, wide 2:1 composition. Create TWO distinct isolated photographic objects on a truly transparent alpha background. Left square cell: ONE whole ripe deep scarlet-red heirloom tomato, imperfect and softly lobed, fresh green detailed star calyx and short slender hairy vine stem, realistic taut thin skin with extremely fine pores and natural subtle color variation, tiny condensation and several distinct crystal clear water beads with physically convincing refraction. Right square cell: ONE freshly sliced half of the SAME tomato, viewed almost front on at a subtle 10 degree angle, showing authentic wet irregular radial seed chambers, translucent scarlet flesh and pale gold seeds in glossy tomato gel, thin red skin at edge, no stem on this half. The objects each fit inside their own half of the canvas with at least 8 percent transparent padding. Entire object visible, no overlap across middle. Both objects same apparent diameter and matching directional light. Camera: premium macro food photography, 100mm lens, focus stacked photographic detail. Light: bright fresh cool daylight, small directional highlights, light from upper left, red saturated flesh and realistic darker red turning edges, no blown white patches. The produce should look recently washed and cold, irresistibly juicy. This is a REAL food photograph aesthetic, NOT CGI, not plastic, not stylized 3D, not illustration, not vector, no perfectly spherical fruit, no rubbery thick stem, no uniform repeated dots. No shadows on backdrop, no background, no tabletop, no text, no numbers, no borders, no UI, no watermark. Two independent clean cutouts only.

## water-splash.png

- 1536 × 1024 RGBA.
- Photographic transparent water ribbon, used as two independently moving depth layers around the photographic water and 3D product scene.

Generation prompt:

> Use case: ads-marketing. Asset type: isolated photographic water-splash overlay for fresh skincare scroll animation. Make ONE high-speed macro photograph of a sculptural clear water splash, sweeping in a loose asymmetrical diagonal crescent from lower left to upper right around a generous EMPTY middle. Landscape 3:2 framing, entire splash and separated droplets contained with slight transparent padding. A thick twisting water ribbon breaks into intricate thin translucent sheets and many irregular small droplets; a few big elongated drops near the edges. Real water surface tension, crystal refraction, delicate cool cyan shadows, sharp silver-white edge highlights; bright natural daylight. The center must stay empty so skincare bottles can be composited inside. Looks like a real camera shot at 1/8000 second. NOT a perfect ring, not a torus, not a uniform spiral, not milk, not white paint, not a plastic or chrome object, not vector, no flat white blobs, no bubbles full of opaque white. Mostly clear colorless water with subtle icy blue edge tones. Truly transparent alpha background, including openings within splash. No ground, no cast shadow, no objects, no fruit, no bottle, no type, no border, no watermark.

## water-drop.png

- Transparent RGBA photographic water drop. Used both as the main gathered droplet and as small moving particles.
- Generated using the built-in image_gen tool, transparent_background=true. No reference images; original generation mode for all three assets.

Generation prompt:

> Use case: photorealistic-natural. Asset type: a single high-speed macro photographic water drop cutout for a premium skincare website. Square composition, one suspended colorless transparent water droplet occupying 75% of the image height, entire droplet with generous transparent margin. It is a physically natural falling water blob: irregular round oval body, gently wavy surface from inertia, a short off-center neck at top, NOT a geometric pointed teardrop icon, NOT a perfect ball. Realistic fluid surface tension, subtle optical distortion, cool gray and very pale icy blue internal refraction, tiny sharp white specular strips confined to edges, largely see-through middle. The object must read as real crystal-clear water photographed in bright daylight, at 1/8000s with macro lens, not CGI, not a plastic pebble, not milk, not solid white, not silver chrome, not an icon, no heavy outline. No bright white fill. Truly transparent background and translucent alpha through the water where appropriate. No floor, no shadow, no other objects, no fruit, no text, no frame, no watermark.

## Saved workspace paths

- `assets/tomato-photo-atlas.png`
- `assets/water-splash.png`
- `assets/water-drop.png`
