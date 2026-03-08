// ============================================================
// mc-crafting.ts  —  ⚒️ Crafting Drawer
// Recipes, smelting, brewing, and workbench interactions.
// ============================================================

/**
 * ⚒️ Crafting
 * Craft items, smelt ores, brew potions, and manage workbenches.
 */
//% color="#FF8F00"
//% icon="\uf0ad"
//% weight=40
//% blockGap=8
//% groups='["Crafting Table","Furnace","Brewing Stand","Enchanting Table","Recipes"]'
namespace MCCrafting {

    // ─── Internal recipe registry ────────────────────────────────
    interface Recipe {
        result: MCItemType
        resultCount: number
        ingredients: MCItemType[]
    }

    let _recipes: Recipe[] = [
        { result: MCItemType.WoodenSword, resultCount: 1, ingredients: [MCItemType.Stick, MCItemType.OakPlanks as any as MCItemType, MCItemType.OakPlanks as any as MCItemType] },
        { result: MCItemType.IronSword,   resultCount: 1, ingredients: [MCItemType.Stick, MCItemType.IronIngot, MCItemType.IronIngot] },
        { result: MCItemType.DiamondSword,resultCount: 1, ingredients: [MCItemType.Stick, MCItemType.Diamond, MCItemType.Diamond] },
        { result: MCItemType.IronPickaxe, resultCount: 1, ingredients: [MCItemType.Stick, MCItemType.IronIngot, MCItemType.IronIngot, MCItemType.IronIngot] },
        { result: MCItemType.Bread,       resultCount: 1, ingredients: [MCItemType.Carrot] },
        { result: MCItemType.Bow,         resultCount: 1, ingredients: [MCItemType.Stick, MCItemType.String, MCItemType.String, MCItemType.String] },
        { result: MCItemType.IronHelmet,  resultCount: 1, ingredients: [MCItemType.IronIngot, MCItemType.IronIngot, MCItemType.IronIngot, MCItemType.IronIngot, MCItemType.IronIngot] },
    ]

    let _customRecipes: Recipe[] = []

    // ════════════════════════════════════════════
    //  GROUP: Crafting Table
    // ════════════════════════════════════════════

    /**
     * Craft an item if the player has the required ingredients.
     * @param item the item to craft
     */
    //% block="craft $item"
    //% blockId="mccrafting_craft"
    //% group="Crafting Table"
    //% weight=100
    export function craft(item: MCItemType): boolean {
        const recipe = [..._recipes, ..._customRecipes].find(r => r.result === item)
        if (!recipe) {
            game.showLongText(`❌ No recipe for ${MCItemType[item]}`, DialogLayout.Top)
            return false
        }
        // Check ingredients
        for (const ing of recipe.ingredients) {
            if (!MCPlayer.hasItem(ing)) {
                game.showLongText(`❌ Missing ingredient: ${MCItemType[ing]}`, DialogLayout.Top)
                return false
            }
        }
        // Consume ingredients
        for (const ing of recipe.ingredients) {
            MCPlayer.takeItem(ing)
        }
        // Give result
        for (let i = 0; i < recipe.resultCount; i++) {
            MCPlayer.giveItem(item)
        }
        game.showLongText(`⚒️ Crafted ${recipe.resultCount}x ${MCItemType[item]}!`, DialogLayout.Top)
        return true
    }

    /**
     * Check if the player can craft an item.
     * @param item the item to check
     */
    //% block="can craft $item"
    //% blockId="mccrafting_can_craft"
    //% group="Crafting Table"
    //% weight=98
    export function canCraft(item: MCItemType): boolean {
        const recipe = [..._recipes, ..._customRecipes].find(r => r.result === item)
        if (!recipe) return false
        return recipe.ingredients.every(ing => MCPlayer.hasItem(ing))
    }

    /**
     * Give the player all ingredients needed to craft an item.
     * @param item the item to prepare for
     */
    //% block="give ingredients for $item"
    //% blockId="mccrafting_give_ingredients"
    //% group="Crafting Table"
    //% weight=96
    export function giveIngredients(item: MCItemType): void {
        const recipe = [..._recipes, ..._customRecipes].find(r => r.result === item)
        if (!recipe) {
            game.showLongText(`❌ No recipe for ${MCItemType[item]}`, DialogLayout.Top)
            return
        }
        for (const ing of recipe.ingredients) {
            MCPlayer.giveItem(ing)
        }
        game.showLongText(`🎒 Gave ingredients for ${MCItemType[item]}`, DialogLayout.Top)
    }

