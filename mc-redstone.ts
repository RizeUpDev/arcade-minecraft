// ============================================================
// mc-redstone.ts  —  🔴 Redstone Drawer
// Power, signals, devices, and logic gates.
// ============================================================

/**
 * 🔴 Redstone
 * Control redstone power, devices, comparators, and logic circuits.
 */
//% color="#C62828"
//% icon="\uf0e7"
//% weight=50
//% blockGap=8
//% groups='["Power & Signals","Devices","Logic Gates","Clocks & Timers","Detection"]'
namespace MCRedstone {

    // ─── Internal redstone map ───────────────────────────────────
    let _powered: { [key: string]: number } = {}   // position → signal 0-15
    let _variables: { [name: string]: number } = {}

    function _key(x: number, y: number, z: number): string { return `${x},${y},${z}` }

    // ════════════════════════════════════════════
    //  GROUP: Power & Signals
    // ════════════════════════════════════════════

    /**
     * Set the redstone power level at a position.
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     * @param level power level 0–15, eg: 15
     */
    //% block="set redstone power at x $x y $y z $z to $level"
    //% blockId="mcredstone_set_power"
    //% level.min=0 level.max=15
    //% group="Power & Signals"
    //% weight=100
    export function setPower(x: number, y: number, z: number, level: number): void {
        _powered[_key(x, y, z)] = Math.clamp(0, 15, level)
        game.showLongText(`⚡ Redstone (${x},${y},${z}) = ${level}`, DialogLayout.Top)
    }

    /**
     * Set power using a preset strength.
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     * @param strength the signal strength preset
     */
    //% block="set $strength signal at x $x y $y z $z"
    //% blockId="mcredstone_set_signal"
    //% group="Power & Signals"
    //% weight=98
    export function setSignal(x: number, y: number, z: number, strength: MCSignalStrength): void {
        setPower(x, y, z, strength as number)
    }

    /**
     * Get the redstone power level at a position.
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     */
    //% block="redstone power at x $x y $y z $z"
    //% blockId="mcredstone_get_power"
    //% group="Power & Signals"
    //% weight=96
    export function getPower(x: number, y: number, z: number): number {
        return _powered[_key(x, y, z)] ?? 0
    }

    /**
     * Returns true if a position is powered.
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     */
    //% block="position x $x y $y z $z is powered"
    //% blockId="mcredstone_is_powered"
    //% group="Power & Signals"
    //% weight=94
    export function isPowered(x: number, y: number, z: number): boolean {
        return (getPower(x, y, z)) > 0
    }

