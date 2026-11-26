import fs from 'node:fs';
import assert from 'node:assert/strict';

const biosKeys = JSON.parse(fs.readFileSync('./data/bios-keys.json', 'utf8'));
const beepCodes = JSON.parse(fs.readFileSync('./data/beep-codes.json', 'utf8'));
const postCodes = JSON.parse(fs.readFileSync('./data/post-codes.json', 'utf8'));
const fullRef = JSON.parse(fs.readFileSync('./data/bios-reference.json', 'utf8'));
const csvLines = fs.readFileSync('./data/spi-flash-chips.csv', 'utf8').trim().split(/\r?\n/);

assert.ok(biosKeys.brands.length >= 8, 'Expected >= 8 brands');
assert.ok(biosKeys.models.length >= 11, 'Expected >= 11 flagship models');
assert.ok(beepCodes.beepAndLedCodes.length >= 45, 'Expected >= 45 beep/LED patterns');
assert.ok(postCodes.postHexCodes.length >= 45, 'Expected >= 45 POST hex codes');
assert.equal(csvLines.length - 1, fullRef.spiFlashChips.length, 'CSV row count matches JSON chip count');

// Safety check: NEVER cross-reference 1.8V and 3.3V SPI flash chips as compatible
const byPart = new Map(fullRef.spiFlashChips.map((c) => [c.partNumber, c]));
for (const chip of fullRef.spiFlashChips) {
  for (const compat of chip.compatibleParts) {
    const target = byPart.get(compat);
    if (target) {
      assert.equal(
        target.is18VHazard,
        chip.is18VHazard,
        `Voltage mismatch: ${chip.partNumber} (${chip.voltageNominal}) vs ${compat} (${target.voltageNominal})`
      );
      assert.equal(
        target.capacityMbit,
        chip.capacityMbit,
        `Capacity mismatch: ${chip.partNumber} (${chip.capacityMbit}Mb) vs ${compat} (${target.capacityMbit}Mb)`
      );
    }
  }
}

// Compliance check: zero binary firmware links in dataset
const rawAll = JSON.stringify(fullRef);
assert.ok(!/https?:\/\/[^"\s]+\.(bin|rom|cap|exe)(\?|"|$)/i.test(rawAll), 'Found direct binary firmware URL');

console.log(
  `OK: ${biosKeys.brands.length} brands, ${biosKeys.models.length} models, ` +
  `${beepCodes.beepAndLedCodes.length} beep/LED codes, ${postCodes.postHexCodes.length} POST hex codes, ` +
  `${fullRef.spiFlashChips.length} SPI NOR flash chips validated (1.8V/3.3V safety & zero-binary compliance passed).`
);
