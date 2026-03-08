// ============================================================
// mc-events.ts  —  📡 Events Drawer
// React to block, player, mob, and world events.
// ============================================================

/**
 * 📡 Events
 * Register handlers for block, player, mob, time, and world events.
 */
//% color="#00897B"
//% icon="\uf0e7"
//% weight=30
//% blockGap=8
//% groups='["Block Events","Player Events","Mob Events","World Events","Custom Events"]'
namespace MCEvents {

    // ─── Handler registry ────────────────────────────────────────
    type BlockHandler  = (x: number, y: number, z: number, block: MCBlockType) => void
    type PlayerHandler = () => void
    type MobHandler    = (mobId: number, mobType: MCMobType) => void
    type WorldHandler  = () => void

    let _onBlockPlaced:  BlockHandler[] = []
    let _onBlockBroken:  BlockHandler[] = []
    let _onBlockDetected: { block: MCBlockType, handler: BlockHandler }[] = []

    let _onPlayerDied:   PlayerHandler[] = []
    let _onPlayerSpawned:PlayerHandler[] = []
    let _onPlayerHurt:   PlayerHandler[] = []
    let _onPlayerJumped: PlayerHandler[] = []
    let _onInventoryChanged: PlayerHandler[] = []

    let _onMobSpawned:   MobHandler[] = []
    let _onMobKilled:    MobHandler[] = []
    let _onMobTamed:     MobHandler[] = []

    let _onDaytime:      WorldHandler[] = []
    let _onNighttime:    WorldHandler[] = []
    let _onWeatherChange:WorldHandler[] = []
    let _onGameStart:    WorldHandler[] = []

    let _customEvents:   { [name: string]: (() => void)[] } = {}

    // ════════════════════════════════════════════
    //  GROUP: Block Events
    // ════════════════════════════════════════════

    /**
     * Run code when any block is placed.
     * @param handler code to run
     */
    //% block="on block placed"
    //% blockId="mcevents_on_block_placed"
    //% group="Block Events"
    //% weight=100
    //% draggableParameters="reporter"
    export function onBlockPlaced(handler: BlockHandler): void {
        _onBlockPlaced.push(handler)
    }

    /**
     * Run code when any block is broken.
     * @param handler code to run
     */
    //% block="on block broken"
    //% blockId="mcevents_on_block_broken"
    //% group="Block Events"
    //% weight=98
    //% draggableParameters="reporter"
    export function onBlockBroken(handler: BlockHandler): void {
        _onBlockBroken.push(handler)
    }

    /**
     * Run code when a specific block type is placed.
     * @param block the block to watch for
     * @param handler code to run
     */
    //% block="on $block placed"
    //% blockId="mcevents_on_specific_block_placed"
    //% group="Block Events"
    //% weight=96
    //% draggableParameters="reporter"
    export function onSpecificBlockPlaced(block: MCBlockType, handler: BlockHandler): void {
        _onBlockPlaced.push((x, y, z, b) => { if (b === block) handler(x, y, z, b) })
    }

    /**
     * Run code when a specific block type is broken.
     * @param block the block to watch for
     * @param handler code to run
     */
    //% block="on $block broken"
    //% blockId="mcevents_on_specific_block_broken"
    //% group="Block Events"
    //% weight=94
    //% draggableParameters="reporter"
    export function onSpecificBlockBroken(block: MCBlockType, handler: BlockHandler): void {
        _onBlockBroken.push((x, y, z, b) => { if (b === block) handler(x, y, z, b) })
    }

    /**
     * Run code when a block type is detected at a position.
     * @param block the block to detect
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     * @param handler code to run
     */
    //% block="on $block detected at x $x y $y z $z"
    //% blockId="mcevents_on_block_detected"
    //% group="Block Events"
    //% weight=92
    export function onBlockDetected(block: MCBlockType, x: number, y: number, z: number, handler: () => void): void {
        control.runInParallel(() => {
            while (true) {
                if (MCBlocks.blockIs(block, x, y, z)) handler()
                pause(500)
            }
        })
    }

    /**
     * Run code when TNT explodes at a position.
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     * @param handler code to run
     */
    //% block="on explosion near x $x y $y z $z"
    //% blockId="mcevents_on_explosion"
    //% group="Block Events"
    //% weight=90
    export function onExplosionNear(x: number, y: number, z: number, handler: () => void): void {
        // Watches for air where TNT was
        control.runInParallel(() => {
            while (true) {
                if (MCBlocks.isAir(x, y, z)) { handler(); break }
                pause(200)
            }
        })
    }

    // ════════════════════════════════════════════
    //  GROUP: Player Events
    // ════════════════════════════════════════════

    /**
     * Run code when the player dies.
     * @param handler code to run
     */
    //% block="on player died"
    //% blockId="mcevents_on_player_died"
    //% group="Player Events"
    //% weight=100
    export function onPlayerDied(handler: PlayerHandler): void {
        _onPlayerDied.push(handler)
    }