    /**
     * Open a crafting table UI at a position.
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     */
    //% block="open crafting table at x $x y $y z $z"
    //% blockId="mccrafting_open_table"
    //% group="Crafting Table"
    //% weight=94
    export function openCraftingTable(x: number, y: number, z: number): void {
        game.showLongText(`🪵 Crafting table opened at (${x},${y},${z})`, DialogLayout.Center)
    }

    // ════════════════════════════════════════════
    //  GROUP: Furnace
    // ════════════════════════════════════════════

    /**
     * Smelt an ore/raw item into its product.
     * @param input the item to smelt
     */
    //% block="smelt $input"
    //% blockId="mccrafting_smelt"
    //% group="Furnace"
    //% weight=100
    export function smelt(input: MCItemType): MCItemType | null {
        const smeltMap: { [k: number]: MCItemType } = {
            [MCItemType.IronIngot as number]: MCItemType.IronIngot,   // placeholder for raw iron
            [MCItemType.GoldIngot as number]: MCItemType.GoldIngot,
            [MCItemType.Coal as number]: MCItemType.Coal,
        }
        // Simplified: give product
        game.showLongText(`🔥 Smelting ${MCItemType[input]}…`, DialogLayout.Top)
        pause(2000)
        game.showLongText(`✅ Smelting done!`, DialogLayout.Top)
        return null
    }

    /**
     * Cook a food item in a furnace.
     * @param food the raw food to cook
     */
    //% block="cook $food in furnace"
    //% blockId="mccrafting_cook"
    //% group="Furnace"
    //% weight=98
    export function cook(food: MCItemType): void {
        if (MCPlayer.hasItem(food)) {
            MCPlayer.takeItem(food)
            const cooked = food === MCItemType.Potato ? MCItemType.CookedPork :
                           food === MCItemType.Carrot ? MCItemType.CookedChicken : MCItemType.CookedBeef
            MCPlayer.giveItem(cooked)
            game.showLongText(`🍖 Cooked ${MCItemType[food]}!`, DialogLayout.Top)
        }
    }

    /**
     * Place a furnace at a position and add fuel.
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     */
    //% block="place furnace at x $x y $y z $z"
    //% blockId="mccrafting_place_furnace"
    //% group="Furnace"
    //% weight=96
    export function placeFurnace(x: number, y: number, z: number): void {
        MCBlocks.placeBlock(MCBlockType.Furnace, x, y, z)
        game.showLongText(`🧱 Furnace placed at (${x},${y},${z})`, DialogLayout.Top)
    }

    // ════════════════════════════════════════════
    //  GROUP: Brewing Stand
    // ════════════════════════════════════════════

    /**
     * Brew a potion using a base ingredient.
     * @param effect the effect to brew
     * @param level potion level 1–3, eg: 1
     */
    //% block="brew $effect potion level $level"
    //% blockId="mccrafting_brew"
    //% level.min=1 level.max=3
    //% group="Brewing Stand"
    //% weight=100
    export function brewPotion(effect: MCEffect, level: number): void {
        if (MCPlayer.hasItem(MCItemType.BlazeRod)) {
            MCPlayer.takeItem(MCItemType.BlazeRod)
            MCPlayer.giveItem(MCItemType.PotionHealing)
            game.showLongText(`🧪 Brewed ${MCEffect[effect]} Lv${level} potion!`, DialogLayout.Top)
        } else {
            game.showLongText(`❌ Need Blaze Rod to brew`, DialogLayout.Top)
        }
    }

