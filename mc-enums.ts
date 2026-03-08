// ============================================================
// mc-enums.ts  —  Minecraft Arcade Extension
// All shared enums, types, and constants
// ============================================================

/**
 * A 3-D position in the Minecraft world.
 */
//% blockNamespace="MCWorld"
class MCPosition {
    constructor(public x: number, public y: number, public z: number) {}

    toString(): string {
        return `(${this.x}, ${this.y}, ${this.z})`
    }

    add(other: MCPosition): MCPosition {
        return new MCPosition(this.x + other.x, this.y + other.y, this.z + other.z)
    }

    equals(other: MCPosition): boolean {
        return this.x === other.x && this.y === other.y && this.z === other.z
    }
}

/**
 * All block types available in the Minecraft world.
 */
enum MCBlockType {
    //% block="Air"
    Air = 0,
    //% block="Stone"
    Stone = 1,
    //% block="Grass"
    Grass = 2,
    //% block="Dirt"
    Dirt = 3,
    //% block="Cobblestone"
    Cobblestone = 4,
    //% block="Oak Planks"
    OakPlanks = 5,
    //% block="Oak Sapling"
    OakSapling = 6,
    //% block="Bedrock"
    Bedrock = 7,
    //% block="Water"
    Water = 8,
    //% block="Lava"
    Lava = 10,
    //% block="Sand"
    Sand = 12,
    //% block="Gravel"
    Gravel = 13,
    //% block="Gold Ore"
    GoldOre = 14,
    //% block="Iron Ore"
    IronOre = 15,
    //% block="Coal Ore"
    CoalOre = 16,
    //% block="Oak Log"
    OakLog = 17,
    //% block="Oak Leaves"
    OakLeaves = 18,
    //% block="Sponge"
    Sponge = 19,
    //% block="Glass"
    Glass = 20,
    //% block="Diamond Ore"
    DiamondOre = 56,
    //% block="Gold Block"
    GoldBlock = 41,
    //% block="Iron Block"
    IronBlock = 42,
    //% block="Diamond Block"
    DiamondBlock = 57,
    //% block="Crafting Table"
    CraftingTable = 58,
    //% block="Furnace"
    Furnace = 61,
    //% block="TNT"
    TNT = 46,
    //% block="Bookshelf"
    Bookshelf = 47,
    //% block="Mossy Cobblestone"
    MossyCobblestone = 48,
    //% block="Obsidian"
    Obsidian = 49,
    //% block="Torch"
    Torch = 50,
    //% block="Chest"
    Chest = 54,
    //% block="Redstone Ore"
    RedstoneOre = 73,
    //% block="Snow"
    Snow = 78,
    //% block="Ice"
    Ice = 79,
    //% block="Cactus"
    Cactus = 81,
    //% block="Clay"
    Clay = 82,
    //% block="Pumpkin"
    Pumpkin = 86,
    //% block="Netherrack"
    Netherrack = 87,
    //% block="Glowstone"
    Glowstone = 89,
    //% block="Jack-o-Lantern"
    JackOLantern = 91,
    //% block="Nether Brick"
    NetherBrick = 112,
    //% block="End Stone"
    EndStone = 121,
    //% block="Emerald Ore"
    EmeraldOre = 129,
    //% block="Beacon"
    Beacon = 138,
    //% block="Redstone Block"
    RedstoneBlock = 152,
    //% block="Quartz Block"
    QuartzBlock = 155,
    //% block="Hay Bale"
    HayBale = 170,
    //% block="Wool (White)"
    WoolWhite = 35,
    //% block="Terracotta"
    Terracotta = 159
}

/**
 * Item types the player can hold or use.
 */
