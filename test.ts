// ============================================================
// test.ts  —  Example usage of the Minecraft Arcade Extension
// ============================================================

// ─── Example 1: Classic Survival Scenario ────────────────────
MCEvents.onGameStart(() => {
    // Set up the world
    MCWorld.setWorldName("My Adventure")
    MCWorld.setTimeOfDay(MCTimeOfDay.Sunrise)
    MCWorld.setWeather(MCWeather.Clear)

    // Set player stats
    MCPlayer.setName("Steve")
    MCPlayer.setGameMode(MCGameMode.Survival)
    MCPlayer.setHealth(20)
    MCPlayer.setHunger(20)

    // Give starter items
    MCItems.giveStarterKit()
    MCPlayer.addXP(50)

    // Build a little spawn platform
    MCCommands.buildSpawnPlatform(0, 63, 0)

    // Greet the player
    MCUI.showTitle("Welcome!", "Survive the night...")
})

// ─── Example 2: Night-time mob wave ───────────────────────────
MCEvents.onNighttime(() => {
    MCCommands.startMobWave(1)
})

// ─── Example 3: Player death handling ────────────────────────
MCEvents.onPlayerDied(() => {
    MCUI.showDeathScreen()
    pause(2000)
    MCPlayer.setHealth(20)
    MCPlayer.setHunger(20)
    MCPlayer.teleport(0, 65, 0)
    MCUI.broadcast("Steve respawned!")
})

// ─── Example 4: Redstone door trap ───────────────────────────
MCBlocks.placeBlock(MCBlockType.Chest, 10, 64, 10)

// When player gets near, open a hidden redstone door
MCEvents.runEvery(1000, () => {
    const px = MCPlayer.getX()
    const pz = MCPlayer.getZ()
    if (Math.abs(px - 10) < 5 && Math.abs(pz - 10) < 5) {
        MCRedstone.setDoor(12, 64, 10, true)
    }
})

// ─── Example 5: Crafting recipe & auto-craft ──────────────────
MCCrafting.registerRecipe(MCItemType.GoldenApple, 1,
    MCItemType.Apple, MCItemType.GoldIngot)

// Give required materials and craft
MCPlayer.giveItem(MCItemType.Apple)
MCPlayer.giveItem(MCItemType.GoldIngot)
MCCrafting.craft(MCItemType.GoldenApple)

// ─── Example 6: Kill all mobs when player levels up ──────────
MCEvents.onPlayerReachesLevel(10, () => {
    MCUI.showTitle("LEVEL 10!", "All mobs cleared!")
    MCMobs.removeAllHostile()
    MCPlayer.applyEffect(MCEffect.Strength, 60, 2)
})
