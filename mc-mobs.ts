// ============================================================
// mc-mobs.ts  —  🐉 Mobs Drawer
// Spawn, control, and interact with mobs and entities.
// ============================================================

/**
 * 🐉 Mobs
 * Spawn, remove, command, and interact with mobs and entities.
 */
//% color="#F44336"
//% icon="\uf6d1"
//% weight=70
//% blockGap=8
//% groups='["Spawning","Commands & Behavior","Health & Damage","Taming & Breeding","Detection"]'
namespace MCMobs {

    // ─── Internal mob list ───────────────────────────────────────
    interface Mob {
        id: number
        type: MCMobType
        pos: MCPosition
        health: number
        maxHealth: number
        name: string
        behavior: MCMobBehavior
        tamed: boolean
        owner: string
    }

    let _mobs: Mob[] = []
    let _nextId: number = 1

    function _maxHealthFor(type: MCMobType): number {
        switch (type) {
            case MCMobType.EnderDragon: return 200
            case MCMobType.Wither: return 150
            case MCMobType.IronGolem: return 100
            case MCMobType.Creeper: return 20
            case MCMobType.Zombie: return 20
            case MCMobType.Skeleton: return 20
            case MCMobType.Cow: return 10
            case MCMobType.Pig: return 10
            case MCMobType.Chicken: return 4
            default: return 20
        }
    }

    // ════════════════════════════════════════════
    //  GROUP: Spawning
    // ════════════════════════════════════════════

    /**
     * Spawn a mob at a position.
     * @param mob the mob type
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     */
    //% block="spawn $mob at x $x y $y z $z"
    //% blockId="mcmobs_spawn"
    //% group="Spawning"
    //% weight=100
    export function spawn(mob: MCMobType, x: number, y: number, z: number): number {
        const maxHP = _maxHealthFor(mob)
        const id = _nextId++
        _mobs.push({
            id,
            type: mob,
            pos: new MCPosition(x, y, z),
            health: maxHP,
            maxHealth: maxHP,
            name: MCMobType[mob],
            behavior: MCMobType[mob].toLowerCase().includes("zombie") ||
                      MCMobType[mob].toLowerCase().includes("skeleton") ||
                      MCMobType[mob].toLowerCase().includes("creeper") ?
                MCMobBehavior.AttackPlayer : MCMobBehavior.Wander,
            tamed: false,
            owner: ""
        })
        game.showLongText(`👾 Spawned ${MCMobType[mob]} at (${x},${y},${z})`, DialogLayout.Top)
        return id
    }

    /**
     * Spawn a mob at a position value.
     * @param mob the mob type
     * @param pos the position
     */
    //% block="spawn $mob at $pos"
    //% blockId="mcmobs_spawn_pos"
    //% group="Spawning"
    //% weight=98
    export function spawnAt(mob: MCMobType, pos: MCPosition): number {
        return spawn(mob, pos.x, pos.y, pos.z)
    }

    /**
     * Spawn multiple mobs at a position.
     * @param mob the mob type
     * @param count how many to spawn, eg: 5
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     */
    //% block="spawn $count $mob near x $x y $y z $z"
    //% blockId="mcmobs_spawn_many"
    //% count.min=1 count.max=20
    //% group="Spawning"
    //% weight=96
    export function spawnMany(mob: MCMobType, count: number, x: number, y: number, z: number): void {
        for (let i = 0; i < count; i++) {
            const ox = x + Math.randomRange(-5, 5)
            const oz = z + Math.randomRange(-5, 5)
            spawn(mob, ox, y, oz)
        }
    }

    /**
     * Remove all mobs of a type.
     * @param mob the mob type to remove
     */
    //% block="remove all $mob"
    //% blockId="mcmobs_remove_type"
    //% group="Spawning"
    //% weight=94
    export function removeAllOfType(mob: MCMobType): void {
        const before = _mobs.length
        _mobs = _mobs.filter(m => m.type !== mob)
        game.showLongText(`🗑 Removed ${before - _mobs.length} ${MCMobType[mob]}(s)`, DialogLayout.Top)
    }

    /**
     * Remove the mob with a specific ID.
     * @param id the mob ID, eg: 1
     */
    //% block="remove mob with id $id"
    //% blockId="mcmobs_remove_id"
    //% group="Spawning"
    //% weight=92
    export function removeMob(id: number): void {
        _mobs = _mobs.filter(m => m.id !== id)
    }

