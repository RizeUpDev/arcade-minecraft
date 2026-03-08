// ============================================================
// mc-ui.ts  —  🖥️ UI Drawer
// HUD, scoreboards, chat, menus, and screen effects.
// ============================================================

/**
 * 🖥️ UI
 * Display HUD elements, scoreboards, chat messages, menus, and screen effects.
 */
//% color="#546E7A"
//% icon="\uf108"
//% weight=20
//% blockGap=8
//% groups='["HUD & Messages","Scoreboard","Chat","Menus","Screen Effects"]'
namespace MCUI {

    let _scoreboard: { [name: string]: number } = {}
    let _hudLines: string[] = ["", "", ""]

    // ════════════════════════════════════════════
    //  GROUP: HUD & Messages
    // ════════════════════════════════════════════

    /**
     * Show a toast/popup message.
     * @param message the message to show, eg: "Welcome!"
     */
    //% block="show toast $message"
    //% blockId="mcui_toast"
    //% group="HUD & Messages"
    //% weight=100
    export function showToast(message: string): void {
        game.showLongText(message, DialogLayout.Top)
    }

    /**
     * Show a big centered title.
     * @param title title text, eg: "ROUND 1"
     * @param subtitle subtitle text, eg: "Survive!"
     */
    //% block="show title $title subtitle $subtitle"
    //% blockId="mcui_title"
    //% group="HUD & Messages"
    //% weight=98
    export function showTitle(title: string, subtitle: string): void {
        game.showLongText(`${title}\n${subtitle}`, DialogLayout.Center)
    }

    /**
     * Show an action bar message (bottom of screen).
     * @param message the message, eg: "Press A to interact"
     */
    //% block="show action bar $message"
    //% blockId="mcui_action_bar"
    //% group="HUD & Messages"
    //% weight=96
    export function showActionBar(message: string): void {
        game.showLongText(message, DialogLayout.Bottom)
    }

    /**
     * Set a HUD line (line 0–2).
     * @param line line number 0–2, eg: 0
     * @param text the text to show, eg: "Health: 20"
     */
    //% block="set HUD line $line to $text"
    //% blockId="mcui_set_hud_line"
    //% line.min=0 line.max=2
    //% group="HUD & Messages"
    //% weight=94
    export function setHUDLine(line: number, text: string): void {
        _hudLines[Math.clamp(0, 2, line)] = text
    }

    /**
     * Show the player's current stats (health, hunger, XP) in the HUD.
     */
    //% block="show player stats HUD"
    //% blockId="mcui_show_stats"
    //% group="HUD & Messages"
    //% weight=92
    export function showPlayerStats(): void {
        const h = MCPlayer.getHealth()
        const hu = MCPlayer.getHunger()
        const lv = MCPlayer.getLevel()
        game.showLongText(
            `❤️ ${h}/20  🍗 ${hu}/20  ⭐ Lv${lv}`,
            DialogLayout.Top
        )
    }

    /**
     * Show a dialog box with a message.
     * @param speaker the speaker name, eg: "Villager"
     * @param message the dialog text, eg: "Hello, traveler!"
     */
    //% block="show dialog from $speaker saying $message"
    //% blockId="mcui_dialog"
    //% group="HUD & Messages"
    //% weight=90
    export function showDialog(speaker: string, message: string): void {
        game.showLongText(`[${speaker}]: ${message}`, DialogLayout.Bottom)
    }

    // ════════════════════════════════════════════
    //  GROUP: Scoreboard
    // ════════════════════════════════════════════

    /**
     * Set a scoreboard entry.
     * @param name the entry name, eg: "Kills"
     * @param value the value, eg: 0
     */
    //% block="set scoreboard $name to $value"
    //% blockId="mcui_set_score"
    //% group="Scoreboard"
    //% weight=100
    export function setScore(name: string, value: number): void {
        _scoreboard[name] = value
    }

    /**
     * Add to a scoreboard entry.
     * @param name the entry name, eg: "Kills"
     * @param amount amount to add, eg: 1
     */
    //% block="add $amount to scoreboard $name"
    //% blockId="mcui_add_score"
    //% group="Scoreboard"
    //% weight=98
    export function addToScore(name: string, amount: number): void {
        _scoreboard[name] = (_scoreboard[name] ?? 0) + amount
        info.setScore(_scoreboard[name])
    }

    /**
     * Get a scoreboard entry value.
     * @param name the entry name, eg: "Kills"
     */
    //% block="scoreboard $name"
    //% blockId="mcui_get_score"
    //% group="Scoreboard"
    //% weight=96
    export function getScore(name: string): number {
        return _scoreboard[name] ?? 0
    }

    /**
     * Display all scoreboard entries as a toast.
     */
    //% block="show scoreboard"
    //% blockId="mcui_show_scoreboard"
    //% group="Scoreboard"
    //% weight=94
    export function showScoreboard(): void {
        const lines = Object.keys(_scoreboard).map(k => `${k}: ${_scoreboard[k]}`).join("\n")
        game.showLongText(lines || "(empty)", DialogLayout.Right)
    }

