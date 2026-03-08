// ============================================================
// mc-items.ts  —  🗡️ Items Drawer
// Give, take, enchant, and manage items.
// ============================================================

/**
 * 🗡️ Items
 * Give, take, enchant, repair, and inspect items and loot.
 */
//% color="#9C27B0"
//% icon="\uf5ff"
//% weight=60
//% blockGap=8
//% groups='["Give & Take","Enchanting","Durability","Loot & Drops","Item Info"]'
namespace MCItems {

    // ─── Internal item store ─────────────────────────────────────
    interface ItemStack {
        type: MCItemType
        count: number
        enchantments: { [e: number]: number }
        durability: number
        maxDurability: number
        customName: string | null
    }

    let _chests: { [key: string]: ItemStack[] } = {}

    function _maxDurability(item: MCItemType): number {
        if ([MCItemType.DiamondSword, MCItemType.DiamondPickaxe, MCItemType.DiamondAxe].indexOf(item) >= 0) return 1561
        if ([MCItemType.IronSword, MCItemType.IronPickaxe, MCItemType.IronAxe].indexOf(item) >= 0) return 250
        if ([MCItemType.WoodenSword].indexOf(item) >= 0) return 59
        if ([MCItemType.Bow].indexOf(item) >= 0) return 384
        return 64
    }

    // ════════════════════════════════════════════
    //  GROUP: Give & Take
    // ════════════════════════════════════════════

    /**
     * Give the player an item with a count.
     * @param item the item to give
     * @param count how many, eg: 1
     */
    //% block="give player $count $item"
    //% blockId="mcitems_give"
    //% count.min=1 count.max=64
    //% group="Give & Take"
    //% weight=100
    export function give(item: MCItemType, count: number): void {
        for (let i = 0; i < count; i++) MCPlayer.giveItem(item)
        game.showLongText(`📦 +${count} ${MCItemType[item]}`, DialogLayout.Top)
    }

    /**
     * Give the player all items of a type from a chest at a position.
     * @param x chest x, eg: 0
     * @param y chest y, eg: 64
     * @param z chest z, eg: 0
     */
    //% block="take all items from chest at x $x y $y z $z"
    //% blockId="mcitems_take_from_chest"
    //% group="Give & Take"
    //% weight=98
    export function takeFromChest(x: number, y: number, z: number): void {
        const key = `${x},${y},${z}`
        const stacks = _chests[key]
        if (stacks) {
            stacks.forEach(s => MCPlayer.giveItem(s.type))
            _chests[key] = []
            game.showLongText(`🎁 Took items from chest`, DialogLayout.Top)
        }
    }

    /**
     * Drop an item at a position in the world.
     * @param item the item to drop
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     */
    //% block="drop $item at x $x y $y z $z"
    //% blockId="mcitems_drop"
    //% group="Give & Take"
    //% weight=96
    export function dropItem(item: MCItemType, x: number, y: number, z: number): void {
        game.showLongText(`🎒 Dropped ${MCItemType[item]} at (${x},${y},${z})`, DialogLayout.Top)
    }

    /**
     * Give the player a full set of diamond armor.
     */
    //% block="give player diamond armor set"
    //% blockId="mcitems_give_diamond_armor"
    //% group="Give & Take"
    //% weight=94
    export function giveDiamondArmor(): void {
        MCPlayer.equipArmor(MCItemType.DiamondHelmet, MCArmorSlot.Helmet)
        MCPlayer.equipArmor(MCItemType.DiamondChestplate, MCArmorSlot.Chestplate)
        MCPlayer.equipArmor(MCItemType.DiamondLeggings, MCArmorSlot.Leggings)
        MCPlayer.equipArmor(MCItemType.DiamondBoots, MCArmorSlot.Boots)
        game.showLongText("💎 Full diamond armor equipped!", DialogLayout.Top)
    }

    /**
     * Give the player a starter kit.
     */
    //% block="give player starter kit"
    //% blockId="mcitems_starter_kit"
    //% group="Give & Take"
    //% weight=92
    export function giveStarterKit(): void {
        MCPlayer.giveItem(MCItemType.IronSword)
        MCPlayer.giveItem(MCItemType.IronPickaxe)
        MCPlayer.giveItem(MCItemType.IronAxe)
        MCPlayer.giveItem(MCItemType.Bread)
        MCPlayer.giveItem(MCItemType.Torch)
        game.showLongText("🎒 Starter kit given!", DialogLayout.Top)
    }

    // ════════════════════════════════════════════
    //  GROUP: Enchanting
    // ════════════════════════════════════════════

    /**
     * Enchant the item in the player's main hand.
     * @param enchantment the enchantment to apply
     * @param level enchantment level 1–5, eg: 1
     */
    //% block="enchant held item with $enchantment level $level"
    //% blockId="mcitems_enchant"
    //% level.min=1 level.max=5
    //% group="Enchanting"
    //% weight=100
    export function enchantHeldItem(enchantment: MCEnchantment, level: number): void {
        game.showLongText(`✨ Enchanted with ${MCEnchantment[enchantment]} ${level}`, DialogLayout.Top)
    }

    /**
     * Apply a random enchantment to the held item using XP levels.
     * @param xpLevels XP levels to spend, eg: 30
     */
    //% block="enchant held item using $xpLevels XP levels"
    //% blockId="mcitems_enchant_random"
    //% xpLevels.min=1 xpLevels.max=30
    //% group="Enchanting"
    //% weight=98
    export function enchantRandom(xpLevels: number): void {
        const enchants = [MCEnchantment.Sharpness, MCEnchantment.Unbreaking,
                          MCEnchantment.Fortune, MCEnchantment.Efficiency,
                          MCEnchantment.Protection, MCEnchantment.Looting]
        const e = enchants[Math.randomRange(0, enchants.length - 1)]
        const lvl = Math.min(5, Math.ceil(xpLevels / 8))
        game.showLongText(`✨ Got ${MCEnchantment[e]} ${lvl}!`, DialogLayout.Center)
    }