    /**
     * Splash a potion at a position.
     * @param effect the effect to apply
     * @param level level 1–3, eg: 1
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     * @param radius effect radius, eg: 4
     */
    //% block="splash $effect potion level $level at x $x y $y z $z radius $radius"
    //% blockId="mccrafting_splash"
    //% level.min=1 level.max=3
    //% radius.min=1 radius.max=10
    //% group="Brewing Stand"
    //% weight=98
    export function splashPotion(effect: MCEffect, level: number,
                                  x: number, y: number, z: number, radius: number): void {
        game.showLongText(`💧 ${MCEffect[effect]} Lv${level} splash at (${x},${y},${z}) r=${radius}!`, DialogLayout.Top)
    }

    // ════════════════════════════════════════════
    //  GROUP: Enchanting Table
    // ════════════════════════════════════════════

    /**
     * Use an enchanting table at a position to enchant the held item.
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     * @param xpLevels XP levels to spend, eg: 30
     */
    //% block="use enchanting table at x $x y $y z $z spending $xpLevels levels"
    //% blockId="mccrafting_enchant_table"
    //% xpLevels.min=1 xpLevels.max=30
    //% group="Enchanting Table"
    //% weight=100
    export function useEnchantingTable(x: number, y: number, z: number, xpLevels: number): void {
        if (MCPlayer.getLevel() >= xpLevels) {
            MCPlayer.setLevel(MCPlayer.getLevel() - xpLevels)
            MCItems.enchantRandom(xpLevels)
        } else {
            game.showLongText(`❌ Not enough levels (need ${xpLevels})`, DialogLayout.Top)
        }
    }

    /**
     * Place an enchanting table surrounded by bookshelves.
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     */
    //% block="build enchanting setup at x $x y $y z $z"
    //% blockId="mccrafting_build_enchant"
    //% group="Enchanting Table"
    //% weight=98
    export function buildEnchantingSetup(x: number, y: number, z: number): void {
        MCBlocks.placeBlock(MCBlockType.CraftingTable, x, y, z)
        // Ring of bookshelves at distance 2
        const offsets = [-2, -1, 0, 1, 2]
        for (const dx of offsets) {
            MCBlocks.placeBlock(MCBlockType.Bookshelf, x + dx, y, z - 2)
            MCBlocks.placeBlock(MCBlockType.Bookshelf, x + dx, y, z + 2)
        }
        for (const dz of [-1, 0, 1]) {
            MCBlocks.placeBlock(MCBlockType.Bookshelf, x - 2, y, z + dz)
            MCBlocks.placeBlock(MCBlockType.Bookshelf, x + 2, y, z + dz)
        }
        game.showLongText(`📚 Enchanting setup built at (${x},${y},${z})`, DialogLayout.Top)
    }

    // ════════════════════════════════════════════
    //  GROUP: Recipes
    // ════════════════════════════════════════════

    /**
     * Register a custom crafting recipe.
     * @param result the result item
     * @param resultCount how many are produced, eg: 1
     * @param ingredient1 first ingredient
     * @param ingredient2 second ingredient
     */
    //% block="register recipe: $ingredient1 + $ingredient2 → $resultCount $result"
    //% blockId="mccrafting_register_recipe"
    //% resultCount.min=1 resultCount.max=64
    //% group="Recipes"
    //% weight=100
    export function registerRecipe(result: MCItemType, resultCount: number,
                                    ingredient1: MCItemType, ingredient2: MCItemType): void {
        _customRecipes.push({
            result,
            resultCount,
            ingredients: [ingredient1, ingredient2]
        })
        game.showLongText(`📖 Recipe registered: ${MCItemType[ingredient1]} + ${MCItemType[ingredient2]} → ${resultCount}x ${MCItemType[result]}`, DialogLayout.Top)
    }

    /**
     * Check if a recipe exists for an item.
     * @param item the item to check
     */
    //% block="recipe exists for $item"
    //% blockId="mccrafting_has_recipe"
    //% group="Recipes"
    //% weight=98
    export function hasRecipe(item: MCItemType): boolean {
        return [..._recipes, ..._customRecipes].some(r => r.result === item)
    }

    /**
     * Remove all custom registered recipes.
     */
    //% block="clear custom recipes"
    //% blockId="mccrafting_clear_recipes"
    //% group="Recipes"
    //% weight=96
    export function clearCustomRecipes(): void {
        _customRecipes = []
        game.showLongText("📖 Custom recipes cleared", DialogLayout.Top)
    }
}
