// ============================================================
// mc-commands.ts  —  ⌨️ Commands Drawer
// Run slash-commands, game rules, and admin tools.
// ============================================================

/**
 * ⌨️ Commands
 * Run game rules, admin commands, teleports, and execute sequences.
 */
//% color="#37474F"
//% icon="\uf120"
//% weight=10
//% blockGap=8
//% groups='["Game Rules","Admin Tools","Teleport Commands","Sequences","Debug"]'
namespace MCCommands {

    // ─── Game rule flags ─────────────────────────────────────────
    let _rules: { [name: string]: boolean | number } = {
        "doDaylightCycle": true,
        "doFireTick": true,
        "doMobSpawning": true,
        "doMobLoot": true,
        "doTileDrops": true,
        "doWeatherCycle": true,
        "keepInventory": false,
        "mobGriefing": true,
        "naturalRegeneration": true,
        "pvp": true,
        "showDeathMessages": true,
        "randomTickSpeed": 3,
        "maxEntityCramming": 24
    }

    // ════════════════════════════════════════════
    //  GROUP: Game Rules
    // ════════════════════════════════════════════

    /**
     * Enable or disable a boolean game rule.
     * @param rule the rule name, eg: "keepInventory"
     * @param value true or false
     */
    //% block="gamerule $rule = $value"
    //% blockId="mccmds_gamerule_bool"
    //% value.shadow="toggleTrueFalse"
    //% group="Game Rules"
    //% weight=100
    export function setGameRuleBool(rule: string, value: boolean): void {
        _rules[rule] = value
        game.showLongText(`⚙ gamerule ${rule} = ${value}`, DialogLayout.Top)

        // Apply well-known rules
        if (rule === "doMobSpawning") MCWorld.setMobSpawning(value)
        if (rule === "doDaylightCycle") MCWorld.setDayNightCycle(value)
    }

    /**
     * Set a numeric game rule.
     * @param rule the rule name, eg: "randomTickSpeed"
     * @param value the value, eg: 3
     */
    //% block="gamerule $rule = $value"
    //% blockId="mccmds_gamerule_num"
    //% group="Game Rules"
    //% weight=98
    export function setGameRuleNum(rule: string, value: number): void {
        _rules[rule] = value
        game.showLongText(`⚙ gamerule ${rule} = ${value}`, DialogLayout.Top)
    }

    /**
     * Get the value of a game rule (as a number).
     * @param rule the rule name, eg: "randomTickSpeed"
     */
    //% block="gamerule $rule (number)"
    //% blockId="mccmds_get_rule_num"
    //% group="Game Rules"
    //% weight=96
    export function getGameRuleNum(rule: string): number {
        const v = _rules[rule]
        return typeof v === "number" ? v : (v ? 1 : 0)
    }

    /**
     * Get the boolean value of a game rule.
     * @param rule the rule name, eg: "keepInventory"
     */
    //% block="gamerule $rule (boolean)"
    //% blockId="mccmds_get_rule_bool"
    //% group="Game Rules"
    //% weight=94
    export function getGameRuleBool(rule: string): boolean {
        const v = _rules[rule]
        return typeof v === "boolean" ? v : (v !== 0)
    }

    /**
     * Reset all game rules to defaults.
     */
    //% block="reset all game rules"
    //% blockId="mccmds_reset_rules"
    //% group="Game Rules"
    //% weight=92
    export function resetGameRules(): void {
        _rules["doDaylightCycle"] = true
        _rules["doMobSpawning"] = true
        _rules["keepInventory"] = false
        game.showLongText("⚙ Game rules reset to default", DialogLayout.Top)
    }

    // ════════════════════════════════════════════
    //  GROUP: Admin Tools
    // ════════════════════════════════════════════

    /**
     * Execute a /kill command (remove all mobs).
     * @param target target descriptor, eg: "@e[type=zombie]"
     */
    //% block="execute /kill $target"
    //% blockId="mccmds_kill"
    //% group="Admin Tools"
    //% weight=100
    export function executeKill(target: string): void {
        if (target.indexOf("zombie") >= 0) MCMobs.removeAllOfType(MCMobType.Zombie)
        else if (target.indexOf("skeleton") >= 0) MCMobs.removeAllOfType(MCMobType.Skeleton)
        else if (target.indexOf("creeper") >= 0) MCMobs.removeAllOfType(MCMobType.Creeper)
        else MCMobs.removeAllMobs()
        game.showLongText(`⚡ /kill ${target}`, DialogLayout.Top)
    }

