# 🎮 Minecraft Arcade — MakeCode Extension

A comprehensive, full-featured Minecraft extension for **MakeCode Arcade** with **9 drawers**, each containing multiple sections of blocks.

---

## 📦 Installation

1. Open [MakeCode Arcade](https://arcade.makecode.com)
2. Create or open a project
3. Click **Extensions** in the toolbox
4. Paste the GitHub URL of this repository
5. The extension's 9 drawers will appear in your toolbox

---

## 🗂️ Drawers & Sections

### 🌍 World
| Section | Blocks |
|---|---|
| **Time & Weather** | Set time, advance time, set weather, day/night cycle toggle |
| **Biomes & Terrain** | Get biome, highest block, generate structure, world seed |
| **Dimensions** | Get/set dimension, travel to Nether/End |
| **World Settings** | World name, mob spawning, gravity, position values |

---

### 🧱 Blocks
| Section | Blocks |
|---|---|
| **Place & Break** | Place/break by coords or position, place in direction, replace |
| **Fill & Copy** | Fill region, fill hollow box, clone region, build sphere |
| **Detection** | Get block, block is type, is air, is solid, count blocks |
| **Block Info** | Block name, is flammable, emits light, hardness |
| **Block Effects** | Ignite, explode, flood |

---

### 🧑 Player
| Section | Blocks |
|---|---|
| **Health & Hunger** | Get/set health, heal, damage, is alive, get/set hunger |
| **Position & Movement** | Get position (x/y/z), teleport, move, flying |
| **XP & Score** | Get/add XP, get/set level, get/add/set score |
| **Inventory** | Give/take item, has item, count item, clear, equip armor, hotbar |
| **Gamemode** | Set/get gamemode, is creative, is survival |
| **Effects & Status** | Apply/remove/check effect, clear effects, set on fire |
| **Player Info** | Set/get name, show HUD, show title |

---

### 🐉 Mobs
| Section | Blocks |
|---|---|
| **Spawning** | Spawn, spawn at position, spawn many, remove by type/id/hostile/all |
| **Commands & Behavior** | Set behavior, teleport mobs, rename, attack player, flee |
| **Health & Damage** | Get health, deal damage, heal, kill, damage all of type |
| **Taming & Breeding** | Tame, check if tamed, breed two mobs |
| **Detection** | Count by type, count all, exists near, get position |

---

### 🗡️ Items
| Section | Blocks |
|---|---|
| **Give & Take** | Give count, take from chest, drop, give diamond armor, starter kit |
| **Enchanting** | Enchant held item, random enchant, remove enchantments |
| **Durability** | Repair held item, set durability % |
| **Loot & Drops** | Create loot chest, create rare loot chest |
| **Item Info** | Item name, is weapon, is tool, is food, hunger value |

---

### 🔴 Redstone
| Section | Blocks |
|---|---|
| **Power & Signals** | Set power, set signal strength, get power, is powered, power line, cut power |
| **Devices** | Toggle lever, press button, open/close door, ignite TNT, ring note block |
| **Logic Gates** | AND, OR, NOT, XOR gates |
| **Clocks & Timers** | Start redstone clock, set/get named variable |
| **Detection** | Signal at least, count powered blocks |

---

### ⚒️ Crafting
| Section | Blocks |
|---|---|
| **Crafting Table** | Craft item, can craft, give ingredients, open table |
| **Furnace** | Smelt, cook food, place furnace |
| **Brewing Stand** | Brew potion, splash potion |
| **Enchanting Table** | Use enchanting table, build enchanting setup |
| **Recipes** | Register custom recipe, has recipe, clear custom recipes |

---

### 📡 Events
| Section | Blocks |
|---|---|
| **Block Events** | On block placed/broken, on specific block, on block detected, on explosion |
| **Player Events** | On player died/spawned/hurt, on level up, on low health, on pickup, on gamemode |
| **Mob Events** | On mob spawned/killed/tamed, on specific mob killed, on all eliminated |
| **World Events** | On daytime, on nighttime, on weather change, on game start, run after, run every |
| **Custom Events** | Register handler, fire event, check listeners |

---

### 🖥️ UI
| Section | Blocks |
|---|---|
| **HUD & Messages** | Toast, title, action bar, HUD line, player stats, dialog |
| **Scoreboard** | Set/add/get score, show scoreboard, reset |
| **Chat** | Chat from player, system message, broadcast |
| **Menus** | Game menu, inventory UI, death screen |
| **Screen Effects** | Flash screen, screen shake, level up effect, game over, win |

---

### ⌨️ Commands
| Section | Blocks |
|---|---|
| **Game Rules** | gamerule (bool/number), get rule, reset all |
| **Admin Tools** | /kill, /clear, /summon, /give, /fill, /effect |
| **Teleport Commands** | Teleport to spawn, enter Nether, enter The End |
| **Sequences** | Start mob wave, countdown, build spawn platform |
| **Debug** | Debug number, debug string, log world state, assert |

---

## 🔢 Enums Available

- `MCBlockType` — 50+ block types
- `MCItemType` — 60+ item types
- `MCMobType` — 40+ mob types
- `MCBiome` — 15 biomes
- `MCWeather` — Clear, Rain, Thunder, Snow
- `MCGameMode` — Survival, Creative, Adventure, Spectator
- `MCDirection` — North, South, East, West, Up, Down
- `MCEnchantment` — 26 enchantments
- `MCEffect` — 28 potion effects
- `MCSignalStrength` — Off, Weak, Medium, Strong, Full
- `MCArmorSlot` — Helmet, Chestplate, Leggings, Boots
- `MCTimeOfDay` — Sunrise, Noon, Sunset, Midnight
- `MCDimension` — Overworld, Nether, The End
- `MCMobBehavior` — 7 AI behaviors
- `MCStructure` — 12 structure types

---

## 📝 License

MIT — Free to use and modify.