    /**
     * Run code when the player spawns (or respawns).
     * @param handler code to run
     */
    //% block="on player spawned"
    //% blockId="mcevents_on_player_spawned"
    //% group="Player Events"
    //% weight=98
    export function onPlayerSpawned(handler: PlayerHandler): void {
        _onPlayerSpawned.push(handler)
        // Auto-fire on startup
        control.runInParallel(() => {
            pause(100)
            _onPlayerSpawned.forEach(h => h())
        })
    }

    /**
     * Run code when the player takes damage.
     * @param handler code to run
     */
    //% block="on player hurt"
    //% blockId="mcevents_on_player_hurt"
    //% group="Player Events"
    //% weight=96
    export function onPlayerHurt(handler: PlayerHandler): void {
        _onPlayerHurt.push(handler)
    }

    /**
     * Run code when the player reaches a level.
     * @param level the level to watch for, eg: 10
     * @param handler code to run
     */
    //% block="on player reaches level $level"
    //% blockId="mcevents_on_level_up"
    //% level.min=1 level.max=100
    //% group="Player Events"
    //% weight=94
    export function onPlayerReachesLevel(level: number, handler: () => void): void {
        control.runInParallel(() => {
            while (MCPlayer.getLevel() < level) pause(500)
            handler()
        })
    }

    /**
     * Run code when the player's health drops below a threshold.
     * @param threshold health threshold, eg: 5
     * @param handler code to run
     */
    //% block="on player health below $threshold"
    //% blockId="mcevents_on_low_health"
    //% threshold.min=1 threshold.max=20
    //% group="Player Events"
    //% weight=92
    export function onPlayerHealthBelow(threshold: number, handler: () => void): void {
        control.runInParallel(() => {
            let triggered = false
            while (true) {
                if (!triggered && MCPlayer.getHealth() < threshold) {
                    triggered = true
                    handler()
                } else if (MCPlayer.getHealth() >= threshold) {
                    triggered = false
                }
                pause(200)
            }
        })
    }

    /**
     * Run code when the player picks up an item.
     * @param item the item to watch for
     * @param handler code to run
     */
    //% block="on player picks up $item"
    //% blockId="mcevents_on_pickup"
    //% group="Player Events"
    //% weight=90
    export function onPlayerPickup(item: MCItemType, handler: () => void): void {
        control.runInParallel(() => {
            while (true) {
                if (MCPlayer.hasItem(item)) { handler(); break }
                pause(300)
            }
        })
    }

    /**
     * Run code when the player enters a gamemode.
     * @param mode the gamemode to watch for
     * @param handler code to run
     */
    //% block="on player enters $mode"
    //% blockId="mcevents_on_gamemode"
    //% group="Player Events"
    //% weight=88
    export function onPlayerEntersGamemode(mode: MCGameMode, handler: () => void): void {
        control.runInParallel(() => {
            while (true) {
                if (MCPlayer.getGameMode() === mode) { handler(); break }
                pause(300)
            }
        })
    }

    // ════════════════════════════════════════════
    //  GROUP: Mob Events
    // ════════════════════════════════════════════

    /**
     * Run code when any mob spawns.
     * @param handler code to run with mob id and type
     */
    //% block="on mob spawned"
    //% blockId="mcevents_on_mob_spawned"
    //% group="Mob Events"
    //% weight=100
    //% draggableParameters="reporter"
    export function onMobSpawned(handler: MobHandler): void {
        _onMobSpawned.push(handler)
    }

    /**
     * Run code when any mob is killed.
     * @param handler code to run with mob id and type
     */
    //% block="on mob killed"
    //% blockId="mcevents_on_mob_killed"
    //% group="Mob Events"
    //% weight=98
    //% draggableParameters="reporter"
    export function onMobKilled(handler: MobHandler): void {
        _onMobKilled.push(handler)
    }

    /**
     * Run code when a specific mob type is killed.
     * @param mob the mob type to watch for
     * @param handler code to run
     */
    //% block="on $mob killed"
    //% blockId="mcevents_on_specific_mob_killed"
    //% group="Mob Events"
    //% weight=96
    export function onSpecificMobKilled(mob: MCMobType, handler: () => void): void {
        _onMobKilled.push((id, type) => { if (type === mob) handler() })
    }

    /**
     * Run code when a mob count of a type reaches zero.
     * @param mob the mob type
     * @param handler code to run
     */
    //% block="on all $mob eliminated"
    //% blockId="mcevents_on_all_eliminated"
    //% group="Mob Events"
    //% weight=94
    export function onAllEliminated(mob: MCMobType, handler: () => void): void {
        control.runInParallel(() => {
            while (MCMobs.countMobs(mob) > 0) pause(500)
            handler()
        })
    }

    /**
     * Run code when a mob is tamed.
     * @param handler code to run
     */
    //% block="on mob tamed"
    //% blockId="mcevents_on_mob_tamed"
    //% group="Mob Events"
    //% weight=92
    //% draggableParameters="reporter"
    export function onMobTamed(handler: MobHandler): void {
        _onMobTamed.push(handler)
    }

    // ════════════════════════════════════════════
    //  GROUP: World Events
    // ════════════════════════════════════════════