    /**
     * Reset all scoreboard entries to zero.
     */
    //% block="reset scoreboard"
    //% blockId="mcui_reset_scoreboard"
    //% group="Scoreboard"
    //% weight=92
    export function resetScoreboard(): void {
        _scoreboard = {}
        info.setScore(0)
    }

    // ════════════════════════════════════════════
    //  GROUP: Chat
    // ════════════════════════════════════════════

    /**
     * Send a chat message from a sender.
     * @param sender the sender name, eg: "Steve"
     * @param message the message, eg: "Hello!"
     */
    //% block="chat from $sender say $message"
    //% blockId="mcui_chat"
    //% group="Chat"
    //% weight=100
    export function chat(sender: string, message: string): void {
        game.showLongText(`<${sender}> ${message}`, DialogLayout.Bottom)
    }

    /**
     * Send a system chat message.
     * @param message the message, eg: "The sun rises..."
     */
    //% block="system message $message"
    //% blockId="mcui_system_msg"
    //% group="Chat"
    //% weight=98
    export function systemMessage(message: string): void {
        game.showLongText(`[System] ${message}`, DialogLayout.Bottom)
    }

    /**
     * Announce to all players (broadcast).
     * @param message the broadcast message, eg: "Game starts in 3..."
     */
    //% block="broadcast $message"
    //% blockId="mcui_broadcast"
    //% group="Chat"
    //% weight=96
    export function broadcast(message: string): void {
        game.showLongText(`📢 ${message}`, DialogLayout.Center)
    }

    // ════════════════════════════════════════════
    //  GROUP: Menus
    // ════════════════════════════════════════════

    /**
     * Show the game menu (pause-style).
     */
    //% block="show game menu"
    //% blockId="mcui_game_menu"
    //% group="Menus"
    //% weight=100
    export function showGameMenu(): void {
        game.showLongText(
            "═══ MENU ═══\n" +
            "▶ Resume\n" +
            "⚙ Settings\n" +
            "✖ Quit",
            DialogLayout.Center
        )
    }

    /**
     * Show an inventory UI popup.
     */
    //% block="show inventory UI"
    //% blockId="mcui_inventory"
    //% group="Menus"
    //% weight=98
    export function showInventoryUI(): void {
        game.showLongText(
            "━━ Inventory ━━\n" +
            `Player: ${MCPlayer.getName()}\n` +
            `Level: ${MCPlayer.getLevel()}\n` +
            `Health: ${MCPlayer.getHealth()}/20\n` +
            `Hunger: ${MCPlayer.getHunger()}/20`,
            DialogLayout.Right
        )
    }

    /**
     * Show a death screen UI.
     */
    //% block="show death screen"
    //% blockId="mcui_death_screen"
    //% group="Menus"
    //% weight=96
    export function showDeathScreen(): void {
        game.showLongText(
            "💀 YOU DIED!\n" +
            `Score: ${MCPlayer.getScore()}\n` +
            "Press A to Respawn",
            DialogLayout.Center
        )
    }

    // ════════════════════════════════════════════
    //  GROUP: Screen Effects
    // ════════════════════════════════════════════

    /**
     * Flash the screen a color.
     * @param color the color value (hex), eg: 0xff0000
     */
    //% block="flash screen color $color"
    //% blockId="mcui_flash"
    //% color.shadow="colorindexpicker"
    //% group="Screen Effects"
    //% weight=100
    export function flashScreen(color: number): void {
        scene.setBackgroundColor(color & 0xf)
        pause(100)
        scene.setBackgroundColor(0)
    }

    /**
     * Shake/quake the screen for a duration.
     * @param durationMs duration in ms, eg: 500
     */
    //% block="screen shake for $durationMs ms"
    //% blockId="mcui_shake"
    //% durationMs.min=100 durationMs.max=5000
    //% group="Screen Effects"
    //% weight=98
    export function screenShake(durationMs: number): void {
        game.showLongText("📳 *shake*", DialogLayout.Top)
        pause(durationMs)
    }

    /**
     * Show a "level up" animation.
     */
    //% block="show level up effect"
    //% blockId="mcui_level_up"
    //% group="Screen Effects"
    //% weight=96
    export function showLevelUpEffect(): void {
        music.play(music.createSoundEffect(
            WaveShape.Sine, 440, 880, 255, 0, 500, SoundExpressionEffect.None, InterpolationCurve.Linear
        ), music.PlaybackMode.InBackground)
        game.showLongText(`⭐ LEVEL UP! ⭐\nNow Level ${MCPlayer.getLevel()}`, DialogLayout.Center)
    }

    /**
     * Show a "game over" screen and stop the game.
     * @param message final message, eg: "Game Over"
     */
    //% block="game over with message $message"
    //% blockId="mcui_game_over"
    //% group="Screen Effects"
    //% weight=94
    export function gameOver(message: string): void {
        game.showLongText(message, DialogLayout.Center)
        pause(2000)
        game.over(false)
    }

    /**
     * Show a win screen and end the game.
     * @param message win message, eg: "You Win!"
     */
    //% block="win game with message $message"
    //% blockId="mcui_win"
    //% group="Screen Effects"
    //% weight=92
    export function winGame(message: string): void {
        game.showLongText(message, DialogLayout.Center)
        pause(2000)
        game.over(true)
    }
}