    /**
     * Remove all enchantments from the held item.
     */
    //% block="remove all enchantments from held item"
    //% blockId="mcitems_remove_enchants"
    //% group="Enchanting"
    //% weight=96
    export function removeAllEnchantments(): void {
        game.showLongText("🔮 Enchantments removed", DialogLayout.Top)
    }

    // ════════════════════════════════════════════
    //  GROUP: Durability
    // ════════════════════════════════════════════

    /**
     * Repair the held item to full durability.
     */
    //% block="repair held item"
    //% blockId="mcitems_repair"
    //% group="Durability"
    //% weight=100
    export function repairHeldItem(): void {
        game.showLongText("🔧 Item repaired!", DialogLayout.Top)
    }

    /**
     * Set held item durability percentage.
     * @param percent 0–100, eg: 100
     */
    //% block="set held item durability to $percent %"
    //% blockId="mcitems_set_durability"
    //% percent.min=0 percent.max=100
    //% group="Durability"
    //% weight=98
    export function setDurability(percent: number): void {
        game.showLongText(`🔧 Durability set to ${percent}%`, DialogLayout.Top)
    }

    // ════════════════════════════════════════════
    //  GROUP: Loot & Drops
    // ════════════════════════════════════════════

    /**
     * Spawn a loot chest at a position with items inside.
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     */
    //% block="create loot chest at x $x y $y z $z"
    //% blockId="mcitems_loot_chest"
    //% group="Loot & Drops"
    //% weight=100
    export function createLootChest(x: number, y: number, z: number): void {
        MCBlocks.placeBlock(MCBlockType.Chest, x, y, z)
        const loot: MCItemType[] = [
            MCItemType.IronSword, MCItemType.Bread,
            MCItemType.IronPickaxe, MCItemType.Coal
        ]
        const key = `${x},${y},${z}`
        _chests[key] = loot.map(t => ({
            type: t, count: Math.randomRange(1, 5),
            enchantments: {}, durability: _maxDurability(t),
            maxDurability: _maxDurability(t), customName: null
        }))
        game.showLongText(`🎁 Loot chest placed at (${x},${y},${z})`, DialogLayout.Top)
    }

    /**
     * Create a rare loot chest with powerful items.
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     */
    //% block="create rare loot chest at x $x y $y z $z"
    //% blockId="mcitems_rare_loot"
    //% group="Loot & Drops"
    //% weight=98
    export function createRareLootChest(x: number, y: number, z: number): void {
        MCBlocks.placeBlock(MCBlockType.Chest, x, y, z)
        const rare: MCItemType[] = [
            MCItemType.DiamondSword, MCItemType.DiamondPickaxe,
            MCItemType.GoldenApple, MCItemType.EnderPearl, MCItemType.NetherStar
        ]
        game.showLongText(`💎 Rare loot chest at (${x},${y},${z})!`, DialogLayout.Top)
    }

    // ════════════════════════════════════════════
    //  GROUP: Item Info
    // ════════════════════════════════════════════

    /**
     * Get the name of an item as a string.
     * @param item the item
     */
    //% block="name of $item"
    //% blockId="mcitems_name"
    //% group="Item Info"
    //% weight=100
    export function itemName(item: MCItemType): string {
        return MCItemType[item]
    }

    /**
     * Returns true if an item is a weapon.
     * @param item the item to check
     */
    //% block="$item is a weapon"
    //% blockId="mcitems_is_weapon"
    //% group="Item Info"
    //% weight=98
    export function isWeapon(item: MCItemType): boolean {
        return [MCItemType.IronSword, MCItemType.DiamondSword, MCItemType.WoodenSword,
                MCItemType.StoneSword, MCItemType.GoldenSword, MCItemType.Bow
               ].indexOf(item) >= 0
    }

    /**
     * Returns true if an item is a tool.
     * @param item the item to check
     */
    //% block="$item is a tool"
    //% blockId="mcitems_is_tool"
    //% group="Item Info"
    //% weight=96
    export function isTool(item: MCItemType): boolean {
        return [MCItemType.IronPickaxe, MCItemType.DiamondPickaxe,
                MCItemType.IronAxe, MCItemType.DiamondAxe,
                MCItemType.IronShovel, MCItemType.DiamondShovel,
                MCItemType.FishingRod, MCItemType.FlintAndSteel
               ].indexOf(item) >= 0
    }

    /**
     * Returns true if an item is food.
     * @param item the item to check
     */
    //% block="$item is food"
    //% blockId="mcitems_is_food"
    //% group="Item Info"
    //% weight=94
    export function isFood(item: MCItemType): boolean {
        return [MCItemType.Apple, MCItemType.Bread, MCItemType.CookedBeef,
                MCItemType.CookedPork, MCItemType.CookedChicken, MCItemType.GoldenApple,
                MCItemType.Carrot, MCItemType.Potato
               ].indexOf(item) >= 0
    }

    /**
     * Get the hunger restore value of a food item.
     * @param item the food item
     */
    //% block="hunger restored by $item"
    //% blockId="mcitems_hunger_value"
    //% group="Item Info"
    //% weight=92
    export function hungerValue(item: MCItemType): number {
        switch (item) {
            case MCItemType.GoldenApple: return 4
            case MCItemType.CookedBeef: return 8
            case MCItemType.Bread: return 5
            case MCItemType.Apple: return 4
            case MCItemType.Carrot: return 3
            default: return 2
        }
    }
}
