// ============================================================
// mc-blocks.ts  —  🧱 Blocks Drawer
// Place, break, fill, detect, and query blocks in the world.
// ============================================================

/**
 * 🧱 Blocks
 * Place, break, fill, copy, and inspect blocks in the world.
 */
//% color="#795548"
//% icon="\uf1b2"
//% weight=90
//% blockGap=8
//% groups='["Place & Break","Fill & Copy","Detection","Block Info","Block Effects"]'
namespace MCBlocks {

    // ─── Internal world grid (simulated 16×16×16 chunks) ─────────
    const WORLD_SIZE = 64
    const GRID_Y = 16
    let _world: { [key: string]: MCBlockType } = {}

    function _key(x: number, y: number, z: number): string {
        return `${x},${y},${z}`
    }

    function _notify(msg: string): void {
        game.showLongText(msg, DialogLayout.Bottom)
    }

    // ════════════════════════════════════════════
    //  GROUP: Place & Break
    // ════════════════════════════════════════════

    /**
     * Place a block at a position.
     * @param block the block type to place
     * @param x x coordinate, eg: 0
     * @param y y coordinate, eg: 64
     * @param z z coordinate, eg: 0
     */
    //% block="place $block at x $x y $y z $z"
    //% blockId="mcblocks_place"
    //% group="Place & Break"
    //% weight=100
    export function placeBlock(block: MCBlockType, x: number, y: number, z: number): void {
        _world[_key(x, y, z)] = block
        _notify(`🧱 Placed ${MCBlockType[block]} at (${x},${y},${z})`)
    }

    /**
     * Break (remove) the block at a position.
     * @param x x coordinate, eg: 0
     * @param y y coordinate, eg: 64
     * @param z z coordinate, eg: 0
     */
    //% block="break block at x $x y $y z $z"
    //% blockId="mcblocks_break"
    //% group="Place & Break"
    //% weight=98
    export function breakBlock(x: number, y: number, z: number): void {
        delete _world[_key(x, y, z)]
        _notify(`⛏ Broke block at (${x},${y},${z})`)
    }

    /**
     * Set a block using a position value.
     * @param block the block to place
     * @param pos the position
     */
    //% block="place $block at $pos"
    //% blockId="mcblocks_place_pos"
    //% group="Place & Break"
    //% weight=96
    export function placeBlockAt(block: MCBlockType, pos: MCPosition): void {
        placeBlock(block, pos.x, pos.y, pos.z)
    }

    /**
     * Break the block at a position value.
     * @param pos the position
     */
    //% block="break block at $pos"
    //% blockId="mcblocks_break_pos"
    //% group="Place & Break"
    //% weight=94
    export function breakBlockAt(pos: MCPosition): void {
        breakBlock(pos.x, pos.y, pos.z)
    }

    /**
     * Place a block in a direction relative to a position.
     * @param block the block type
     * @param pos origin position
     * @param dir the direction
     */
    //% block="place $block $dir of $pos"
    //% blockId="mcblocks_place_direction"
    //% group="Place & Break"
    //% weight=92
    export function placeBlockInDirection(block: MCBlockType, pos: MCPosition, dir: MCDirection): void {
        const offsets: { [k: number]: MCPosition } = {
            [MCDirection.North]: new MCPosition(0, 0, -1),
            [MCDirection.South]: new MCPosition(0, 0, 1),
            [MCDirection.East]:  new MCPosition(1, 0, 0),
            [MCDirection.West]:  new MCPosition(-1, 0, 0),
            [MCDirection.Up]:    new MCPosition(0, 1, 0),
            [MCDirection.Down]:  new MCPosition(0, -1, 0),
        }
        const off = offsets[dir]
        placeBlock(block, pos.x + off.x, pos.y + off.y, pos.z + off.z)
    }

