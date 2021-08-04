namespace SpriteKind {
    export const Tower = SpriteKind.create()
}
namespace StatusBarKind {
    export const Status = StatusBarKind.create()
}
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
    set_game_variables()
    tower_id = 0
}
function start_round () {
    in_round = true
    timer.background(function () {
        timer.background(function () {
            Notification.cancelNotification()
            Notification.waitForNotificationFinish()
            Notification.notify("Starting round " + round_number)
        })
        sprite_round_status.setFlag(SpriteFlag.Invisible, false)
        run_round(round_number_to_round_code(round_number), 100)
        sprite_round_status.setFlag(SpriteFlag.Invisible, true)
        round_number += 1
        in_round = false
        timer.background(function () {
            Notification.cancelNotification()
            Notification.waitForNotificationFinish()
            Notification.notify("Round " + (round_number - 1) + " finished!")
        })
    })
}
function set_game_variables () {
    game_lose_on_0_lives = true
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (enable_controls) {
        if (in_game) {
            if (is_overlapping_kind(sprite_cursor_pointer, SpriteKind.Tower)) {
            	
            } else {
                new_tower_menu()
            }
        }
    }
})
function make_cursor_icons () {
    sprite_land_icon = sprites.create(assets.image`land_icon`, SpriteKind.Player)
    sprite_water_icon = sprites.create(assets.image`water_icon`, SpriteKind.Player)
    sprite_land_icon.setFlag(SpriteFlag.Ghost, true)
    sprite_water_icon.setFlag(SpriteFlag.Ghost, true)
    sprite_land_icon.z = 50
    sprite_water_icon.z = 50
    update_cursor_icons()
}
function bloon_hp_to_image (hp: number) {
    if (hp == 1) {
        return assets.image`red_bloon`
    } else if (hp == 2) {
        return assets.image`blue_bloon`
    } else if (hp == 3) {
        return assets.image`green_bloon`
    } else {
        return assets.image`test_bloon`
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
    round_code = ""
    if (number == 1) {
        for (let index = 0; index < 20; index++) {
            round_code = "" + round_code + "a  "
        }
    } else if (number == 2) {
        for (let index = 0; index < 30; index++) {
            round_code = "" + round_code + "a  "
        }
    } else if (number == 3) {
        for (let index = 0; index < 50; index++) {
            round_code = "" + round_code + "a  "
        }
    } else if (number == 4) {
        for (let index = 0; index < 2; index++) {
            for (let index = 0; index < 10; index++) {
                round_code = "" + round_code + "a "
            }
            for (let index = 0; index < 5; index++) {
                round_code = "" + round_code + "b  "
            }
        }
    } else if (number == 5) {
        for (let index = 0; index < 10; index++) {
            round_code = "" + round_code + "b  "
        }
        for (let index = 0; index < 10; index++) {
            round_code = "" + round_code + "a "
        }
        for (let index = 0; index < 20; index++) {
            round_code = "" + round_code + "b  "
        }
    } else {
        for (let index = 0; index < number * 15; index++) {
            round_code = "" + round_code + "c "
        }
    }
    return round_code
}
function make_round_status_bar () {
    sprite_round_status = statusbars.create(scene.screenWidth() - 4, 3, StatusBarKind.Status)
    sprite_round_status.setColor(1, 15)
    sprite_round_status.setBarBorder(1, 15)
    sprite_round_status.setStatusBarFlag(StatusBarFlag.InvertFillDirection, true)
    sprite_round_status.left = 2
    sprite_round_status.bottom = scene.screenHeight() - 2
    sprite_round_status.setFlag(SpriteFlag.RelativeToCamera, true)
    sprite_round_status.setFlag(SpriteFlag.Invisible, true)
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
    sprite_cursor.z = 40
    sprite_cursor_pointer.z = 50
    update_cursor()
    scene.cameraFollowSprite(sprite_cursor_pointer)
    make_cursor_icons()
}
function wait_for_menu_select (close: boolean) {
    menu_selected = false
    while (!(menu_selected)) {
        pause(0)
    }
    if (close) {
        blockMenu.closeMenu()
    }
}
function game_init () {
    finish_tilemap()
    make_cursor()
    make_round_status_bar()
    blockMenu.setColors(1, 15)
    info.setScore(100)
    info.setLife(100)
}
function summon_dart_monkey (x: number, y: number) {
    sprite_tower = sprites.create(assets.image`dart_monkey_left`, SpriteKind.Tower)
    sprites.setDataNumber(sprite_tower, "id", tower_id)
    tower_id += 1
    sprites.setDataString(sprite_tower, "type", "dart_monkey")
    sprites.setDataBoolean(sprite_tower, "facing_left", true)
    set_firing_data(sprite_tower, 500, -100, 100, 30, 1.3)
    set_range_data(sprite_tower, 32, 8, 80, 50, 1.2)
    set_dart_data(sprite_tower, 0, 1, 1, 5, 20, 1.4)
    sprite_tower.setPosition(x, y)
}
function new_water_tower () {
    blockMenu.showMenu([], MenuStyle.List, MenuLocation.BottomHalf)
    wait_for_menu_select(true)
}
function set_map (index: number) {
    if (index == 0) {
        set_walk_in_the_park_map()
    }
}
function bloon_hp_to_speed (hp: number) {
    if (hp == 1) {
        return 50 * 1
    } else if (hp == 2) {
        return 50 * 1.4
    } else if (hp == 3) {
        return 50 * 1.8
    } else {
        return 50 * 1
    }
}
function set_firing_data (tower: Sprite, basic2: number, inc: number, best: number, price: number, multiplier: number) {
    sprites.setDataNumber(tower, "firing_speed_base", basic2)
    sprites.setDataNumber(tower, "firing_speed_inc", inc)
    sprites.setDataNumber(tower, "firing_speed_best", best)
    sprites.setDataNumber(tower, "firing_speed_price", price)
    sprites.setDataNumber(tower, "firing_speed_price_mul", multiplier)
}
function new_tower_menu () {
    enable_controls = false
    enable_cursor_movement(false)
    if (on_water_tile()) {
        new_water_tower()
    } else if (on_land_tile()) {
        new_land_tower()
    } else {
        game.showLongText("Not a valid spot!", DialogLayout.Bottom)
    }
    enable_controls = true
    enable_cursor_movement(true)
}
function on_water_tile () {
    return water_tiles.indexOf(tiles.getTileAtLocation(tiles.locationOfSprite(sprite_cursor_pointer))) != -1
}
function run_round (round_code: string, delay: number) {
    sprite_round_status.max = round_code.length
    sprite_round_status.value = round_code.length
    for (let index = 0; index <= round_code.length - 1; index++) {
        sprite_round_status.value += -1
        if (round_code.charAt(index) == "a") {
            summon_bloon(1)
        } else if (round_code.charAt(index) == "b") {
            summon_bloon(2)
        } else if (round_code.charAt(index) == "c") {
            summon_bloon(3)
        } else {
            pause(delay)
        }
        pause(delay)
    }
}
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    if (enable_controls) {
        if (in_game) {
            if (!(in_round)) {
                start_round()
            }
        }
    }
})
info.onLifeZero(function () {
    if (game_lose_on_0_lives) {
        pause(0)
        game.over(false)
    }
})
function set_dart_data (tower: Sprite, _type: number, basic2: number, inc: number, best: number, price: number, multiplier: number) {
    sprites.setDataNumber(tower, "dart_type", _type)
    sprites.setDataNumber(tower, "dart_health_base", basic2)
    sprites.setDataNumber(tower, "dart_health_inc", inc)
    sprites.setDataNumber(tower, "dart_health_best", best)
    sprites.setDataNumber(tower, "dart_health_price", price)
    sprites.setDataNumber(tower, "dart_health_price_mul", multiplier)
}
function finish_map_loading (index: number) {
    if (index == 0) {
        finish_walk_in_the_park_map()
    }
}
function set_range_data (tower: Sprite, basic2: number, inc: number, best: number, price: number, multiplier: number) {
    sprites.setDataNumber(tower, "range_base", basic2)
    sprites.setDataNumber(tower, "range_inc", inc)
    sprites.setDataNumber(tower, "range_best", best)
    sprites.setDataNumber(tower, "range_price", price)
    sprites.setDataNumber(tower, "range_price_mul", multiplier)
}
TilemapPath.onEventWithHandlerArgs(function (sprite) {
    info.changeLifeBy(sprites.readDataNumber(sprite, "health") * -1)
    sprite.destroy()
})
function is_overlapping_kind (target: Sprite, kind: number) {
    for (let sprite of sprites.allOfKind(kind)) {
        if (target.overlapsWith(sprite)) {
            return true
        }
    }
    return false
}
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
function new_land_tower () {
    blockMenu.showMenu(["Dart monkey (25$)"], MenuStyle.List, MenuLocation.BottomHalf)
    wait_for_menu_select(true)
    if (blockMenu.selectedMenuIndex() == 0 && info.score() >= 25) {
        info.changeScoreBy(-25)
        summon_dart_monkey(sprite_cursor_pointer.x, sprite_cursor_pointer.y)
    } else {
        game.showLongText("Not enough money!", DialogLayout.Bottom)
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
blockMenu.onMenuOptionSelected(function (option, index) {
    menu_selected = true
})
let sprite_bloon: Sprite = null
let path_index = 0
let sprite_tower: Sprite = null
let menu_selected = false
let bloon_paths: TilemapPath.TilemapPath[] = []
let spawn_locations: tiles.Location[] = []
let water_tiles: Image[] = []
let round_code = ""
let sprite_water_icon: Sprite = null
let sprite_land_icon: Sprite = null
let game_lose_on_0_lives = false
let sprite_round_status: StatusBarSprite = null
let tower_id = 0
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
    Notification.notify("Press menu to start the round")
})
game.onUpdate(function () {
    update_cursor()
    update_cursor_icons()
})
