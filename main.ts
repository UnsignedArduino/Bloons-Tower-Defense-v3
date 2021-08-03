function on_land_tile () {
    return land_tiles.indexOf(tiles.getTileAtLocation(tiles.locationOfSprite(sprite_cursor_pointer))) != -1
}
function update_cursor () {
    sprite_cursor.top = sprite_cursor_pointer.top
    sprite_cursor.left = sprite_cursor_pointer.left
}
function set_variables () {
    in_game = false
    in_round = false
    round_number = 1
    enable_controls = true
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (enable_controls) {
        if (in_game) {
            if (controller.A.isPressed()) {
                if (!(in_round)) {
                    in_round = true
                    timer.background(function () {
                        timer.background(function () {
                            Notification.cancelNotification()
                            Notification.waitForNotificationFinish()
                            Notification.notify("Starting round " + round_number)
                        })
                        run_round(round_number_to_round_code(round_number), 100)
                        round_number += 1
                        in_round = false
                        timer.background(function () {
                            Notification.cancelNotification()
                            Notification.waitForNotificationFinish()
                            Notification.notify("Round " + (round_number - 1) + " finished!")
                        })
                    })
                }
            } else {
            	
            }
        }
    }
})
function make_cursor_icons () {
    sprite_land_icon = sprites.create(assets.image`land_icon`, SpriteKind.Player)
    sprite_water_icon = sprites.create(assets.image`water_icon`, SpriteKind.Player)
    sprite_land_icon.setFlag(SpriteFlag.Ghost, true)
    sprite_water_icon.setFlag(SpriteFlag.Ghost, true)
    sprite_land_icon.z = 100
    sprite_water_icon.z = 100
    update_cursor_icons()
}
function bloon_hp_to_image (hp: number) {
    if (hp == 1) {
        return assets.image`hp_1_bloon`
    } else if (hp == 2) {
        return assets.image`hp_2_bloon`
    } else {
        return assets.image`hp_unknown_bloon`
    }
}
function enable_cursor_movement (en: boolean) {
    if (en) {
        controller.moveSprite(sprite_cursor_pointer, 100, 100)
    } else {
        controller.moveSprite(sprite_cursor_pointer, 0, 0)
    }
}
function round_number_to_round_code (number: number) {
    if (number == 1) {
        return "a  a  a  a  a  a  a  a  a  a  " + "a  a  a  a  a  a  a  a  a  a  "
    } else if (number == 2) {
        return "a  a  a  a  a  a  a  a  a  a  " + "a  a  a  a  a  a  a  a  a  a  " + "a  a  a  a  a  a  a  a  a  a  " + "" + ""
    } else if (number == 3) {
        return "a  a  a  a  a  a  a  a  a  a  " + "a  a  a  a  a  a  a  a  a  a  " + "a  a  a  a  a  a  a  a  a  a  " + "a  a  a  a  a  a  a  a  a  a  " + "a  a  a  a  a  a  a  a  a  a  "
    } else if (number == 4) {
        return "a a a a a a a a a a " + "b  b  b  b  b  " + "a a a a a a a a a a " + "b  b  b  b  b  " + ""
    } else if (number == 5) {
        return "b  b  b  b  b  " + "b  b  b  b  b  " + "a  a  a  a  a  a  a  a  a  a  " + "b  b  b  b  b  " + "b  b  b  b  b  "
    } else {
        return ""
    }
}
function finish_tilemap () {
    for (let tile of [sprites.builtin.forestTiles0, sprites.castle.rock0, sprites.castle.rock1]) {
        for (let location of tiles.getTilesByType(tile)) {
            tiles.setWallAt(location, true)
        }
    }
}
function finish_walk_in_the_park_map () {
    land_tiles = [assets.tile`grass`, sprites.castle.tileGrass1, sprites.castle.tileGrass3, sprites.castle.tileGrass2]
    water_tiles = [
    assets.tile`top_left_water`,
    assets.tile`top_water`,
    assets.tile`top_right_water`,
    assets.tile`left_water`,
    assets.tile`water`,
    assets.tile`right_water`,
    assets.tile`bottom_left_water`,
    assets.tile`bottom_water`,
    assets.tile`bottom_right_water`
    ]
    spawn_locations = [tiles.getTileLocation(2, 0), tiles.getTileLocation(3, 0)]
    bloon_paths = []
    bloon_paths.push(TilemapPath.create_path([
    tiles.getTileLocation(2, 0),
    tiles.getTileLocation(2, 3),
    tiles.getTileLocation(16, 3),
    tiles.getTileLocation(16, 11),
    tiles.getTileLocation(8, 11),
    tiles.getTileLocation(8, 3),
    tiles.getTileLocation(16, 3),
    tiles.getTileLocation(16, 11),
    tiles.getTileLocation(2, 11),
    tiles.getTileLocation(2, 14)
    ]))
    bloon_paths.push(TilemapPath.create_path([
    tiles.getTileLocation(3, 0),
    tiles.getTileLocation(3, 2),
    tiles.getTileLocation(17, 2),
    tiles.getTileLocation(17, 12),
    tiles.getTileLocation(7, 12),
    tiles.getTileLocation(7, 2),
    tiles.getTileLocation(17, 2),
    tiles.getTileLocation(17, 12),
    tiles.getTileLocation(3, 12),
    tiles.getTileLocation(3, 14)
    ]))
}
function set_walk_in_the_park_map () {
    scene.setBackgroundColor(7)
    tiles.setTilemap(tilemap`walk_in_the_park_map`)
}
function make_cursor () {
    sprite_cursor = sprites.create(assets.image`cursor`, SpriteKind.Player)
    sprite_cursor_pointer = sprites.create(assets.image`cursor_pointer`, SpriteKind.Player)
    enable_cursor_movement(true)
    sprite_cursor.setFlag(SpriteFlag.Ghost, true)
    sprite_cursor_pointer.setFlag(SpriteFlag.StayInScreen, true)
    sprite_cursor_pointer.setFlag(SpriteFlag.GhostThroughWalls, true)
    sprite_cursor.z = 90
    sprite_cursor_pointer.z = 100
    update_cursor()
    scene.cameraFollowSprite(sprite_cursor_pointer)
    make_cursor_icons()
}
function game_init () {
    finish_tilemap()
    make_cursor()
    info.setScore(0)
    info.setLife(100)
}
function set_map (index: number) {
    if (index == 0) {
        set_walk_in_the_park_map()
    }
}
function bloon_hp_to_speed (hp: number) {
    if (hp == 1) {
        return 50
    } else if (hp == 2) {
        return 65
    } else {
        return 10
    }
}
function on_water_tile () {
    return water_tiles.indexOf(tiles.getTileAtLocation(tiles.locationOfSprite(sprite_cursor_pointer))) != -1
}
function run_round (round_code: string, delay: number) {
    for (let index = 0; index <= round_code.length - 1; index++) {
        if (round_code.charAt(index) == "a") {
            summon_bloon(1)
        } else if (round_code.charAt(index) == "b") {
            summon_bloon(2)
        } else {
            pause(delay)
        }
        pause(delay)
    }
}
info.onLifeZero(function () {
    pause(0)
    game.over(false)
})
function finish_map_loading (index: number) {
    if (index == 0) {
        finish_walk_in_the_park_map()
    }
}
TilemapPath.onEventWithHandlerArgs(function (sprite) {
    info.changeLifeBy(sprites.readDataNumber(sprite, "health") * -1)
    sprite.destroy()
})
function update_cursor_icons () {
    sprite_land_icon.left = sprite_cursor.right + 2
    sprite_land_icon.top = sprite_cursor.top
    sprite_water_icon.left = sprite_cursor.right + 2
    sprite_water_icon.top = sprite_land_icon.bottom + 2
    if (on_land_tile()) {
        sprite_land_icon.setImage(assets.image`land_icon`)
    } else {
        sprite_land_icon.setImage(assets.image`no_land_icon`)
    }
    if (on_water_tile()) {
        sprite_water_icon.setImage(assets.image`water_icon`)
    } else {
        sprite_water_icon.setImage(assets.image`no_water_icon`)
    }
}
function summon_bloon (hp: number) {
    path_index = randint(0, spawn_locations.length - 1)
    sprite_bloon = sprites.create(bloon_hp_to_image(hp), SpriteKind.Enemy)
    tiles.placeOnTile(sprite_bloon, spawn_locations[path_index])
    sprites.setDataNumber(sprite_bloon, "health", hp)
    timer.background(function () {
        TilemapPath.follow_path(sprite_bloon, bloon_paths[path_index], bloon_hp_to_speed(hp))
    })
}
let sprite_bloon: Sprite = null
let path_index = 0
let bloon_paths: TilemapPath.TilemapPath[] = []
let spawn_locations: tiles.Location[] = []
let water_tiles: Image[] = []
let sprite_water_icon: Sprite = null
let sprite_land_icon: Sprite = null
let enable_controls = false
let round_number = 0
let in_round = false
let sprite_cursor: Sprite = null
let sprite_cursor_pointer: Sprite = null
let land_tiles: Image[] = []
let in_game = false
stats.turnStats(true)
set_variables()
set_map(0)
finish_map_loading(0)
game_init()
in_game = true
timer.background(function () {
    Notification.cancelNotification()
    Notification.waitForNotificationFinish()
    Notification.notify("Hold A and tap B to start round")
})
game.onUpdate(function () {
    update_cursor()
    update_cursor_icons()
})