    /**
     * Execute a /clear command (clear player inventory).
     * @param target the target, eg: "@p"
     */
    //% block="execute /clear $target"
    //% blockId="mccmds_clear"
    //% group="Admin Tools"
    //% weight=98
    export function executeClear(target: string): void {
        MCPlayer.clearInventory()
        game.showLongText(`⚡ /clear ${target}`, DialogLayout.Top)
    }

    /**
     * Execute a /summon command (spawn a mob).
     * @param mob mob type to spawn
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     */
    //% block="execute /summon $mob at x $x y $y z $z"
    //% blockId="mccmds_summon"
    //% group="Admin Tools"
    //% weight=96
    export function executeSummon(mob: MCMobType, x: number, y: number, z: number): void {
        MCMobs.spawn(mob, x, y, z)
    }

    /**
     * Execute a /give command.
     * @param item the item to give
     * @param count how many, eg: 1
     */
    //% block="execute /give @p $item $count"
    //% blockId="mccmds_give"
    //% count.min=1 count.max=64
    //% group="Admin Tools"
    //% weight=94
    export function executeGive(item: MCItemType, count: number): void {
        MCItems.give(item, count)
    }

    /**
     * Execute a /fill command.
     * @param block the block type
     * @param x1 start x, eg: 0
     * @param y1 start y, eg: 60
     * @param z1 start z, eg: 0
     * @param x2 end x, eg: 5
     * @param y2 end y, eg: 65
     * @param z2 end z, eg: 5
     */
    //% block="execute /fill $block x $x1 y $y1 z $z1 to x $x2 y $y2 z $z2"
    //% blockId="mccmds_fill"
    //% group="Admin Tools"
    //% weight=92
    export function executeFill(block: MCBlockType,
        x1: number, y1: number, z1: number,
        x2: number, y2: number, z2: number): void {
        MCBlocks.fillBlocks(block, x1, y1, z1, x2, y2, z2)
    }

    /**
     * Execute a /effect command.
     * @param effect effect to apply
     * @param duration seconds, eg: 30
     * @param level amplifier 1–3, eg: 1
     */
    //% block="execute /effect @p $effect $duration s level $level"
    //% blockId="mccmds_effect"
    //% duration.min=1 duration.max=300
    //% level.min=1 level.max=3
    //% group="Admin Tools"
    //% weight=90
    export function executeEffect(effect: MCEffect, duration: number, level: number): void {
        MCPlayer.applyEffect(effect, duration, level)
    }

    // ════════════════════════════════════════════
    //  GROUP: Teleport Commands
    // ════════════════════════════════════════════

    /**
     * Teleport the player to world spawn.
     */
    //% block="teleport to world spawn"
    //% blockId="mccmds_spawn"
    //% group="Teleport Commands"
    //% weight=100
    export function teleportToSpawn(): void {
        MCPlayer.teleport(0, 64, 0)
        game.showLongText("🏠 Teleported to spawn", DialogLayout.Top)
    }

    /**
     * Teleport the player to the Nether portal.
     */
    //% block="enter Nether"
    //% blockId="mccmds_enter_nether"
    //% group="Teleport Commands"
    //% weight=98
    export function enterNether(): void {
        MCWorld.travelToDimension(MCDimension.Nether)
        MCPlayer.teleport(MCPlayer.getX() / 8 | 0, 64, MCPlayer.getZ() / 8 | 0)
    }

    /**
     * Teleport to The End.
     */
    //% block="enter The End"
    //% blockId="mccmds_enter_end"
    //% group="Teleport Commands"
    //% weight=96
    export function enterTheEnd(): void {
        MCWorld.travelToDimension(MCDimension.TheEnd)
        MCPlayer.teleport(0, 64, 0)
        MCMobs.spawn(MCMobType.EnderDragon, 0, 80, 0)
        game.showLongText("🐉 The Ender Dragon awakens!", DialogLayout.Center)
    }

    // ════════════════════════════════════════════
    //  GROUP: Sequences
    // ════════════════════════════════════════════

