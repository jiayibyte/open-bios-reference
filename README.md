# Open BIOS Reference Dataset (JSON & CSV)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A clean, compliance-safe, MIT-licensed hardware reference dataset for PC builders, IT administrators, and board-level repair technicians—covering **8 major motherboard/laptop brands**, **11 flagship system bench sheets**, **47 BIOS beep & diagnostic LED patterns**, **48 two-digit hex POST / Q-Code definitions**, and **29 SPI NOR flash IC specifications** (including **8 high-hazard 1.8V parts**).

- **Interactive POST / Q-Code Lookup (free, zero login):** [biosarchives.com/tools/post-code-lookup/](https://biosarchives.com/tools/post-code-lookup/)
- **Interactive 1.8V / 3.3V SPI Flash Chip Lookup:** [biosarchives.com/tools/spi-flash-chip-lookup/](https://biosarchives.com/tools/spi-flash-chip-lookup/)
- **Interactive Beep & Diagnostic LED Decoder:** [biosarchives.com/tools/beep-code-decoder/](https://biosarchives.com/tools/beep-code-decoder/)

> **Compliance & Safety Notice:** This repository contains **technical metadata and public reference specifications only**. It hosts **zero proprietary `.bin`, `.rom`, `.cap`, or `.exe` firmware dumps** and **zero copyrighted motherboard schematics**. Always obtain official BIOS updates directly from the hardware manufacturer's support portal.

## Dataset Contents

| File | Format | Records | Description |
| :--- | :--- | ---: | :--- |
| [`data/bios-keys.json`](data/bios-keys.json) | JSON | 8 brands · 11 models | BIOS entry keys, Boot Menu keys, BIOS FlashBack / Q-Flash Plus rename rules, CMOS battery specs, and official vendor support URLs. |
| [`data/beep-codes.json`](data/beep-codes.json) | JSON | 47 patterns | AMI UEFI, Award, Phoenix, HP Caps Lock blink codes, Dell Amber/White LED codes, Lenovo ThinkPad, ASUS Q-LED, and MSI EZ Debug LED patterns. |
| [`data/post-codes.json`](data/post-codes.json) | JSON | 48 hex codes | Two-digit hexadecimal POST / Q-Code / Dr. Debug codes (`00`, `0d`, `15`, `55`, `A2`, `C5`, `d6`, etc.) mapped across vendors, boot stages, and severity. |
| [`data/spi-flash-chips.csv`](data/spi-flash-chips.csv) | CSV | 29 ICs | Winbond, Macronix, and GigaDevice SPI NOR flash chips with JEDEC IDs, capacity (Mbit / MB), nominal voltage (`1.8V` vs `3.3V`), 1.8V burn-hazard flags, packages, and voltage-safe compatible replacements. |
| [`data/bios-reference.json`](data/bios-reference.json) | JSON | Unified | Full combined machine-readable snapshot matching `https://biosarchives.com/data/bios-reference.json`. |
| [`scripts/validate.mjs`](scripts/validate.mjs) | Node.js | Validator | Automated integrity test verifying record counts, strict `1.8V` vs `3.3V` replacement isolation, and zero binary firmware URLs. |

## 1.8V vs. 3.3V SPI Flash Safety

Many modern Intel and AMD laptops use **1.8V** SPI NOR flash chips (e.g., Winbond `W25Q64FW`, `W25Q128FW`, `W25Q128JW`, Macronix `MX25U6435F`). Reading or flashing a 1.8V IC directly on a standard 3.3V programmer (such as a stock CH341A without a 1.8V level-shifter adapter) risks permanently damaging the chip. Every entry in `data/spi-flash-chips.csv` includes an explicit `is_18v_hazard` boolean flag, and `scripts/validate.mjs` guarantees that `1.8V` and `3.3V` parts are never listed as cross-compatible.

## Quick Usage

### Python (pandas)

```python
import pandas as pd

df = pd.read_csv("data/spi-flash-chips.csv")
chips_18v = df[df["is_18v_hazard"] == True][["part_number", "manufacturer", "capacity_mb", "voltage_range", "jedec_id"]]
print(chips_18v.to_string(index=False))
```

### Node.js

```js
import fs from 'node:fs';

const post = JSON.parse(fs.readFileSync('./data/post-codes.json', 'utf8'));
const code0d = post.postHexCodes.find((c) => c.hexUpper === '0D');
console.log(code0d);
```

### Run Automated Safety & Schema Validation

```bash
node scripts/validate.mjs
```

## License

MIT License — free for repair shops, open-source diagnostic utilities, documentation tools, and hardware researchers. Attribution to [BIOS Archives](https://biosarchives.com/) is appreciated.
