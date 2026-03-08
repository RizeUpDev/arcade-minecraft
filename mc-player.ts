// ============================================================
// mc-player.ts  —  🧑 Player Drawer
// Manage the player: health, hunger, position, XP, inventory,
// gamemode, effects, and stats.
// ============================================================

/**
 * 🧑 Player
 * Control the player's health, hunger, position, inventory, XP, gamemode, and effects.
 */
//% color="#2196F3"
//% icon="\uf007"
//% weight=80
//% blockGap=8
//% groups='["Health & Hunger","Position & Movement","XP & Score","Inventory","Gamemode","Effects & Status","Player Info"]'
namespace MCPlayer {

    // ─── Internal State ──────────────────────────────────────────
    let _health: number = 20
    let _maxHealth: number = 20
    let _hunger: number = 20
    let _maxHunger: number = 20
    let _position: MCPosition = new MCPosition(0, 64, 0)
    let _xp: number = 0
    let _level: number = 0
    let _gamemode: MCGameMode = MCGameMode.Survival
    let _playerName: string = "Steve"
    let _score: number = 0
    let _effects: { [effect: number]: { duration: number, level: number } } = {}
    let _inventory: MCItemType[] = []
    let _hotbar: (MCItemType | null)[] = [null, null, null, null, null, null, null, null, null]
    let _armor: { [slot: number]: MCItemType | null } = {
        [MCArmorSlot.Helmet]: null,
        [MCArmorSlot.Chestplate]: null,
        [MCArmorSlot.Leggings]: null,
        [MCArmorSlot.Boots]: null
    }
    let _selectedHotbar: number = 0
    let _flyingEnabled: boolean = false
    let _isOnGround: boolean = true
    let _isSneaking: boolean = false
    let _isSprinting: boolean = false

    // ════════════════════════════════════════════
    //  GROUP: Health & Hunger
    // ════════════════════════════════════════════

    /**
     * Get the player's current health (0–20).
     */
    //% block="player health"
    //% blockId="mcplayer_get_health"
    //% group="Health & Hunger"
    //% weight=100
    export function getHealth(): number {
        return _health
    }

    /**
     * Set the player's health.
     * @param amount health amount 0–20, eg: 20
     */
    //% block="set player health to $amount"
    //% blockId="mcplayer_set_health"
    //% amount.min=0 amount.max=20
    //% group="Health & Hunger"
    //% weight=98
    export function setHealth(amount: number): void {
        _health = Math.clamp(0, _maxHealth, amount)
        if (_health <= 0) {
            game.showLongText("💀 You died!", DialogLayout.Center)
        }
    }

    /**
     * Heal the player by an amount.
     * @param amount health to restore, eg: 4
     */
    //% block="heal player by $amount"
    //% blockId="mcplayer_heal"
    //% amount.min=1 amount.max=20
    //% group="Health & Hunger"
    //% weight=96
    export function heal(amount: number): void {
        _health = Math.min(_maxHealth, _health + amount)
        game.showLongText(`❤️ Healed +${amount} HP`, DialogLayout.Top)
    }

    /**
     * Damage the player by an amount.
     * @param amount damage to deal, eg: 2
     */
    //% block="damage player by $amount"
    //% blockId="mcplayer_damage"
    //% amount.min=1 amount.max=20
    //% group="Health & Hunger"
    //% weight=94
    export function damage(amount: number): void {
        _health = Math.max(0, _health - amount)
        if (_health <= 0) {
            game.showLongText("💀 You died!", DialogLayout.Center)
        } else {
            game.showLongText(`💔 Took ${amount} damage`, DialogLayout.Top)
        }
    }

    /**
     * Returns true if the player is alive.
     */
    //% block="player is alive"
    //% blockId="mcplayer_is_alive"
    //% group="Health & Hunger"
    //% weight=92
    export function isAlive(): boolean {
        return _health > 0
    }

    /**
     * Get the player's current hunger (0–20).
     */
    //% block="player hunger"
    //% blockId="mcplayer_get_hunger"
    //% group="Health & Hunger"
    //% weight=90
    export function getHunger(): number {
        return _hunger
    }

    /**
     * Set the player's hunger level.
     * @param amount hunger 0–20, eg: 20
     */
    //% block="set player hunger to $amount"
    //% blockId="mcplayer_set_hunger"
    //% amount.min=0 amount.max=20
    //% group="Health & Hunger"
    //% weight=88
    export function setHunger(amount: number): void {
        _hunger = Math.clamp(0, _maxHunger, amount)
    }

