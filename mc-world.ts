// ============================================================
// mc-world.ts  —  🌍 World Drawer
// Controls time, weather, biomes, dimensions, and terrain.
// ============================================================

/**
 * 🌍 World
 * Control the Minecraft world: time, weather, biomes, terrain, and dimensions.
 */
//% color="#4CAF50"
//% icon="\uf0ac"
//% weight=100
//% blockGap=8
//% groups='["Time & Weather","Biomes & Terrain","Dimensions","Structures","World Settings"]'
namespace MCWorld {

    // ─── Internal State ──────────────────────────────────────────
    let _time: number = 0
    let _weather: MCWeather = MCWeather.Clear
    let _dimension: MCDimension = MCDimension.Overworld
    let _doMobSpawning: boolean = true
    let _doDayNightCycle: boolean = true
    let _gravity: boolean = true
    let _worldSeed: number = Math.randomRange(0, 999999)
    let _worldName: string = "My World"

    // ════════════════════════════════════════════
    //  GROUP: Time & Weather
    // ════════════════════════════════════════════

    /**
     * Set the time of day using a preset.
     * @param time the time of day preset
     */
    //% block="set time to $time"
    //% blockId="mcworld_set_time_preset"
    //% group="Time & Weather"
    //% weight=100
    export function setTimeOfDay(time: MCTimeOfDay): void {
        _time = time
        game.showLongText(`⏰ Time set to ${MCTimeOfDay[time]}`, DialogLayout.Top)
    }

    /**
     * Set the time of day to a custom tick value (0–24000).
     * @param ticks tick value 0 to 24000, eg: 6000
     */
    //% block="set time to $ticks ticks"
    //% blockId="mcworld_set_time_ticks"
    //% ticks.min=0 ticks.max=24000
    //% group="Time & Weather"
    //% weight=98
    export function setTime(ticks: number): void {
        _time = Math.clamp(0, 24000, ticks)
    }

    /**
     * Add time ticks to the current time.
     * @param ticks ticks to advance, eg: 1000
     */
    //% block="advance time by $ticks ticks"
    //% blockId="mcworld_advance_time"
    //% ticks.min=1 ticks.max=24000
    //% group="Time & Weather"
    //% weight=96
    export function advanceTime(ticks: number): void {
        _time = (_time + ticks) % 24000
    }

    /**
     * Get the current time in ticks.
     */
    //% block="current time (ticks)"
    //% blockId="mcworld_get_time"
    //% group="Time & Weather"
    //% weight=94
    export function getTime(): number {
        return _time
    }

    /**
     * Returns true if it is currently daytime.
     */
    //% block="is daytime"
    //% blockId="mcworld_is_daytime"
    //% group="Time & Weather"
    //% weight=92
    export function isDaytime(): boolean {
        return _time >= 0 && _time < 12000
    }

    /**
     * Returns true if it is currently nighttime.
     */
    //% block="is nighttime"
    //% blockId="mcworld_is_nighttime"
    //% group="Time & Weather"
    //% weight=90
    export function isNighttime(): boolean {
        return _time >= 12000
    }

    /**
     * Set the weather.
     * @param weather the weather to set
     */
    //% block="set weather to $weather"
    //% blockId="mcworld_set_weather"
    //% group="Time & Weather"
    //% weight=88
    export function setWeather(weather: MCWeather): void {
        _weather = weather
        game.showLongText(`🌤 Weather: ${MCWeather[weather]}`, DialogLayout.Top)
    }

    /**
     * Get the current weather.
     */
    //% block="current weather"
    //% blockId="mcworld_get_weather"
    //% group="Time & Weather"
    //% weight=86
    export function getWeather(): MCWeather {
        return _weather
    }

    /**
     * Returns true if the weather matches.
     * @param weather the weather to check
     */
    //% block="weather is $weather"
    //% blockId="mcworld_weather_is"
    //% group="Time & Weather"
    //% weight=84
    export function weatherIs(weather: MCWeather): boolean {
        return _weather === weather
    }

    /**
     * Set whether the day/night cycle is active.
     * @param on true to enable the cycle
     */
    //% block="day/night cycle $on"
    //% blockId="mcworld_day_night_cycle"
    //% on.shadow="toggleOnOff"
    //% group="Time & Weather"
    //% weight=80
    export function setDayNightCycle(on: boolean): void {
        _doDayNightCycle = on
    }

    // ════════════════════════════════════════════
    //  GROUP: Biomes & Terrain
    // ════════════════════════════════════════════

    /**
     * Get the biome at a position.
     * @param x x coordinate, eg: 0
     * @param z z coordinate, eg: 0
     */
    //% block="biome at x $x z $z"
    //% blockId="mcworld_get_biome"
    //% group="Biomes & Terrain"
    //% weight=78
    export function getBiomeAt(x: number, z: number): MCBiome {
        // Simulated biome generation using noise
        const val = Math.abs(Math.sin(x * 0.01 + z * 0.013) * 14) | 0
        return val as MCBiome
    }