    /**
     * Run code when it becomes daytime.
     * @param handler code to run
     */
    //% block="on daytime"
    //% blockId="mcevents_on_daytime"
    //% group="World Events"
    //% weight=100
    export function onDaytime(handler: WorldHandler): void {
        _onDaytime.push(handler)
        control.runInParallel(() => {
            let wasDaytime = MCWorld.isDaytime()
            while (true) {
                const now = MCWorld.isDaytime()
                if (!wasDaytime && now) _onDaytime.forEach(h => h())
                wasDaytime = now
                pause(1000)
            }
        })
    }

    /**
     * Run code when it becomes nighttime.
     * @param handler code to run
     */
    //% block="on nighttime"
    //% blockId="mcevents_on_nighttime"
    //% group="World Events"
    //% weight=98
    export function onNighttime(handler: WorldHandler): void {
        _onNighttime.push(handler)
        control.runInParallel(() => {
            let wasNight = MCWorld.isNighttime()
            while (true) {
                const now = MCWorld.isNighttime()
                if (!wasNight && now) _onNighttime.forEach(h => h())
                wasNight = now
                pause(1000)
            }
        })
    }

    /**
     * Run code when the weather changes.
     * @param handler code to run
     */
    //% block="on weather change"
    //% blockId="mcevents_on_weather"
    //% group="World Events"
    //% weight=96
    export function onWeatherChange(handler: WorldHandler): void {
        _onWeatherChange.push(handler)
        control.runInParallel(() => {
            let lastWeather = MCWorld.getWeather()
            while (true) {
                const now = MCWorld.getWeather()
                if (now !== lastWeather) _onWeatherChange.forEach(h => h())
                lastWeather = now
                pause(1000)
            }
        })
    }

    /**
     * Run code when the game starts.
     * @param handler code to run
     */
    //% block="on game start"
    //% blockId="mcevents_on_game_start"
    //% group="World Events"
    //% weight=94
    export function onGameStart(handler: WorldHandler): void {
        _onGameStart.push(handler)
        control.runInParallel(() => {
            pause(0)
            _onGameStart.forEach(h => h())
        })
    }

    /**
     * Run code after a delay (ms) from game start.
     * @param delayMs delay in ms, eg: 5000
     * @param handler code to run
     */
    //% block="run after $delayMs ms"
    //% blockId="mcevents_run_after"
    //% delayMs.min=100 delayMs.max=300000
    //% group="World Events"
    //% weight=92
    export function runAfter(delayMs: number, handler: () => void): void {
        control.runInParallel(() => {
            pause(delayMs)
            handler()
        })
    }

    /**
     * Run code every N milliseconds.
     * @param intervalMs interval, eg: 1000
     * @param handler code to run
     */
    //% block="run every $intervalMs ms"
    //% blockId="mcevents_run_every"
    //% intervalMs.min=100 intervalMs.max=60000
    //% group="World Events"
    //% weight=90
    export function runEvery(intervalMs: number, handler: () => void): void {
        control.runInParallel(() => {
            while (true) {
                handler()
                pause(intervalMs)
            }
        })
    }

    // ════════════════════════════════════════════
    //  GROUP: Custom Events
    // ════════════════════════════════════════════

    /**
     * Register a handler for a named custom event.
     * @param eventName the event name, eg: "my_event"
     * @param handler code to run
     */
    //% block="on custom event $eventName"
    //% blockId="mcevents_on_custom"
    //% group="Custom Events"
    //% weight=100
    export function onCustomEvent(eventName: string, handler: () => void): void {
        if (!_customEvents[eventName]) _customEvents[eventName] = []
        _customEvents[eventName].push(handler)
    }

    /**
     * Fire a named custom event.
     * @param eventName the event to fire, eg: "my_event"
     */
    //% block="fire event $eventName"
    //% blockId="mcevents_fire"
    //% group="Custom Events"
    //% weight=98
    export function fireEvent(eventName: string): void {
        const handlers = _customEvents[eventName]
        if (handlers) handlers.forEach(h => h())
    }

    /**
     * Check if a custom event has any listeners.
     * @param eventName the event name, eg: "my_event"
     */
    //% block="event $eventName has listeners"
    //% blockId="mcevents_has_listeners"
    //% group="Custom Events"
    //% weight=96
    export function hasListeners(eventName: string): boolean {
        return !!_customEvents[eventName] && _customEvents[eventName].length > 0
    }

    // ─── Internal fire helpers used by other namespaces ──────────
    export function _fireBlockPlaced(x: number, y: number, z: number, b: MCBlockType): void {
        _onBlockPlaced.forEach(h => h(x, y, z, b))
    }
    export function _fireBlockBroken(x: number, y: number, z: number, b: MCBlockType): void {
        _onBlockBroken.forEach(h => h(x, y, z, b))
    }
    export function _fireMobSpawned(id: number, type: MCMobType): void {
        _onMobSpawned.forEach(h => h(id, type))
    }
    export function _fireMobKilled(id: number, type: MCMobType): void {
        _onMobKilled.forEach(h => h(id, type))
    }
    export function _firePlayerDied(): void {
        _onPlayerDied.forEach(h => h())
    }
}