    /**
     * Feed the player an amount.
     * @param amount hunger to restore, eg: 4
     */
    //% block="feed player $amount hunger"
    //% blockId="mcplayer_feed"
    //% amount.min=1 amount.max=20
    //% group="Health & Hunger"
    //% weight=86
    export function feed(amount: number): void {
        _hunger = Math.min(_maxHunger, _hunger + amount)
    }

    /**
     * Returns true if the player is starving.
     */
    //% block="player is starving"
    //% blockId="mcplayer_is_starving"
    //% group="Health & Hunger"
    //% weight=84
    export function isStarving(): boolean {
        return _hunger <= 0
    }

    // ════════════════════════════════════════════
    //  GROUP: Position & Movement
    // ════════════════════════════════════════════

    /**
     * Get the player's current position.
     */
    //% block="player position"
    //% blockId="mcplayer_get_position"
    //% group="Position & Movement"
    //% weight=100
    export function getPosition(): MCPosition {
        return _position
    }

    /**
     * Get the player's X coordinate.
     */
    //% block="player x"
    //% blockId="mcplayer_get_x"
    //% group="Position & Movement"
    //% weight=98
    export function getX(): number { return _position.x }

    /**
     * Get the player's Y coordinate.
     */
    //% block="player y"
    //% blockId="mcplayer_get_y"
    //% group="Position & Movement"
    //% weight=96
    export function getY(): number { return _position.y }

    /**
     * Get the player's Z coordinate.
     */
    //% block="player z"
    //% blockId="mcplayer_get_z"
    //% group="Position & Movement"
    //% weight=94
    export function getZ(): number { return _position.z }

    /**
     * Teleport the player to a position.
     * @param x x, eg: 0
     * @param y y, eg: 64
     * @param z z, eg: 0
     */
    //% block="teleport player to x $x y $y z $z"
    //% blockId="mcplayer_teleport"
    //% group="Position & Movement"
    //% weight=92
    export function teleport(x: number, y: number, z: number): void {
        _position = new MCPosition(x, y, z)
        game.showLongText(`✨ Teleported to (${x},${y},${z})`, DialogLayout.Top)
    }

    /**
     * Teleport player to a position value.
     * @param pos the destination
     */
    //% block="teleport player to $pos"
    //% blockId="mcplayer_teleport_pos"
    //% group="Position & Movement"
    //% weight=90
    export function teleportTo(pos: MCPosition): void {
        teleport(pos.x, pos.y, pos.z)
    }

    /**
     * Move the player by an offset.
     * @param dx x offset, eg: 1
     * @param dy y offset, eg: 0
     * @param dz z offset, eg: 0
     */
    //% block="move player x $dx y $dy z $dz"
    //% blockId="mcplayer_move"
    //% group="Position & Movement"
    //% weight=88
    export function move(dx: number, dy: number, dz: number): void {
        _position = new MCPosition(_position.x + dx, _position.y + dy, _position.z + dz)
    }

    /**
     * Enable or disable flight for the player.
     * @param on true to allow flying
     */
    //% block="player flying $on"
    //% blockId="mcplayer_flying"
    //% on.shadow="toggleOnOff"
    //% group="Position & Movement"
    //% weight=86
    export function setFlying(on: boolean): void {
        _flyingEnabled = on
        game.showLongText(on ? "🦅 Flying enabled" : "🦅 Flying disabled", DialogLayout.Top)
    }

    /**
     * Returns true if the player is flying.
     */
    //% block="player is flying"
    //% blockId="mcplayer_is_flying"
    //% group="Position & Movement"
    //% weight=84
    export function isFlying(): boolean { return _flyingEnabled }

    /**
     * Returns true if the player is sneaking.
     */
    //% block="player is sneaking"
    //% blockId="mcplayer_is_sneaking"
    //% group="Position & Movement"
    //% weight=82
    export function isSneaking(): boolean { return _isSneaking }

    // ════════════════════════════════════════════
    //  GROUP: XP & Score
    // ════════════════════════════════════════════

    /**
     * Get the player's current XP.
     */
    //% block="player XP"
    //% blockId="mcplayer_get_xp"
    //% group="XP & Score"
    //% weight=100
    export function getXP(): number { return _xp }

    /**
     * Add XP to the player.
     * @param amount XP to add, eg: 10
     */
    //% block="give player $amount XP"
    //% blockId="mcplayer_add_xp"
    //% amount.min=1 amount.max=1000
    //% group="XP & Score"
    //% weight=98
    export function addXP(amount: number): void {
        _xp += amount
        while (_xp >= _xpToNextLevel(_level)) {
            _xp -= _xpToNextLevel(_level)
            _level++
            game.showLongText(`⭐ Level Up! You are now Level ${_level}`, DialogLayout.Center)
        }
    }