    /**
     * Power an entire line of blocks.
     * @param x1 start x, eg: 0
     * @param y1 start y, eg: 64
     * @param z1 start z, eg: 0
     * @param x2 end x, eg: 10
     * @param y2 end y, eg: 64
     * @param z2 end z, eg: 0
     * @param level power level, eg: 15
     */
    //% block="power line from x $x1 y $y1 z $z1 to x $x2 y $y2 z $z2 level $level"
    //% blockId="mcredstone_power_line"
    //% level.min=0 level.max=15
    //% group="Power & Signals"
    //% weight=92
    export function powerLine(x1: number, y1: number, z1: number,
                               x2: number, y2: number, z2: number, level: number): void {
        const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), Math.abs(z2 - z1))
        for (let i = 0; i <= steps; i++) {
            const t = steps > 0 ? i / steps : 0
            const x = Math.round(x1 + (x2 - x1) * t)
            const y = Math.round(y1 + (y2 - y1) * t)
            const z = Math.round(z1 + (z2 - z1) * t)
            _powered[_key(x, y, z)] = level
        }
        game.showLongText(`⚡ Powered line level ${level}`, DialogLayout.Top)
    }

    /**
     * Cut power from a position.
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     */
    //% block="cut power at x $x y $y z $z"
    //% blockId="mcredstone_cut"
    //% group="Power & Signals"
    //% weight=90
    export function cutPower(x: number, y: number, z: number): void {
        delete _powered[_key(x, y, z)]
    }

    // ════════════════════════════════════════════
    //  GROUP: Devices
    // ════════════════════════════════════════════

    /**
     * Toggle a lever at a position on or off.
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     */
    //% block="toggle lever at x $x y $y z $z"
    //% blockId="mcredstone_toggle_lever"
    //% group="Devices"
    //% weight=100
    export function toggleLever(x: number, y: number, z: number): void {
        const cur = getPower(x, y, z)
        setPower(x, y, z, cur > 0 ? 0 : 15)
    }

    /**
     * Activate a button at a position (brief pulse).
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     */
    //% block="press button at x $x y $y z $z"
    //% blockId="mcredstone_press_button"
    //% group="Devices"
    //% weight=98
    export function pressButton(x: number, y: number, z: number): void {
        setPower(x, y, z, 15)
        control.runInParallel(() => {
            pause(500)
            setPower(x, y, z, 0)
        })
        game.showLongText(`🔘 Button pressed at (${x},${y},${z})`, DialogLayout.Top)
    }

    /**
     * Open or close a door at a position.
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     * @param open true to open the door
     */
    //% block="door at x $x y $y z $z $open"
    //% blockId="mcredstone_door"
    //% open.shadow="toggleOpenClose"
    //% group="Devices"
    //% weight=96
    export function setDoor(x: number, y: number, z: number, open: boolean): void {
        game.showLongText(`🚪 Door at (${x},${y},${z}) ${open ? "opened" : "closed"}`, DialogLayout.Top)
    }

    /**
     * Trigger a TNT block at a position.
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     * @param fuseSeconds fuse duration in seconds, eg: 4
     */
    //% block="ignite TNT at x $x y $y z $z with $fuseSeconds s fuse"
    //% blockId="mcredstone_tnt"
    //% fuseSeconds.min=1 fuseSeconds.max=20
    //% group="Devices"
    //% weight=94
    export function igniteTNT(x: number, y: number, z: number, fuseSeconds: number): void {
        game.showLongText(`💣 TNT fuse lit! (${fuseSeconds}s)`, DialogLayout.Top)
        control.runInParallel(() => {
            pause(fuseSeconds * 1000)
            MCBlocks.explode(x, y, z, 4)
        })
    }

    /**
     * Ring a note block at a position.
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     */
    //% block="ring note block at x $x y $y z $z"
    //% blockId="mcredstone_note_block"
    //% group="Devices"
    //% weight=92
    export function ringNoteBlock(x: number, y: number, z: number): void {
        music.playTone(262, music.beat(BeatFraction.Quarter))
        game.showLongText(`🎵 Note block at (${x},${y},${z})`, DialogLayout.Top)
    }

    // ════════════════════════════════════════════
    //  GROUP: Logic Gates
    // ════════════════════════════════════════════

    /**
     * AND gate: returns true if both inputs are powered.
     * @param ax x of input A, eg: 0
     * @param ay y of input A, eg: 64
     * @param az z of input A, eg: 0
     * @param bx x of input B, eg: 2
     * @param by y of input B, eg: 64
     * @param bz z of input B, eg: 0
     */
    //% block="AND gate: A(x $ax y $ay z $az) AND B(x $bx y $by z $bz)"
    //% blockId="mcredstone_and"
    //% group="Logic Gates"
    //% weight=100
    export function andGate(ax: number, ay: number, az: number,
                             bx: number, by: number, bz: number): boolean {
        return isPowered(ax, ay, az) && isPowered(bx, by, bz)
    }

    /**
     * OR gate: returns true if either input is powered.
     */
    //% block="OR gate: A(x $ax y $ay z $az) OR B(x $bx y $by z $bz)"
    //% blockId="mcredstone_or"
    //% group="Logic Gates"
    //% weight=98
    export function orGate(ax: number, ay: number, az: number,
                            bx: number, by: number, bz: number): boolean {
        return isPowered(ax, ay, az) || isPowered(bx, by, bz)
    }

    /**
     * NOT gate: returns true if input is NOT powered.
     */
    //% block="NOT gate: NOT(x $x y $y z $z)"
    //% blockId="mcredstone_not"
    //% group="Logic Gates"
    //% weight=96
    export function notGate(x: number, y: number, z: number): boolean {
        return !isPowered(x, y, z)
    }

    /**
     * XOR gate: returns true if exactly one input is powered.
     */
    //% block="XOR gate: A(x $ax y $ay z $az) XOR B(x $bx y $by z $bz)"
    //% blockId="mcredstone_xor"
    //% group="Logic Gates"
    //% weight=94
    export function xorGate(ax: number, ay: number, az: number,
                             bx: number, by: number, bz: number): boolean {
        return isPowered(ax, ay, az) !== isPowered(bx, by, bz)
    }

    // ════════════════════════════════════════════
    //  GROUP: Clocks & Timers
    // ════════════════════════════════════════════

    /**
     * Create a redstone clock that pulses a position every N milliseconds.
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     * @param intervalMs interval in ms, eg: 1000
     */
    //% block="start redstone clock at x $x y $y z $z every $intervalMs ms"
    //% blockId="mcredstone_clock"
    //% intervalMs.min=100 intervalMs.max=60000
    //% group="Clocks & Timers"
    //% weight=100
    export function startClock(x: number, y: number, z: number, intervalMs: number): void {
        control.runInParallel(() => {
            let on = false
            while (true) {
                on = !on
                setPower(x, y, z, on ? 15 : 0)
                pause(intervalMs)
            }
        })
        game.showLongText(`⏱ Redstone clock started (${intervalMs}ms)`, DialogLayout.Top)
    }

    /**
     * Set a redstone variable (named signal).
     * @param name variable name, eg: "door_open"
     * @param value value 0–15, eg: 15
     */
    //% block="set redstone variable $name to $value"
    //% blockId="mcredstone_set_var"
    //% value.min=0 value.max=15
    //% group="Clocks & Timers"
    //% weight=98
    export function setVariable(name: string, value: number): void {
        _variables[name] = Math.clamp(0, 15, value)
    }

    /**
     * Get a redstone variable value.
     * @param name variable name, eg: "door_open"
     */
    //% block="redstone variable $name"
    //% blockId="mcredstone_get_var"
    //% group="Clocks & Timers"
    //% weight=96
    export function getVariable(name: string): number {
        return _variables[name] ?? 0
    }

    // ════════════════════════════════════════════
    //  GROUP: Detection
    // ════════════════════════════════════════════

    /**
     * Returns true if the signal at a position meets a minimum level.
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     * @param minLevel minimum signal, eg: 8
     */
    //% block="signal at x $x y $y z $z ≥ $minLevel"
    //% blockId="mcredstone_signal_gte"
    //% minLevel.min=0 minLevel.max=15
    //% group="Detection"
    //% weight=100
    export function signalAtLeast(x: number, y: number, z: number, minLevel: number): boolean {
        return getPower(x, y, z) >= minLevel
    }

    /**
     * Count powered blocks in a region.
     * @param x1 start x, eg: 0
     * @param y1 start y, eg: 60
     * @param z1 start z, eg: 0
     * @param x2 end x, eg: 10
     * @param y2 end y, eg: 70
     * @param z2 end z, eg: 10
     */
    //% block="count powered blocks from x $x1 y $y1 z $z1 to x $x2 y $y2 z $z2"
    //% blockId="mcredstone_count_powered"
    //% group="Detection"
    //% weight=98
    export function countPowered(x1: number, y1: number, z1: number,
                                  x2: number, y2: number, z2: number): number {
        let count = 0
        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
            for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
                for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++)
                    if (isPowered(x, y, z)) count++
        return count
    }
}
