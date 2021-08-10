namespace SpriteKind {
    export const Tower = SpriteKind.create()
}
namespace StatusBarKind {
    export const Status = StatusBarKind.create()
}
function on_land_tile () {
    return land_tiles.indexOf(tiles.getTileAtLocation(tiles.locationOfSprite(sprite_cursor_pointer))) != -1
}
function update_sniper_monkey (tower: Sprite) {
    sprite_target = get_farthest_along_path_bloon(tower)
    if (!(sprite_target)) {
        return
    }
    target_angle = spriteutils.angleFrom(tower, sprite_target)
    update_tower_image(tower, spriteutils.radiansToDegrees(target_angle) - 90)
    sprite_projectile = sprites.create(get_projectile_image(sprites.readDataNumber(tower, "dart_type"), spriteutils.radiansToDegrees(target_angle) + 180), SpriteKind.Projectile)
    sprite_projectile.setPosition(tower.x, tower.y)
    sprite_projectile.z = 20
    sprite_projectile.setFlag(SpriteFlag.DestroyOnWall, true)
    sprite_projectile.setFlag(SpriteFlag.Invisible, false)
    sprites.setDataNumber(sprite_projectile, "health", sprites.readDataNumber(tower, "dart_health"))
    sprites.setDataSprite(sprite_projectile, "parent", tower)
    if (false) {
        sprite_projectile.follow(sprite_target, sprites.readDataNumber(tower, "dart_speed"))
    } else {
        spriteutils.setVelocityAtAngle(sprite_projectile, target_angle, sprites.readDataNumber(tower, "dart_speed"))
    }
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
function start_loading () {
    sprite_loading_screen = sprites.create(assets.image`black_screen`, SpriteKind.Player)
    sprite_loading_screen.setFlag(SpriteFlag.Ghost, true)
    sprite_loading_screen.setFlag(SpriteFlag.RelativeToCamera, true)
    sprite_loading_screen.left = 0
    sprite_loading_screen.bottom = 0
    sprite_loading_screen.z = 1000
    sprite_loading_icon = sprites.create(assets.animation`loading`[0], SpriteKind.Player)
    sprite_loading_icon.setFlag(SpriteFlag.Ghost, true)
    sprite_loading_icon.z = 1000
    sprite_loading_icon.setPosition(sprite_loading_screen.x, sprite_loading_screen.y + 30)
    animation.runImageAnimation(
    sprite_loading_icon,
    assets.animation`loading`,
    100,
    true
    )
    sprite_loading_screen.ay = 500
    while (sprite_loading_screen.bottom < scene.screenHeight()) {
        sprite_loading_icon.setPosition(sprite_loading_screen.x, sprite_loading_screen.y + 30)
        pause(0)
    }
    sprite_loading_screen.ay = 0
    sprite_loading_screen.vy = 0
    sprite_loading_screen.bottom = scene.screenHeight()
    sprite_loading_icon.setPosition(sprite_loading_screen.x, sprite_loading_screen.y + 30)
}
function show_tower_range (tower: Sprite) {
    sprite_shader = shader.createImageShaderSprite(image.create(sprites.readDataNumber(tower, "range") * 4, sprites.readDataNumber(tower, "range") * 4), shader.ShadeLevel.One)
    spriteutils.fillCircle(
    sprite_shader.image,
    sprites.readDataNumber(tower, "range") * 2,
    sprites.readDataNumber(tower, "range") * 2,
    sprites.readDataNumber(tower, "range"),
    15
    )
    sprite_shader.setPosition(tower.x, tower.y)
    sprite_shader.z = 5
    sprites.setDataSprite(tower, "tower_range_shadow", sprite_shader)
}
function start_round () {
    in_round = true
    timer.background(function () {
        timer.background(function () {
            pause(200)
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
            pause(200)
            Notification.cancelNotification()
            Notification.waitForNotificationFinish()
            Notification.notify("Round " + (round_number - 1) + " finished!")
        })
    })
}
function get_overlapping_sprite (target: Sprite, kind: number) {
    for (let sprite of sprites.allOfKind(kind)) {
        if (target.overlapsWith(sprite)) {
            return sprite
        }
    }
    return [][0]
}
function set_game_variables () {
    game_lose_on_0_lives = true
    lots_of_money = false
    dart_angle_precision = 60
}
function update_dart_monkey (tower: Sprite) {
    sprite_target = get_farthest_along_path_bloon(tower)
    if (!(sprite_target)) {
        return
    }
    target_angle = spriteutils.angleFrom(tower, sprite_target)
    update_tower_image(tower, spriteutils.radiansToDegrees(target_angle) - 90)
    sprite_projectile = sprites.create(get_projectile_image(sprites.readDataNumber(tower, "dart_type"), spriteutils.radiansToDegrees(target_angle) + 180), SpriteKind.Projectile)
    sprite_projectile.setPosition(tower.x, tower.y)
    sprite_projectile.z = 20
    sprite_projectile.setFlag(SpriteFlag.DestroyOnWall, true)
    sprites.setDataNumber(sprite_projectile, "health", sprites.readDataNumber(tower, "dart_health"))
    sprites.setDataSprite(sprite_projectile, "parent", tower)
    spriteutils.setVelocityAtAngle(sprite_projectile, target_angle, sprites.readDataNumber(tower, "dart_speed"))
}
function get_projectile_image (_type: number, angle: number) {
    return projectile_images[_type][Math.idiv(angle, 360 / dart_angle_precision)]
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (enable_controls) {
        if (in_game) {
            enable_controls = false
            enable_cursor_movement(false)
            if (is_overlapping_kind(sprite_cursor_pointer, SpriteKind.Tower)) {
                sprite_tower = get_overlapping_sprite(sprite_cursor_pointer, SpriteKind.Tower)
                if (sprites.readDataString(sprite_tower, "type") != "sniper_monkey") {
                    show_tower_range(sprite_tower)
                }
                timer.background(function () {
                    while (!(blockMenu.isMenuOpen())) {
                        pause(0)
                    }
                    while (blockMenu.isMenuOpen()) {
                        sprite_tower.say("" + si_ify_number(sprites.readDataNumber(sprite_tower, "total_pops"), 2) + " pops" + "" + "" + "")
                        pause(100)
                    }
                    sprite_tower.say("")
                })
                tower_right_click(sprite_tower)
                if (sprites.readDataString(sprite_tower, "type") != "sniper_monkey") {
                    hide_tower_range(sprite_tower)
                }
            } else {
                new_tower_menu()
            }
            enable_controls = true
            enable_cursor_movement(true)
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
function initialize_projectiles () {
    base_projectile_images = [assets.image`bullet`, assets.image`dart`]
    projectile_images = []
    for (let image2 of base_projectile_images) {
        projectile_images.push(scaling.createRotations(image2, dart_angle_precision))
        pause(0)
    }
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
function summon_sniper_monkey (x: number, y: number) {
    sprite_tower = sprites.create(assets.image`sniper_monkey_left`, SpriteKind.Tower)
    sprites.setDataNumber(sprite_tower, "id", tower_id)
    tower_id += 1
    sprites.setDataString(sprite_tower, "type", "sniper_monkey")
    sprites.setDataBoolean(sprite_tower, "facing_left", true)
    sprites.setDataNumber(sprite_tower, "total_price", 40)
    sprites.setDataNumber(sprite_tower, "total_pops", 0)
    set_firing_data__tower_basic_inc_best_price_mul(sprite_tower, 1000, -200, 100, 30, 1.4)
    set_range_data__tower_basic_inc_best_price_mul(sprite_tower, tiles.tilemapColumns() * tiles.tileWidth(), 0, tiles.tilemapColumns() * tiles.tileWidth(), 50, 1.2)
    set_dart_data__tower_type_basic_inc_best_price_mul_speed(sprite_tower, 0, 2, 2, 10, 20, 1.5, 5000)
    sprite_tower.setPosition(x, y)
    sprite_tower.z = 30
}
function tower_right_click (tower: Sprite) {
    menu_options = ["Cancel"]
    menu_options.push("Sell for " + Math.round(sprites.readDataNumber(tower, "total_price") * 0.8) + "$")
    if (sprites.readDataNumber(tower, "firing_speed") > sprites.readDataNumber(tower, "firing_speed_best")) {
        menu_options.push("Decrease firing delay to " + (sprites.readDataNumber(tower, "firing_speed") + sprites.readDataNumber(tower, "firing_speed_inc")) + " ms for $" + Math.round(sprites.readDataNumber(tower, "firing_speed_price") * sprites.readDataNumber(tower, "firing_speed_price_mul")) + "")
    }
    if (sprites.readDataNumber(tower, "range") < sprites.readDataNumber(tower, "range_best")) {
        menu_options.push("Increase range to " + (sprites.readDataNumber(tower, "range") + sprites.readDataNumber(tower, "range_inc")) + " px for $" + Math.round(sprites.readDataNumber(tower, "range_price") * sprites.readDataNumber(tower, "range_price_mul")) + "")
    }
    if (sprites.readDataNumber(tower, "dart_health") < sprites.readDataNumber(tower, "dart_health_best")) {
        menu_options.push("Increase piercing to " + (sprites.readDataNumber(tower, "dart_health") + sprites.readDataNumber(tower, "dart_health_inc")) + " layers for $" + Math.round(sprites.readDataNumber(tower, "dart_health_price") * sprites.readDataNumber(tower, "dart_health_price_mul")) + "")
    }
    blockMenu.showMenu(menu_options, MenuStyle.List, MenuLocation.BottomHalf)
    wait_for_menu_select(true)
    if (blockMenu.selectedMenuIndex() == 0) {
        return
    } else if (blockMenu.selectedMenuIndex() == 1) {
        tower.destroy()
        info.changeScoreBy(Math.round(sprites.readDataNumber(tower, "total_price") * 0.8))
    } else if (blockMenu.selectedMenuOption().includes("firing delay")) {
        if (info.score() >= Math.round(sprites.readDataNumber(tower, "firing_speed_price") * sprites.readDataNumber(tower, "firing_speed_price_mul"))) {
            tower.startEffect(effects.halo, 500)
            info.changeScoreBy(Math.round(sprites.readDataNumber(tower, "firing_speed_price") * sprites.readDataNumber(tower, "firing_speed_price_mul")) * -1)
            sprites.changeDataNumberBy(tower, "firing_speed", sprites.readDataNumber(tower, "firing_speed_inc"))
            sprites.changeDataNumberBy(tower, "total_price", Math.round(sprites.readDataNumber(tower, "firing_speed_price") * sprites.readDataNumber(tower, "firing_speed_price_mul")))
        } else {
            game.showLongText("Not enough money!", DialogLayout.Bottom)
        }
    } else if (blockMenu.selectedMenuOption().includes("range")) {
        if (info.score() >= Math.round(sprites.readDataNumber(tower, "range_price") * sprites.readDataNumber(tower, "range_price_mul"))) {
            tower.startEffect(effects.halo, 500)
            info.changeScoreBy(Math.round(sprites.readDataNumber(tower, "range_price") * sprites.readDataNumber(tower, "range_price_mul")) * -1)
            sprites.changeDataNumberBy(tower, "range", sprites.readDataNumber(tower, "range_inc"))
            sprites.changeDataNumberBy(tower, "total_price", Math.round(sprites.readDataNumber(tower, "range_price") * sprites.readDataNumber(tower, "range_price_mul")))
        } else {
            game.showLongText("Not enough money!", DialogLayout.Bottom)
        }
    } else if (blockMenu.selectedMenuOption().includes("piercing")) {
        if (info.score() >= Math.round(sprites.readDataNumber(tower, "dart_health_price") * sprites.readDataNumber(tower, "dart_health_price_mul"))) {
            tower.startEffect(effects.halo, 500)
            info.changeScoreBy(Math.round(sprites.readDataNumber(tower, "dart_health_price") * sprites.readDataNumber(tower, "dart_health_price_mul")) * -1)
            sprites.changeDataNumberBy(tower, "dart_health", sprites.readDataNumber(tower, "dart_health_inc"))
            sprites.changeDataNumberBy(tower, "total_price", Math.round(sprites.readDataNumber(tower, "dart_health_price") * sprites.readDataNumber(tower, "dart_health_price_mul")))
        } else {
            game.showLongText("Not enough money!", DialogLayout.Bottom)
        }
    }
}
function get_farthest_along_path_bloon (tower: Sprite) {
    farthest_along_bloon = [][0]
    for (let sprite_bloon of sprites.allOfKind(SpriteKind.Enemy)) {
        if (spriteutils.distanceBetween(tower, sprite_bloon) > sprites.readDataNumber(tower, "range")) {
            continue;
        }
        if (!(farthest_along_bloon) || scene.spritePercentPathCompleted(sprite_bloon) > scene.spritePercentPathCompleted(farthest_along_bloon)) {
            farthest_along_bloon = sprite_bloon
        }
    }
    return farthest_along_bloon
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
            round_code = "" + round_code + "c"
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
function set_firing_data__tower_basic_inc_best_price_mul (tower: Sprite, basic2: number, inc: number, best: number, price: number, multiplier: number) {
    sprites.setDataNumber(tower, "firing_speed", basic2)
    sprites.setDataNumber(tower, "firing_speed_inc", inc)
    sprites.setDataNumber(tower, "firing_speed_best", best)
    sprites.setDataNumber(tower, "firing_speed_price", price)
    sprites.setDataNumber(tower, "firing_speed_price_mul", multiplier)
}
function set_dart_data__tower_type_basic_inc_best_price_mul_speed (tower: Sprite, _type: number, basic2: number, inc: number, best: number, price: number, multiplier: number, speed: number) {
    sprites.setDataNumber(tower, "dart_type", _type)
    sprites.setDataNumber(tower, "dart_health", basic2)
    sprites.setDataNumber(tower, "dart_health_inc", inc)
    sprites.setDataNumber(tower, "dart_health_best", best)
    sprites.setDataNumber(tower, "dart_health_price", price)
    sprites.setDataNumber(tower, "dart_health_price_mul", multiplier)
    sprites.setDataNumber(tower, "dart_speed", speed)
}
function hide_tower_range (tower: Sprite) {
    sprites.readDataSprite(tower, "tower_range_shadow").destroy()
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
function si_ify_number (value: number, precision: number) {
    if (value >= 1e+24) {
        return "" + spriteutils.roundWithPrecision(value / 1e+24, precision) + "Y"
    } else if (value >= 1e+21) {
        return "" + spriteutils.roundWithPrecision(value / 1e+21, precision) + "Z"
    } else if (value >= 1000000000000000000) {
        return "" + spriteutils.roundWithPrecision(value / 1000000000000000000, precision) + "E"
    } else if (value >= 1000000000000000) {
        return "" + spriteutils.roundWithPrecision(value / 1000000000000000, precision) + "P"
    } else if (value >= 1000000000000) {
        return "" + spriteutils.roundWithPrecision(value / 1000000000000, precision) + "T"
    } else if (value >= 1000000000) {
        return "" + spriteutils.roundWithPrecision(value / 1000000000, precision) + "G"
    } else if (value >= 1000000) {
        return "" + spriteutils.roundWithPrecision(value / 1000000, precision) + "M"
    } else if (value >= 1000) {
        return "" + spriteutils.roundWithPrecision(value / 1000, precision) + "k"
    } else {
        return "" + value
    }
}
function game_init () {
    pause(0)
    finish_tilemap()
    pause(0)
    make_cursor()
    pause(0)
    make_round_status_bar()
    pause(0)
    initialize_projectiles()
    pause(0)
    blockMenu.setColors(1, 15)
    if (lots_of_money) {
        info.setScore(100000000000000000)
    } else {
        info.setScore(100)
    }
    info.setLife(100)
}
function update_tower_image (tower: Sprite, angle: number) {
    if (angle < -180 || angle > 0) {
        if (!(sprites.readDataBoolean(tower, "facing_left"))) {
            sprites.setDataBoolean(tower, "facing_left", true)
            tower.image.flipX()
        }
    } else {
        if (sprites.readDataBoolean(tower, "facing_left")) {
            sprites.setDataBoolean(tower, "facing_left", false)
            tower.image.flipX()
        }
    }
}
function summon_dart_monkey (x: number, y: number) {
    sprite_tower = sprites.create(assets.image`dart_monkey_left`, SpriteKind.Tower)
    sprites.setDataNumber(sprite_tower, "id", tower_id)
    tower_id += 1
    sprites.setDataString(sprite_tower, "type", "dart_monkey")
    sprites.setDataBoolean(sprite_tower, "facing_left", true)
    sprites.setDataNumber(sprite_tower, "total_price", 25)
    sprites.setDataNumber(sprite_tower, "total_pops", 0)
    set_firing_data__tower_basic_inc_best_price_mul(sprite_tower, 500, -100, 100, 30, 1.3)
    set_range_data__tower_basic_inc_best_price_mul(sprite_tower, 32, 8, 80, 50, 1.2)
    set_dart_data__tower_type_basic_inc_best_price_mul_speed(sprite_tower, 1, 1, 1, 5, 20, 1.4, 200)
    sprite_tower.setPosition(x, y)
    sprite_tower.z = 30
}
function new_water_tower () {
    blockMenu.showMenu(["Cancel"], MenuStyle.List, MenuLocation.BottomHalf)
    wait_for_menu_select(true)
    if (blockMenu.selectedMenuIndex() == 0) {
        return
    } else {
        game.showLongText("Not enough money!", DialogLayout.Bottom)
    }
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
function new_tower_menu () {
    if (on_water_tile()) {
        new_water_tower()
    } else if (on_land_tile()) {
        new_land_tower()
    } else {
        game.showLongText("Not a valid spot!", DialogLayout.Bottom)
    }
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
TilemapPath.on_sprite_finishes_path(function (sprite) {
    info.changeLifeBy(sprites.readDataNumber(sprite, "health") * -1)
    sprite.destroy()
})
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
function finish_map_loading (index: number) {
    if (index == 0) {
        finish_walk_in_the_park_map()
    }
}
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
function stop_loading () {
    sprite_loading_screen.ay = -500
    while (sprite_loading_screen.bottom > 0) {
        sprite_loading_icon.setPosition(sprite_loading_screen.x, sprite_loading_screen.y + 30)
        pause(0)
    }
    sprite_loading_screen.ay = 0
    sprite_loading_screen.vy = 0
    sprite_loading_screen.bottom = 0
    sprite_loading_icon.setPosition(sprite_loading_screen.x, sprite_loading_screen.y + 30)
    pause(100)
    sprite_loading_screen.destroy()
    sprite_loading_icon.destroy()
}
function set_range_data__tower_basic_inc_best_price_mul (tower: Sprite, basic2: number, inc: number, best: number, price: number, multiplier: number) {
    sprites.setDataNumber(tower, "range", basic2)
    sprites.setDataNumber(tower, "range_inc", inc)
    sprites.setDataNumber(tower, "range_best", best)
    sprites.setDataNumber(tower, "range_price", price)
    sprites.setDataNumber(tower, "range_price_mul", multiplier)
}
function new_land_tower () {
    blockMenu.showMenu(["Cancel", "Dart monkey ($25)", "Sniper monkey ($40)"], MenuStyle.List, MenuLocation.BottomHalf)
    wait_for_menu_select(true)
    if (blockMenu.selectedMenuIndex() == 0) {
        return
    } else if (blockMenu.selectedMenuIndex() == 1 && info.score() >= 25) {
        info.changeScoreBy(-25)
        summon_dart_monkey(sprite_cursor_pointer.x, sprite_cursor_pointer.y)
    } else if (blockMenu.selectedMenuIndex() == 2 && info.score() >= 40) {
        info.changeScoreBy(-40)
        summon_sniper_monkey(sprite_cursor_pointer.x, sprite_cursor_pointer.y)
    } else {
        game.showLongText("Not enough money!", DialogLayout.Bottom)
    }
}
function summon_bloon (hp: number) {
    path_index = randint(0, spawn_locations.length - 1)
    sprite_bloon = sprites.create(bloon_hp_to_image(hp), SpriteKind.Enemy)
    tiles.placeOnTile(sprite_bloon, spawn_locations[path_index])
    sprite_bloon.z = 10
    sprites.setDataNumber(sprite_bloon, "health", hp)
    timer.background(function () {
        TilemapPath.follow_path(sprite_bloon, bloon_paths[path_index], bloon_hp_to_speed(hp))
    })
}
blockMenu.onMenuOptionSelected(function (option, index) {
    menu_selected = true
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprites.changeDataNumberBy(sprite, "health", -1)
    sprites.changeDataNumberBy(otherSprite, "health", -1)
    if (sprites.readDataNumber(sprite, "health") <= 0) {
        sprite.destroy()
    }
    if (sprites.readDataNumber(otherSprite, "health") <= 0) {
        otherSprite.destroy()
        info.changeScoreBy(1)
        sprites.changeDataNumberBy(sprites.readDataSprite(sprite, "parent"), "total_pops", 1)
    } else {
        otherSprite.setImage(bloon_hp_to_image(sprites.readDataNumber(otherSprite, "health")))
    }
})
let sprite_bloon: Sprite = null
let path_index = 0
let menu_selected = false
let bloon_paths: TilemapPath.TilemapPath[] = []
let spawn_locations: tiles.Location[] = []
let water_tiles: Image[] = []
let round_code = ""
let farthest_along_bloon: Sprite = null
let menu_options: string[] = []
let base_projectile_images: Image[] = []
let sprite_water_icon: Sprite = null
let sprite_land_icon: Sprite = null
let sprite_tower: Sprite = null
let projectile_images: Image[][] = []
let dart_angle_precision = 0
let lots_of_money = false
let game_lose_on_0_lives = false
let sprite_round_status: StatusBarSprite = null
let sprite_shader: Sprite = null
let sprite_loading_icon: Sprite = null
let sprite_loading_screen: Sprite = null
let tower_id = 0
let enable_controls = false
let round_number = 0
let in_round = false
let sprite_cursor: Sprite = null
let sprite_projectile: Sprite = null
let target_angle = 0
let sprite_target: Sprite = null
let sprite_cursor_pointer: Sprite = null
let land_tiles: Image[] = []
let in_game = false
stats.turnStats(true)
set_variables()
set_map(0)
pause(0)
start_loading()
pause(0)
finish_map_loading(0)
pause(0)
game_init()
pause(0)
in_game = true
stop_loading()
timer.background(function () {
    Notification.cancelNotification()
    Notification.waitForNotificationFinish()
    Notification.notify("Press menu to start the round")
})
game.onUpdate(function () {
    update_cursor()
    update_cursor_icons()
})
game.onUpdate(function () {
    for (let sprite_tower of sprites.allOfKind(SpriteKind.Tower)) {
        if (sprites.readDataString(sprite_tower, "type") == "dart_monkey") {
            timer.throttle("update_dart_monkey_" + sprites.readDataNumber(sprite_tower, "id"), sprites.readDataNumber(sprite_tower, "firing_speed"), function () {
                update_dart_monkey(sprite_tower)
            })
        } else if (sprites.readDataString(sprite_tower, "type") == "sniper_monkey") {
            timer.throttle("update_sniper_monkey_" + sprites.readDataNumber(sprite_tower, "id"), sprites.readDataNumber(sprite_tower, "firing_speed"), function () {
                update_sniper_monkey(sprite_tower)
            })
        }
    }
})