    /**
     * Get the player's current level.
     */
    //% block="player level"
    //% blockId="mcplayer_get_level"
    //% group="XP & Score"
    //% weight=96
    export function getLevel(): number { return _level }

    /**
     * Set the player's level directly.
     * @param level the level to set, eg: 10
     */
    //% block="set player level to $level"
    //% blockId="mcplayer_set_level"
    //% level.min=0 level.max=100
    //% group="XP & Score"
    //% weight=94
    export function setLevel(level: number): void {
        _level = Math.max(0, level)
        _xp = 0
    }

    /**
     * Get the player's score.
     */
    //% block="player score"
    //% blockId="mcplayer_get_score"
    //% group="XP & Score"
    //% weight=92
    export function getScore(): number { return _score }

    /**
     * Add to the player's score.
     * @param amount score to add, eg: 100
     */
    //% block="add $amount to player score"
    //% blockId="mcplayer_add_score"
    //% group="XP & Score"
    //% weight=90
    export function addScore(amount: number): void {
        _score += amount
        info.setScore(_score)
    }

    /**
     * Set the player's score.
     * @param amount score to set, eg: 0
     */
    //% block="set player score to $amount"
    //% blockId="mcplayer_set_score"
    //% group="XP & Score"
    //% weight=88
    export function setScore(amount: number): void {
        _score = amount
        info.setScore(_score)
    }

    // ════════════════════════════════════════════
    //  GROUP: Inventory
    // ════════════════════════════════════════════

    /**
     * Give the player an item.
     * @param item the item to give
     */
    //% block="give player $item"
    //% blockId="mcplayer_give_item"
    //% group="Inventory"
    //% weight=100
    export function giveItem(item: MCItemType): void {
        _inventory.push(item)
        game.showLongText(`🎒 Got ${MCItemType[item]}`, DialogLayout.Top)
    }

    /**
     * Remove an item from the player's inventory.
     * @param item the item to remove
     */
    //% block="take $item from player"
    //% blockId="mcplayer_take_item"
    //% group="Inventory"
    //% weight=98
    export function takeItem(item: MCItemType): void {
        const i = _inventory.indexOf(item)
        if (i >= 0) {
            _inventory.splice(i, 1)
            game.showLongText(`🗑 Removed ${MCItemType[item]}`, DialogLayout.Top)
        }
    }

    /**
     * Check if the player has an item.
     * @param item the item to check
     */
    //% block="player has $item"
    //% blockId="mcplayer_has_item"
    //% group="Inventory"
    //% weight=96
    export function hasItem(item: MCItemType): boolean {
        return _inventory.indexOf(item) >= 0
    }

    /**
     * Count how many of an item the player has.
     * @param item the item to count
     */
    //% block="player's count of $item"
    //% blockId="mcplayer_count_item"
    //% group="Inventory"
    //% weight=94
    export function countItem(item: MCItemType): number {
        return _inventory.filter(i => i === item).length
    }

    /**
     * Clear all items from the player's inventory.
     */
    //% block="clear player inventory"
    //% blockId="mcplayer_clear_inventory"
    //% group="Inventory"
    //% weight=92
    export function clearInventory(): void {
        _inventory = []
        game.showLongText("🗑 Inventory cleared", DialogLayout.Top)
    }

    /**
     * Equip armor to the player.
     * @param item the armor piece
     * @param slot the armor slot
     */
    //% block="equip $item in $slot slot"
    //% blockId="mcplayer_equip_armor"
    //% group="Inventory"
    //% weight=90
    export function equipArmor(item: MCItemType, slot: MCArmorSlot): void {
        _armor[slot] = item
        game.showLongText(`🛡 Equipped ${MCItemType[item]} in ${MCArmorSlot[slot]}`, DialogLayout.Top)
    }

    /**
     * Set a hotbar slot to an item.
     * @param slot hotbar slot 0–8, eg: 0
     * @param item the item to place
     */
    //% block="set hotbar slot $slot to $item"
    //% blockId="mcplayer_set_hotbar"
    //% slot.min=0 slot.max=8
    //% group="Inventory"
    //% weight=88
    export function setHotbar(slot: number, item: MCItemType): void {
        _hotbar[Math.clamp(0, 8, slot)] = item
    }

    // ════════════════════════════════════════════
    //  GROUP: Gamemode
    // ════════════════════════════════════════════

    /**
     * Set the player's game mode.
     * @param mode the game mode
     */
    //% block="set gamemode to $mode"
    //% blockId="mcplayer_set_gamemode"
    //% group="Gamemode"
    //% weight=100
    export function setGameMode(mode: MCGameMode): void {
        _gamemode = mode
        game.showLongText(`🎮 Gamemode: ${MCGameMode[mode]}`, DialogLayout.Top)
    }