enum MCItemType {
    //% block="Iron Sword"
    IronSword = 267,
    //% block="Iron Shovel"
    IronShovel = 256,
    //% block="Iron Pickaxe"
    IronPickaxe = 257,
    //% block="Iron Axe"
    IronAxe = 258,
    //% block="Diamond Sword"
    DiamondSword = 276,
    //% block="Diamond Shovel"
    DiamondShovel = 277,
    //% block="Diamond Pickaxe"
    DiamondPickaxe = 278,
    //% block="Diamond Axe"
    DiamondAxe = 279,
    //% block="Wooden Sword"
    WoodenSword = 268,
    //% block="Golden Sword"
    GoldenSword = 283,
    //% block="Stone Sword"
    StoneSword = 272,
    //% block="Bow"
    Bow = 261,
    //% block="Arrow"
    Arrow = 262,
    //% block="Fishing Rod"
    FishingRod = 346,
    //% block="Flint and Steel"
    FlintAndSteel = 259,
    //% block="Apple"
    Apple = 260,
    //% block="Bread"
    Bread = 297,
    //% block="Cooked Beef"
    CookedBeef = 364,
    //% block="Cooked Pork"
    CookedPork = 320,
    //% block="Cooked Chicken"
    CookedChicken = 366,
    //% block="Golden Apple"
    GoldenApple = 322,
    //% block="Carrot"
    Carrot = 391,
    //% block="Potato"
    Potato = 392,
    //% block="Iron Helmet"
    IronHelmet = 306,
    //% block="Iron Chestplate"
    IronChestplate = 307,
    //% block="Iron Leggings"
    IronLeggings = 308,
    //% block="Iron Boots"
    IronBoots = 309,
    //% block="Diamond Helmet"
    DiamondHelmet = 310,
    //% block="Diamond Chestplate"
    DiamondChestplate = 311,
    //% block="Diamond Leggings"
    DiamondLeggings = 312,
    //% block="Diamond Boots"
    DiamondBoots = 313,
    //% block="Bucket"
    Bucket = 325,
    //% block="Compass"
    Compass = 345,
    //% block="Clock"
    Clock = 347,
    //% block="Map"
    Map = 395,
    //% block="Saddle"
    Saddle = 329,
    //% block="Bone"
    Bone = 352,
    //% block="String"
    String = 287,
    //% block="Feather"
    Feather = 288,
    //% block="Coal"
    Coal = 263,
    //% block="Iron Ingot"
    IronIngot = 265,
    //% block="Gold Ingot"
    GoldIngot = 266,
    //% block="Diamond"
    Diamond = 264,
    //% block="Emerald"
    Emerald = 388,
    //% block="Stick"
    Stick = 280,
    //% block="Redstone Dust"
    RedstoneDust = 331,
    //% block="Blaze Rod"
    BlazeRod = 369,
    //% block="Ender Pearl"
    EnderPearl = 368,
    //% block="Eye of Ender"
    EyeOfEnder = 381,
    //% block="Nether Star"
    NetherStar = 399,
    //% block="Potion (Healing)"
    PotionHealing = 373,
    //% block="Potion (Speed)"
    PotionSpeed = 374,
    //% block="Potion (Strength)"
    PotionStrength = 375,
    //% block="Potion (Night Vision)"
    PotionNightVision = 376,
    //% block="Book"
    Book = 340,
    //% block="Written Book"
    WrittenBook = 387
}

/**
 * Mob/Entity types.
 */
enum MCMobType {
    //% block="Creeper"
    Creeper = 0,
    //% block="Skeleton"
    Skeleton = 1,
    //% block="Spider"
    Spider = 2,
    //% block="Zombie"
    Zombie = 4,
    //% block="Slime"
    Slime = 5,
    //% block="Ghast"
    Ghast = 6,
    //% block="Zombie Pigman"
    ZombiePigman = 7,
    //% block="Enderman"
    Enderman = 8,
    //% block="Blaze"
    Blaze = 9,
    //% block="Magma Cube"
    MagmaCube = 10,
    //% block="Ender Dragon"
    EnderDragon = 11,
    //% block="Wither"
    Wither = 12,
    //% block="Bat"
    Bat = 13,
    //% block="Witch"
    Witch = 14,
    //% block="Zombie Villager"
    ZombieVillager = 15,
    //% block="Pig"
    Pig = 20,
    //% block="Sheep"
    Sheep = 21,
    //% block="Cow"
    Cow = 22,
    //% block="Chicken"
    Chicken = 23,
    //% block="Wolf"
    Wolf = 25,
    //% block="Mooshroom"
    Mooshroom = 26,
    //% block="Horse"
    Horse = 27,
    //% block="Cat"
    Cat = 28,
    //% block="Ocelot"
    Ocelot = 29,
    //% block="Villager"
    Villager = 30,
    //% block="Iron Golem"
    IronGolem = 31,
    //% block="Snow Golem"
    SnowGolem = 32,
    //% block="Squid"
    Squid = 33,
    //% block="Rabbit"
    Rabbit = 34,
    //% block="Polar Bear"
    PolarBear = 35,
    //% block="Parrot"
    Parrot = 36,
    //% block="Llama"
    Llama = 37,
    //% block="Dolphin"
    Dolphin = 38,
    //% block="Turtle"
    Turtle = 39,
    //% block="Panda"
    Panda = 40,
    //% block="Fox"
    Fox = 41
}