    /**
     * Get the highest solid block at a column.
     * @param x x coordinate, eg: 0
     * @param z z coordinate, eg: 0
     */
    //% block="highest block y at x $x z $z"
    //% blockId="mcworld_highest_block"
    //% group="Biomes & Terrain"
    //% weight=76
    export function getHighestBlock(x: number, z: number): number {
        // Simulated terrain height
        return 64 + (Math.sin(x * 0.05) * 10 + Math.cos(z * 0.05) * 8) | 0
    }

    /**
     * Generate a structure at a position.
     * @param structure the structure type
     * @param x x coordinate, eg: 0
     * @param y y coordinate, eg: 64
     * @param z z coordinate, eg: 0
     */
    //% block="generate $structure at x $x y $y z $z"
    //% blockId="mcworld_generate_structure"
    //% group="Biomes & Terrain"
    //% weight=74
    export function generateStructure(structure: MCStructure, x: number, y: number, z: number): void {
        game.showLongText(`🏗 Generated ${MCStructure[structure]} at (${x},${y},${z})`, DialogLayout.Top)
    }

    /**
     * Set the world seed for procedural generation.
     * @param seed the seed value, eg: 12345
     */
    //% block="set world seed to $seed"
    //% blockId="mcworld_set_seed"
    //% group="Biomes & Terrain"
    //% weight=72
    export function setWorldSeed(seed: number): void {
        _worldSeed = seed
    }

    /**
     * Get the current world seed.
     */
    //% block="world seed"
    //% blockId="mcworld_get_seed"
    //% group="Biomes & Terrain"
    //% weight=70
    export function getWorldSeed(): number {
        return _worldSeed
    }

    /**
     * Find the nearest structure of a given type from a position.
     * @param structure the structure to find
     * @param fromX x origin, eg: 0
     * @param fromZ z origin, eg: 0
     */
    //% block="find nearest $structure from x $fromX z $fromZ"
    //% blockId="mcworld_find_structure"
    //% group="Biomes & Terrain"
    //% weight=68
    export function findNearestStructure(structure: MCStructure, fromX: number, fromZ: number): MCPosition {
        // Simulated find
        const ox = fromX + Math.randomRange(-500, 500)
        const oz = fromZ + Math.randomRange(-500, 500)
        return new MCPosition(ox, 64, oz)
    }

    // ════════════════════════════════════════════
    //  GROUP: Dimensions
    // ════════════════════════════════════════════

    /**
     * Get the current dimension.
     */
    //% block="current dimension"
    //% blockId="mcworld_get_dimension"
    //% group="Dimensions"
    //% weight=66
    export function getDimension(): MCDimension {
        return _dimension
    }

    /**
     * Check if the player is in a specific dimension.
     * @param dimension the dimension to check
     */
    //% block="player is in $dimension"
    //% blockId="mcworld_in_dimension"
    //% group="Dimensions"
    //% weight=64
    export function playerIsInDimension(dimension: MCDimension): boolean {
        return _dimension === dimension
    }

    /**
     * Travel to a dimension (simulated portal).
     * @param dimension the target dimension
     */
    //% block="travel to $dimension"
    //% blockId="mcworld_travel_dimension"
    //% group="Dimensions"
    //% weight=62
    export function travelToDimension(dimension: MCDimension): void {
        _dimension = dimension
        game.showLongText(`🌀 Entering: ${MCDimension[dimension]}`, DialogLayout.Bottom)
    }

    // ════════════════════════════════════════════
    //  GROUP: World Settings
    // ════════════════════════════════════════════

    /**
     * Set the world name.
     * @param name the world name, eg: "My World"
     */
    //% block="set world name to $name"
    //% blockId="mcworld_set_name"
    //% group="World Settings"
    //% weight=58
    export function setWorldName(name: string): void {
        _worldName = name
    }

    /**
     * Get the world name.
     */
    //% block="world name"
    //% blockId="mcworld_get_name"
    //% group="World Settings"
    //% weight=56
    export function getWorldName(): string {
        return _worldName
    }

    /**
     * Enable or disable mob spawning.
     * @param on true to enable mob spawning
     */
    //% block="mob spawning $on"
    //% blockId="mcworld_mob_spawning"
    //% on.shadow="toggleOnOff"
    //% group="World Settings"
    //% weight=54
    export function setMobSpawning(on: boolean): void {
        _doMobSpawning = on
    }

    /**
     * Enable or disable gravity.
     * @param on true to enable gravity
     */
    //% block="gravity $on"
    //% blockId="mcworld_gravity"
    //% on.shadow="toggleOnOff"
    //% group="World Settings"
    //% weight=52
    export function setGravity(on: boolean): void {
        _gravity = on
    }

    /**
     * Returns true if mob spawning is enabled.
     */
    //% block="mob spawning is enabled"
    //% blockId="mcworld_mob_spawning_enabled"
    //% group="World Settings"
    //% weight=50
    export function isMobSpawningEnabled(): boolean {
        return _doMobSpawning
    }

    /**
     * Create a position value.
     * @param x x coordinate, eg: 0
     * @param y y coordinate, eg: 64
     * @param z z coordinate, eg: 0
     */
    //% block="position x $x y $y z $z"
    //% blockId="mcworld_position"
    //% group="World Settings"
    //% weight=48
    //% color="#5B8731"
    export function position(x: number, y: number, z: number): MCPosition {
        return new MCPosition(x, y, z)
    }
}