    /**
     * Remove all hostile mobs.
     */
    //% block="remove all hostile mobs"
    //% blockId="mcmobs_remove_hostile"
    //% group="Spawning"
    //% weight=90
    export function removeAllHostile(): void {
        const hostile = [MCMobType.Creeper, MCMobType.Zombie, MCMobType.Skeleton,
                         MCMobType.Spider, MCMobType.Ghast, MCMobType.Blaze,
                         MCMobType.Witch, MCMobType.EnderDragon, MCMobType.Wither]
        const before = _mobs.length
        _mobs = _mobs.filter(m => hostile.indexOf(m.type) < 0)
        game.showLongText(`⚔️ Removed ${before - _mobs.length} hostile mobs`, DialogLayout.Top)
    }

    /**
     * Clear all mobs from the world.
     */
    //% block="remove all mobs"
    //% blockId="mcmobs_clear"
    //% group="Spawning"
    //% weight=88
    export function removeAllMobs(): void {
        _mobs = []
        game.showLongText("🧹 All mobs removed", DialogLayout.Top)
    }

    // ════════════════════════════════════════════
    //  GROUP: Commands & Behavior
    // ════════════════════════════════════════════

    /**
     * Set the behavior of all mobs of a type.
     * @param mob the mob type
     * @param behavior the behavior to set
     */
    //% block="set all $mob behavior to $behavior"
    //% blockId="mcmobs_set_behavior"
    //% group="Commands & Behavior"
    //% weight=100
    export function setBehavior(mob: MCMobType, behavior: MCMobBehavior): void {
        _mobs.filter(m => m.type === mob).forEach(m => m.behavior = behavior)
        game.showLongText(`🤖 ${MCMobType[mob]}: ${MCMobBehavior[behavior]}`, DialogLayout.Top)
    }

    /**
     * Teleport all mobs of a type to a position.
     * @param mob the mob type
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     */
    //% block="teleport all $mob to x $x y $y z $z"
    //% blockId="mcmobs_teleport"
    //% group="Commands & Behavior"
    //% weight=98
    export function teleportMobs(mob: MCMobType, x: number, y: number, z: number): void {
        _mobs.filter(m => m.type === mob).forEach(m => m.pos = new MCPosition(x, y, z))
        game.showLongText(`✨ Teleported all ${MCMobType[mob]}`, DialogLayout.Top)
    }

    /**
     * Rename a mob by its ID.
     * @param id the mob ID, eg: 1
     * @param name the new name, eg: "Fluffy"
     */
    //% block="rename mob $id to $name"
    //% blockId="mcmobs_rename"
    //% group="Commands & Behavior"
    //% weight=96
    export function renameMob(id: number, name: string): void {
        const mob = _mobs.find(m => m.id === id)
        if (mob) mob.name = name
    }

    /**
     * Make all mobs of a type attack the player.
     * @param mob the mob type
     */
    //% block="make all $mob attack player"
    //% blockId="mcmobs_attack_player"
    //% group="Commands & Behavior"
    //% weight=94
    export function makeAttackPlayer(mob: MCMobType): void {
        setBehavior(mob, MCMobBehavior.AttackPlayer)
    }

    /**
     * Make all mobs flee from the player.
     * @param mob the mob type
     */
    //% block="make all $mob flee from player"
    //% blockId="mcmobs_flee"
    //% group="Commands & Behavior"
    //% weight=92
    export function makeFlee(mob: MCMobType): void {
        setBehavior(mob, MCMobBehavior.FleePlayer)
    }

    // ════════════════════════════════════════════
    //  GROUP: Health & Damage
    // ════════════════════════════════════════════

    /**
     * Get the health of a mob by ID.
     * @param id the mob ID, eg: 1
     */
    //% block="health of mob $id"
    //% blockId="mcmobs_get_health"
    //% group="Health & Damage"
    //% weight=100
    export function getMobHealth(id: number): number {
        const mob = _mobs.find(m => m.id === id)
        return mob ? mob.health : 0
    }

    /**
     * Deal damage to a mob by ID.
     * @param id the mob ID, eg: 1
     * @param amount damage amount, eg: 5
     */
    //% block="deal $amount damage to mob $id"
    //% blockId="mcmobs_damage"
    //% amount.min=1 amount.max=200
    //% group="Health & Damage"
    //% weight=98
    export function damageMob(id: number, amount: number): void {
        const mob = _mobs.find(m => m.id === id)
        if (mob) {
            mob.health = Math.max(0, mob.health - amount)
            if (mob.health <= 0) {
                game.showLongText(`💀 ${mob.name} was slain!`, DialogLayout.Top)
                _mobs = _mobs.filter(m => m.id !== id)
            }
        }
    }

    /**
     * Heal a mob by ID.
     * @param id the mob ID, eg: 1
     * @param amount heal amount, eg: 5
     */
    //% block="heal mob $id by $amount"
    //% blockId="mcmobs_heal"
    //% amount.min=1 amount.max=200
    //% group="Health & Damage"
    //% weight=96
    export function healMob(id: number, amount: number): void {
        const mob = _mobs.find(m => m.id === id)
        if (mob) mob.health = Math.min(mob.maxHealth, mob.health + amount)
    }