    /**
     * Replace one block type with another in a region.
     * @param from block type to replace
     * @param to block type to place
     * @param x1 start x, eg: 0
     * @param y1 start y, eg: 60
     * @param z1 start z, eg: 0
     * @param x2 end x, eg: 10
     * @param y2 end y, eg: 70
     * @param z2 end z, eg: 10
     */
    //% block="replace $from with $to from x $x1 y $y1 z $z1 to x $x2 y $y2 z $z2"
    //% blockId="mcblocks_replace"
    //% group="Place & Break"
    //% weight=88
    export function replaceBlocks(from: MCBlockType, to: MCBlockType,
        x1: number, y1: number, z1: number,
        x2: number, y2: number, z2: number): void {
        let count = 0
        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
            for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
                for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) {
                    const k = _key(x, y, z)
                    if (_world[k] === from) {
                        _world[k] = to
                        count++
                    }
                }
            }
        }
        _notify(`🔄 Replaced ${count} blocks`)
    }

    // ════════════════════════════════════════════
    //  GROUP: Fill & Copy
    // ════════════════════════════════════════════

    /**
     * Fill a region with a block type.
     * @param block the block to fill with
     * @param x1 start x, eg: 0
     * @param y1 start y, eg: 60
     * @param z1 start z, eg: 0
     * @param x2 end x, eg: 5
     * @param y2 end y, eg: 65
     * @param z2 end z, eg: 5
     */
    //% block="fill $block from x $x1 y $y1 z $z1 to x $x2 y $y2 z $z2"
    //% blockId="mcblocks_fill"
    //% group="Fill & Copy"
    //% weight=100
    export function fillBlocks(block: MCBlockType,
        x1: number, y1: number, z1: number,
        x2: number, y2: number, z2: number): void {
        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
            for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
                for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) {
                    _world[_key(x, y, z)] = block
                }
            }
        }
        _notify(`📦 Filled region with ${MCBlockType[block]}`)
    }

    /**
     * Fill a hollow box (only walls, floor, ceiling) with a block.
     * @param block the block to use
     * @param x1 start x, eg: 0
     * @param y1 start y, eg: 60
     * @param z1 start z, eg: 0
     * @param x2 end x, eg: 10
     * @param y2 end y, eg: 70
     * @param z2 end z, eg: 10
     */
    //% block="fill hollow box of $block from x $x1 y $y1 z $z1 to x $x2 y $y2 z $z2"
    //% blockId="mcblocks_fill_hollow"
    //% group="Fill & Copy"
    //% weight=98
    export function fillHollow(block: MCBlockType,
        x1: number, y1: number, z1: number,
        x2: number, y2: number, z2: number): void {
        const minX = Math.min(x1, x2), maxX = Math.max(x1, x2)
        const minY = Math.min(y1, y2), maxY = Math.max(y1, y2)
        const minZ = Math.min(z1, z2), maxZ = Math.max(z1, z2)
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                for (let z = minZ; z <= maxZ; z++) {
                    if (x === minX || x === maxX ||
                        y === minY || y === maxY ||
                        z === minZ || z === maxZ) {
                        _world[_key(x, y, z)] = block
                    }
                }
            }
        }
        _notify(`🏠 Built hollow box`)
    }

    /**
     * Clone (copy) a region to a new location.
     * @param srcX1 source start x, eg: 0
     * @param srcY1 source start y, eg: 60
     * @param srcZ1 source start z, eg: 0
     * @param srcX2 source end x, eg: 5
     * @param srcY2 source end y, eg: 65
     * @param srcZ2 source end z, eg: 5
     * @param dstX destination x, eg: 20
     * @param dstY destination y, eg: 60
     * @param dstZ destination z, eg: 0
     */
    //% block="clone region from x $srcX1 y $srcY1 z $srcZ1 to x $srcX2 y $srcY2 z $srcZ2 → x $dstX y $dstY z $dstZ"
    //% blockId="mcblocks_clone"
    //% group="Fill & Copy"
    //% weight=96
    export function cloneRegion(
        srcX1: number, srcY1: number, srcZ1: number,
        srcX2: number, srcY2: number, srcZ2: number,
        dstX: number, dstY: number, dstZ: number): void {
        const offX = dstX - srcX1
        const offY = dstY - srcY1
        const offZ = dstZ - srcZ1
        for (let x = Math.min(srcX1, srcX2); x <= Math.max(srcX1, srcX2); x++) {
            for (let y = Math.min(srcY1, srcY2); y <= Math.max(srcY1, srcY2); y++) {
                for (let z = Math.min(srcZ1, srcZ2); z <= Math.max(srcZ1, srcZ2); z++) {
                    const src = _world[_key(x, y, z)]
                    if (src !== undefined) {
                        _world[_key(x + offX, y + offY, z + offZ)] = src
                    }
                }
            }
        }
        _notify(`📋 Region cloned`)
    }

    /**
     * Build a sphere of blocks at a center point.
     * @param block the block type
     * @param cx center x, eg: 0
     * @param cy center y, eg: 64
     * @param cz center z, eg: 0
     * @param radius radius, eg: 5
     */
    //% block="build $block sphere at x $cx y $cy z $cz radius $radius"
    //% blockId="mcblocks_sphere"
    //% radius.min=1 radius.max=20
    //% group="Fill & Copy"
    //% weight=94
    export function buildSphere(block: MCBlockType, cx: number, cy: number, cz: number, radius: number): void {
        const r2 = radius * radius
        for (let x = -radius; x <= radius; x++) {
            for (let y = -radius; y <= radius; y++) {
                for (let z = -radius; z <= radius; z++) {
                    if (x * x + y * y + z * z <= r2) {
                        _world[_key(cx + x, cy + y, cz + z)] = block
                    }
                }
            }
        }
        _notify(`⭕ Built sphere of ${MCBlockType[block]} r=${radius}`)
    }

    // ════════════════════════════════════════════
    //  GROUP: Detection
    // ════════════════════════════════════════════

    /**
     * Get the block type at a position.
     * @param x x coordinate, eg: 0
     * @param y y coordinate, eg: 64
     * @param z z coordinate, eg: 0
     */
    //% block="block at x $x y $y z $z"
    //% blockId="mcblocks_get"
    //% group="Detection"
    //% weight=100
    export function getBlock(x: number, y: number, z: number): MCBlockType {
        return _world[_key(x, y, z)] ?? MCBlockType.Air
    }

    /**
     * Check if a block at a position matches a type.
     * @param block the block type to check
     * @param x x coordinate, eg: 0
     * @param y y coordinate, eg: 64
     * @param z z coordinate, eg: 0
     */
    //% block="block at x $x y $y z $z is $block"
    //% blockId="mcblocks_is"
    //% group="Detection"
    //% weight=98
    export function blockIs(block: MCBlockType, x: number, y: number, z: number): boolean {
        return getBlock(x, y, z) === block
    }

    /**
     * Check if a position is air (empty).
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     */
    //% block="position x $x y $y z $z is air"
    //% blockId="mcblocks_is_air"
    //% group="Detection"
    //% weight=96
    export function isAir(x: number, y: number, z: number): boolean {
        return getBlock(x, y, z) === MCBlockType.Air
    }

    /**
     * Check if a block is solid (not air/water/lava).
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     */
    //% block="block at x $x y $y z $z is solid"
    //% blockId="mcblocks_is_solid"
    //% group="Detection"
    //% weight=94
    export function isSolid(x: number, y: number, z: number): boolean {
        const b = getBlock(x, y, z)
        return b !== MCBlockType.Air && b !== MCBlockType.Water && b !== MCBlockType.Lava
    }

    /**
     * Count blocks of a type in a region.
     * @param block the block type to count
     * @param x1 start x, eg: 0
     * @param y1 start y, eg: 60
     * @param z1 start z, eg: 0
     * @param x2 end x, eg: 10
     * @param y2 end y, eg: 70
     * @param z2 end z, eg: 10
     */
    //% block="count $block from x $x1 y $y1 z $z1 to x $x2 y $y2 z $z2"
    //% blockId="mcblocks_count"
    //% group="Detection"
    //% weight=92
    export function countBlocks(block: MCBlockType,
        x1: number, y1: number, z1: number,
        x2: number, y2: number, z2: number): number {
        let count = 0
        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
            for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
                for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) {
                    if (getBlock(x, y, z) === block) count++
                }
            }
        }
        return count
    }

    // ════════════════════════════════════════════
    //  GROUP: Block Info
    // ════════════════════════════════════════════

    /**
     * Get the name of a block type as a string.
     * @param block the block type
     */
    //% block="name of $block"
    //% blockId="mcblocks_name"
    //% group="Block Info"
    //% weight=100
    export function blockName(block: MCBlockType): string {
        return MCBlockType[block]
    }

    /**
     * Returns true if a block type is flammable.
     * @param block the block to check
     */
    //% block="$block is flammable"
    //% blockId="mcblocks_is_flammable"
    //% group="Block Info"
    //% weight=98
    export function isFlammable(block: MCBlockType): boolean {
        return [MCBlockType.OakPlanks, MCBlockType.OakLog, MCBlockType.OakLeaves,
                MCBlockType.Bookshelf, MCBlockType.HayBale, MCBlockType.WoolWhite].indexOf(block) >= 0
    }

    /**
     * Returns true if a block type emits light.
     * @param block the block to check
     */
    //% block="$block emits light"
    //% blockId="mcblocks_emits_light"
    //% group="Block Info"
    //% weight=96
    export function emitsLight(block: MCBlockType): boolean {
        return [MCBlockType.Glowstone, MCBlockType.Torch, MCBlockType.Lava,
                MCBlockType.JackOLantern, MCBlockType.Beacon].indexOf(block) >= 0
    }

    /**
     * Returns the hardness score of a block (1-10).
     * @param block the block to check
     */
    //% block="hardness of $block"
    //% blockId="mcblocks_hardness"
    //% group="Block Info"
    //% weight=94
    export function blockHardness(block: MCBlockType): number {
        if (block === MCBlockType.Bedrock) return 10
        if (block === MCBlockType.Obsidian) return 9
        if (block === MCBlockType.DiamondOre || block === MCBlockType.DiamondBlock) return 7
        if (block === MCBlockType.Stone || block === MCBlockType.Cobblestone) return 4
        if (block === MCBlockType.Dirt || block === MCBlockType.Sand) return 1
        return 2
    }

    // ════════════════════════════════════════════
    //  GROUP: Block Effects
    // ════════════════════════════════════════════

    /**
     * Ignite (set on fire) a block at a position.
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     */
    //% block="ignite block at x $x y $y z $z"
    //% blockId="mcblocks_ignite"
    //% group="Block Effects"
    //% weight=100
    export function igniteBlock(x: number, y: number, z: number): void {
        _notify(`🔥 Block at (${x},${y},${z}) ignited!`)
    }

    /**
     * Explode a block at a position with a blast radius.
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     * @param radius blast radius, eg: 4
     */
    //% block="explode at x $x y $y z $z radius $radius"
    //% blockId="mcblocks_explode"
    //% radius.min=1 radius.max=10
    //% group="Block Effects"
    //% weight=98
    export function explode(x: number, y: number, z: number, radius: number): void {
        const r2 = radius * radius
        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dz = -radius; dz <= radius; dz++) {
                    if (dx * dx + dy * dy + dz * dz <= r2) {
                        delete _world[_key(x + dx, y + dy, z + dz)]
                    }
                }
            }
        }
        _notify(`💥 Explosion at (${x},${y},${z}) r=${radius}!`)
    }

    /**
     * Flood fill an area with liquid (water or lava).
     * @param liquid the liquid block type
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     */
    //% block="flood $liquid at x $x y $y z $z"
    //% blockId="mcblocks_flood"
    //% group="Block Effects"
    //% weight=96
    export function flood(liquid: MCBlockType, x: number, y: number, z: number): void {
        _world[_key(x, y, z)] = liquid
        _notify(`💧 Flooded (${x},${y},${z}) with ${MCBlockType[liquid]}`)
    }
}