    /**
     * Start a survival game scenario (night wave).
     * @param waveNumber the wave number, eg: 1
     */
    //% block="start mob wave $waveNumber"
    //% blockId="mccmds_wave"
    //% waveNumber.min=1 waveNumber.max=20
    //% group="Sequences"
    //% weight=100
    export function startMobWave(waveNumber: number): void {
        MCWorld.setTimeOfDay(MCTimeOfDay.Midnight)
        const mobCount = 5 + waveNumber * 2
        MCMobs.spawnMany(MCMobType.Zombie, mobCount, MCPlayer.getX(), MCPlayer.getY(), MCPlayer.getZ())
        if (waveNumber > 3)
            MCMobs.spawnMany(MCMobType.Skeleton, Math.ceil(mobCount / 2),
                MCPlayer.getX(), MCPlayer.getY(), MCPlayer.getZ())
        if (waveNumber > 7)
            MCMobs.spawnMany(MCMobType.Creeper, Math.ceil(mobCount / 3),
                MCPlayer.getX(), MCPlayer.getY(), MCPlayer.getZ())
        MCUI.broadcast(`🌙 WAVE ${waveNumber} — ${MCMobs.countAllMobs()} mobs incoming!`)
    }

    /**
     * Run a countdown from N seconds, then run code.
     * @param seconds seconds to count, eg: 3
     * @param handler code to run after countdown
     */
    //% block="countdown $seconds seconds then"
    //% blockId="mccmds_countdown"
    //% seconds.min=1 seconds.max=30
    //% handlerStatement=true
    //% group="Sequences"
    //% weight=98
    export function countdown(seconds: number, handler: () => void): void {
        control.runInParallel(() => {
            for (let i = seconds; i > 0; i--) {
                MCUI.showTitle(`${i}`, i === 1 ? "GO!" : "")
                pause(1000)
            }
            handler()
        })
    }

    /**
     * Build a spawn platform for the player.
     * @param x center x, eg: 0
     * @param y y, eg: 63
     * @param z center z, eg: 0
     */
    //% block="build spawn platform at x $x y $y z $z"
    //% blockId="mccmds_spawn_platform"
    //% group="Sequences"
    //% weight=96
    export function buildSpawnPlatform(x: number, y: number, z: number): void {
        MCBlocks.fillBlocks(MCBlockType.OakPlanks, x - 3, y, z - 3, x + 3, y, z + 3)
        MCBlocks.fillHollow(MCBlockType.OakLog, x - 4, y, z - 4, x + 4, y + 4, z + 4)
        MCPlayer.teleport(x, y + 1, z)
        game.showLongText("🏡 Spawn platform built!", DialogLayout.Top)
    }

    // ════════════════════════════════════════════
    //  GROUP: Debug
    // ════════════════════════════════════════════

    /**
     * Print a debug value to the console/HUD.
     * @param label the label, eg: "pos"
     * @param value the value to display, eg: 0
     */
    //% block="debug $label = $value"
    //% blockId="mccmds_debug_num"
    //% group="Debug"
    //% weight=100
    export function debugNum(label: string, value: number): void {
        game.showLongText(`🐛 ${label} = ${value}`, DialogLayout.Bottom)
        console.log(`[MC Debug] ${label} = ${value}`)
    }

    /**
     * Print a debug string.
     * @param label the label, eg: "state"
     * @param value the string, eg: "running"
     */
    //% block="debug $label = $value"
    //% blockId="mccmds_debug_str"
    //% group="Debug"
    //% weight=98
    export function debugStr(label: string, value: string): void {
        game.showLongText(`🐛 ${label} = ${value}`, DialogLayout.Bottom)
        console.log(`[MC Debug] ${label} = ${value}`)
    }

    /**
     * Log world state to console.
     */
    //% block="log world state"
    //% blockId="mccmds_log_state"
    //% group="Debug"
    //% weight=96
    export function logWorldState(): void {
        console.log(`[MC] Time=${MCWorld.getTime()} Weather=${MCWeather[MCWorld.getWeather()]} Dim=${MCDimension[MCWorld.getDimension()]}`)
        console.log(`[MC] Player: ${MCPlayer.getName()} HP=${MCPlayer.getHealth()} LV=${MCPlayer.getLevel()} Mode=${MCGameMode[MCPlayer.getGameMode()]}`)
        console.log(`[MC] Mobs: ${MCMobs.countAllMobs()} total`)
    }

    /**
     * Assert a condition and show a pass/fail message.
     * @param condition the condition to test
     * @param label the test label, eg: "health > 0"
     */
    //% block="assert $condition label $label"
    //% blockId="mccmds_assert"
    //% group="Debug"
    //% weight=94
    export function assert(condition: boolean, label: string): void {
        if (condition) {
            game.showLongText(`✅ PASS: ${label}`, DialogLayout.Bottom)
        } else {
            game.showLongText(`❌ FAIL: ${label}`, DialogLayout.Bottom)
            console.error(`[MC Assert FAIL] ${label}`)
        }
    }
}