    /**
     * Get the current game mode.
     */
    //% block="current gamemode"
    //% blockId="mcplayer_get_gamemode"
    //% group="Gamemode"
    //% weight=98
    export function getGameMode(): MCGameMode { return _gamemode }

    /**
     * Returns true if the player is in Creative mode.
     */
    //% block="player is in creative mode"
    //% blockId="mcplayer_is_creative"
    //% group="Gamemode"
    //% weight=96
    export function isCreative(): boolean { return _gamemode === MCGameMode.Creative }

    /**
     * Returns true if the player is in Survival mode.
     */
    //% block="player is in survival mode"
    //% blockId="mcplayer_is_survival"
    //% group="Gamemode"
    //% weight=94
    export function isSurvival(): boolean { return _gamemode === MCGameMode.Survival }

    // ════════════════════════════════════════════
    //  GROUP: Effects & Status
    // ════════════════════════════════════════════

    /**
     * Apply a potion effect to the player.
     * @param effect the effect to apply
     * @param duration duration in seconds, eg: 30
     * @param level effect level 1–3, eg: 1
     */
    //% block="apply $effect to player for $duration s level $level"
    //% blockId="mcplayer_apply_effect"
    //% duration.min=1 duration.max=300
    //% level.min=1 level.max=3
    //% group="Effects & Status"
    //% weight=100
    export function applyEffect(effect: MCEffect, duration: number, level: number): void {
        _effects[effect] = { duration, level }
        game.showLongText(`✨ ${MCEffect[effect]} ${level} for ${duration}s`, DialogLayout.Top)
    }

    /**
     * Remove a potion effect from the player.
     * @param effect the effect to remove
     */
    //% block="remove $effect from player"
    //% blockId="mcplayer_remove_effect"
    //% group="Effects & Status"
    //% weight=98
    export function removeEffect(effect: MCEffect): void {
        delete _effects[effect]
    }

    /**
     * Check if the player has an effect active.
     * @param effect the effect to check
     */
    //% block="player has effect $effect"
    //% blockId="mcplayer_has_effect"
    //% group="Effects & Status"
    //% weight=96
    export function hasEffect(effect: MCEffect): boolean {
        return _effects[effect] !== undefined
    }

    /**
     * Remove all active effects from the player.
     */
    //% block="remove all effects from player"
    //% blockId="mcplayer_clear_effects"
    //% group="Effects & Status"
    //% weight=94
    export function clearEffects(): void {
        _effects = {}
        game.showLongText("🧹 All effects cleared", DialogLayout.Top)
    }

    /**
     * Set the player on fire for a duration.
     * @param seconds duration of fire in seconds, eg: 5
     */
    //% block="set player on fire for $seconds seconds"
    //% blockId="mcplayer_set_fire"
    //% seconds.min=1 seconds.max=30
    //% group="Effects & Status"
    //% weight=92
    export function setOnFire(seconds: number): void {
        game.showLongText(`🔥 Player is on fire for ${seconds}s!`, DialogLayout.Top)
    }

    // ════════════════════════════════════════════
    //  GROUP: Player Info
    // ════════════════════════════════════════════

    /**
     * Set the player's name.
     * @param name the player name, eg: "Steve"
     */
    //% block="set player name to $name"
    //% blockId="mcplayer_set_name"
    //% group="Player Info"
    //% weight=100
    export function setName(name: string): void {
        _playerName = name
    }

    /**
     * Get the player's name.
     */
    //% block="player name"
    //% blockId="mcplayer_get_name"
    //% group="Player Info"
    //% weight=98
    export function getName(): string { return _playerName }

    /**
     * Show a message in the player's HUD.
     * @param message the message to show, eg: "Hello, world!"
     */
    //% block="show HUD message $message"
    //% blockId="mcplayer_show_hud"
    //% group="Player Info"
    //% weight=96
    export function showHUD(message: string): void {
        game.showLongText(message, DialogLayout.Top)
    }

    /**
     * Show a title message on screen.
     * @param title the title, eg: "You Win!"
     * @param subtitle subtitle, eg: "Great job!"
     */
    //% block="show title $title subtitle $subtitle"
    //% blockId="mcplayer_show_title"
    //% group="Player Info"
    //% weight=94
    export function showTitle(title: string, subtitle: string): void {
        game.showLongText(`${title}\n${subtitle}`, DialogLayout.Center)
    }

    // ─── Internal helper ─────────────────────────────────────────
    function _xpToNextLevel(level: number): number {
        if (level < 16) return 2 * level + 7
        if (level < 31) return 5 * level - 38
        return 9 * level - 158
    }
}