    /**
     * Kill a mob by ID instantly.
     * @param id the mob ID, eg: 1
     */
    //% block="kill mob $id"
    //% blockId="mcmobs_kill"
    //% group="Health & Damage"
    //% weight=94
    export function killMob(id: number): void {
        const mob = _mobs.find(m => m.id === id)
        if (mob) {
            game.showLongText(`💀 ${mob.name} was killed`, DialogLayout.Top)
            _mobs = _mobs.filter(m => m.id !== id)
        }
    }

    /**
     * Damage all mobs of a type.
     * @param mob the mob type
     * @param amount damage amount, eg: 5
     */
    //% block="deal $amount damage to all $mob"
    //% blockId="mcmobs_damage_all"
    //% amount.min=1 amount.max=200
    //% group="Health & Damage"
    //% weight=92
    export function damageAllOfType(mob: MCMobType, amount: number): void {
        _mobs.filter(m => m.type === mob).forEach(m => damageMob(m.id, amount))
    }

    // ════════════════════════════════════════════
    //  GROUP: Taming & Breeding
    // ════════════════════════════════════════════

    /**
     * Tame a mob by ID.
     * @param id the mob ID, eg: 1
     */
    //% block="tame mob $id"
    //% blockId="mcmobs_tame"
    //% group="Taming & Breeding"
    //% weight=100
    export function tameMob(id: number): void {
        const mob = _mobs.find(m => m.id === id)
        if (mob) {
            mob.tamed = true
            mob.owner = MCPlayer.getName()
            mob.behavior = MCMobBehavior.FollowPlayer
            game.showLongText(`🐾 ${mob.name} has been tamed!`, DialogLayout.Top)
        }
    }

    /**
     * Check if a mob is tamed.
     * @param id the mob ID, eg: 1
     */
    //% block="mob $id is tamed"
    //% blockId="mcmobs_is_tamed"
    //% group="Taming & Breeding"
    //% weight=98
    export function isTamed(id: number): boolean {
        const mob = _mobs.find(m => m.id === id)
        return mob ? mob.tamed : false
    }

    /**
     * Breed two mobs together to produce offspring.
     * @param id1 first parent mob ID, eg: 1
     * @param id2 second parent mob ID, eg: 2
     */
    //% block="breed mob $id1 with mob $id2"
    //% blockId="mcmobs_breed"
    //% group="Taming & Breeding"
    //% weight=96
    export function breedMobs(id1: number, id2: number): number {
        const m1 = _mobs.find(m => m.id === id1)
        const m2 = _mobs.find(m => m.id === id2)
        if (m1 && m2 && m1.type === m2.type) {
            const baby = spawn(m1.type, m1.pos.x, m1.pos.y, m1.pos.z)
            game.showLongText(`🍼 A baby ${MCMobType[m1.type]} was born!`, DialogLayout.Top)
            return baby
        }
        return -1
    }

    // ════════════════════════════════════════════
    //  GROUP: Detection
    // ════════════════════════════════════════════

    /**
     * Count mobs of a type in the world.
     * @param mob the mob type
     */
    //% block="count of $mob in world"
    //% blockId="mcmobs_count"
    //% group="Detection"
    //% weight=100
    export function countMobs(mob: MCMobType): number {
        return _mobs.filter(m => m.type === mob).length
    }

    /**
     * Count all mobs in the world.
     */
    //% block="total mob count"
    //% blockId="mcmobs_count_all"
    //% group="Detection"
    //% weight=98
    export function countAllMobs(): number {
        return _mobs.length
    }

    /**
     * Returns true if a mob of a type exists within radius of a position.
     * @param mob the mob type
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     * @param radius search radius, eg: 16
     */
    //% block="$mob exists within $radius of x $x y $y z $z"
    //% blockId="mcmobs_exists_near"
    //% radius.min=1 radius.max=100
    //% group="Detection"
    //% weight=96
    export function existsNear(mob: MCMobType, x: number, y: number, z: number, radius: number): boolean {
        return _mobs.some(m => {
            if (m.type !== mob) return false
            const dx = m.pos.x - x
            const dy = m.pos.y - y
            const dz = m.pos.z - z
            return Math.sqrt(dx * dx + dy * dy + dz * dz) <= radius
        })
    }

    /**
     * Get the position of a mob by ID.
     * @param id the mob ID, eg: 1
     */
    //% block="position of mob $id"
    //% blockId="mcmobs_get_pos"
    //% group="Detection"
    //% weight=94
    export function getMobPosition(id: number): MCPosition {
        const mob = _mobs.find(m => m.id === id)
        return mob ? mob.pos : new MCPosition(0, 0, 0)
    }
}