/**
 * Biome types.
 */
enum MCBiome {
    //% block="Plains"
    Plains = 0,
    //% block="Forest"
    Forest = 1,
    //% block="Jungle"
    Jungle = 2,
    //% block="Desert"
    Desert = 3,
    //% block="Savanna"
    Savanna = 4,
    //% block="Swamp"
    Swamp = 5,
    //% block="Taiga"
    Taiga = 6,
    //% block="Snowy Tundra"
    SnowyTundra = 7,
    //% block="Mountains"
    Mountains = 8,
    //% block="Beach"
    Beach = 9,
    //% block="Ocean"
    Ocean = 10,
    //% block="Deep Ocean"
    DeepOcean = 11,
    //% block="Mushroom Island"
    MushroomIsland = 12,
    //% block="Nether"
    Nether = 13,
    //% block="The End"
    TheEnd = 14
}

/**
 * Weather states.
 */
enum MCWeather {
    //% block="Clear"
    Clear = 0,
    //% block="Rain"
    Rain = 1,
    //% block="Thunder"
    Thunder = 2,
    //% block="Snow"
    Snow = 3
}

/**
 * Game modes.
 */
enum MCGameMode {
    //% block="Survival"
    Survival = 0,
    //% block="Creative"
    Creative = 1,
    //% block="Adventure"
    Adventure = 2,
    //% block="Spectator"
    Spectator = 3
}

/**
 * Compass directions.
 */
enum MCDirection {
    //% block="North"
    North = 0,
    //% block="South"
    South = 1,
    //% block="East"
    East = 2,
    //% block="West"
    West = 3,
    //% block="Up"
    Up = 4,
    //% block="Down"
    Down = 5
}

/**
 * Enchantment types.
 */
enum MCEnchantment {
    //% block="Sharpness"
    Sharpness = 0,
    //% block="Smite"
    Smite = 1,
    //% block="Bane of Arthropods"
    BaneOfArthropods = 2,
    //% block="Knockback"
    Knockback = 3,
    //% block="Fire Aspect"
    FireAspect = 4,
    //% block="Looting"
    Looting = 5,
    //% block="Efficiency"
    Efficiency = 6,
    //% block="Silk Touch"
    SilkTouch = 7,
    //% block="Unbreaking"
    Unbreaking = 8,
    //% block="Fortune"
    Fortune = 9,
    //% block="Power"
    Power = 10,
    //% block="Punch"
    Punch = 11,
    //% block="Flame"
    Flame = 12,
    //% block="Infinity"
    Infinity = 13,
    //% block="Protection"
    Protection = 14,
    //% block="Fire Protection"
    FireProtection = 15,
    //% block="Blast Protection"
    BlastProtection = 16,
    //% block="Projectile Protection"
    ProjectileProtection = 17,
    //% block="Feather Falling"
    FeatherFalling = 18,
    //% block="Respiration"
    Respiration = 19,
    //% block="Aqua Affinity"
    AquaAffinity = 20,
    //% block="Thorns"
    Thorns = 21,
    //% block="Depth Strider"
    DepthStrider = 22,
    //% block="Mending"
    Mending = 23,
    //% block="Curse of Binding"
    CurseOfBinding = 24,
    //% block="Curse of Vanishing"
    CurseOfVanishing = 25
}

/**
 * Potion effects.
 */
enum MCEffect {
    //% block="Speed"
    Speed = 1,
    //% block="Slowness"
    Slowness = 2,
    //% block="Haste"
    Haste = 3,
    //% block="Mining Fatigue"
    MiningFatigue = 4,
    //% block="Strength"
    Strength = 5,
    //% block="Instant Health"
    InstantHealth = 6,
    //% block="Instant Damage"
    InstantDamage = 7,
    //% block="Jump Boost"
    JumpBoost = 8,
    //% block="Nausea"
    Nausea = 9,
    //% block="Regeneration"
    Regeneration = 10,
    //% block="Resistance"
    Resistance = 11,
    //% block="Fire Resistance"
    FireResistance = 12,
    //% block="Water Breathing"
    WaterBreathing = 13,
    //% block="Invisibility"
    Invisibility = 14,
    //% block="Blindness"
    Blindness = 15,
    //% block="Night Vision"
    NightVision = 16,
    //% block="Hunger"
    Hunger = 17,
    //% block="Weakness"
    Weakness = 18,
    //% block="Poison"
    Poison = 19,
    //% block="Wither Effect"
    WitherEffect = 20,
    //% block="Absorption"
    Absorption = 22,
    //% block="Glowing"
    Glowing = 24,
    //% block="Levitation"
    Levitation = 25,
    //% block="Luck"
    Luck = 26,
    //% block="Slow Falling"
    SlowFalling = 28
}

/**
 * Redstone signal strength levels (0–15).
 */
enum MCSignalStrength {
    //% block="Off (0)"
    Off = 0,
    //% block="Weak (4)"
    Weak = 4,
    //% block="Medium (8)"
    Medium = 8,
    //% block="Strong (12)"
    Strong = 12,
    //% block="Full (15)"
    Full = 15
}

/**
 * Armor slots.
 */
enum MCArmorSlot {
    //% block="Helmet"
    Helmet = 0,
    //% block="Chestplate"
    Chestplate = 1,
    //% block="Leggings"
    Leggings = 2,
    //% block="Boots"
    Boots = 3
}

/**
 * Time of day presets (in ticks, 0–24000).
 */
enum MCTimeOfDay {
    //% block="Sunrise (0)"
    Sunrise = 0,
    //% block="Noon (6000)"
    Noon = 6000,
    //% block="Sunset (12000)"
    Sunset = 12000,
    //% block="Midnight (18000)"
    Midnight = 18000
}

/**
 * Dimension types.
 */
enum MCDimension {
    //% block="Overworld"
    Overworld = 0,
    //% block="Nether"
    Nether = 1,
    //% block="The End"
    TheEnd = 2
}

/**
 * Mob AI goals.
 */
enum MCMobBehavior {
    //% block="Attack Player"
    AttackPlayer = 0,
    //% block="Flee Player"
    FleePlayer = 1,
    //% block="Wander"
    Wander = 2,
    //% block="Stay Still"
    StayStill = 3,
    //% block="Follow Player"
    FollowPlayer = 4,
    //% block="Guard Area"
    GuardArea = 5,
    //% block="Attack Mobs"
    AttackMobs = 6
}

/**
 * Structure types that can be generated.
 */
enum MCStructure {
    //% block="Village"
    Village = 0,
    //% block="Temple"
    Temple = 1,
    //% block="Dungeon"
    Dungeon = 2,
    //% block="Stronghold"
    Stronghold = 3,
    //% block="Mineshaft"
    Mineshaft = 4,
    //% block="Ocean Monument"
    OceanMonument = 5,
    //% block="Woodland Mansion"
    WoodlandMansion = 6,
    //% block="Igloo"
    Igloo = 7,
    //% block="Shipwreck"
    Shipwreck = 8,
    //% block="Ruined Portal"
    RuinedPortal = 9,
    //% block="Nether Fortress"
    NetherFortress = 10,
    //% block="End City"
    EndCity = 11
}
