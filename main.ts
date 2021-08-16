namespace SpriteKind {
    export const Tower = SpriteKind.create()
}
namespace StatusBarKind {
    export const Status = StatusBarKind.create()
}
function on_land_tile () {
    return land_tiles.indexOf(tiles.getTileAtLocation(tiles.locationOfSprite(sprite_cursor_pointer))) != -1
}
function stop_cut () {
    sprite_cut_screen.ay = -500
    while (sprite_cut_screen.bottom > 0) {
        pause(0)
    }
    sprite_cut_screen.ay = 0
    sprite_cut_screen.vy = 0
    sprite_cut_screen.bottom = 0
    pause(100)
    sprite_cut_screen.destroy()
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
    sprite_projectile.setFlag(SpriteFlag.Invisible, true)
    sprites.setDataNumber(sprite_projectile, "health", sprites.readDataNumber(tower, "dart_health"))
    sprites.setDataSprite(sprite_projectile, "parent", tower)
    if (false) {
        sprite_projectile.follow(sprite_target, sprites.readDataNumber(tower, "dart_speed"))
    } else {
        spriteutils.setVelocityAtAngle(sprite_projectile, target_angle, sprites.readDataNumber(tower, "dart_speed"))
    }
}
function update_cursor () {
    if (!(sprite_cursor) || !(sprite_cursor_pointer)) {
        return
    }
    sprite_cursor.top = sprite_cursor_pointer.top
    sprite_cursor.left = sprite_cursor_pointer.left
}
function start_cut () {
    sprite_cut_screen = sprites.create(assets.image`black_screen`, SpriteKind.Player)
    sprite_cut_screen.setFlag(SpriteFlag.Ghost, true)
    sprite_cut_screen.setFlag(SpriteFlag.RelativeToCamera, true)
    sprite_cut_screen.left = 0
    sprite_cut_screen.bottom = 0
    sprite_cut_screen.z = 1000
    sprite_cut_screen.ay = 500
    while (sprite_cut_screen.bottom < scene.screenHeight()) {
        pause(0)
    }
    sprite_cut_screen.ay = 0
    sprite_cut_screen.vy = 0
    sprite_cut_screen.bottom = scene.screenHeight()
}
function set_variables () {
    in_game = false
    in_round = false
    max_map = 2
    current_map = 0
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
    sprite_loading_icon.setFlag(SpriteFlag.RelativeToCamera, true)
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
    sprite_shader = shader.createImageShaderSprite(image.create(sprites.readDataNumber(tower, "range") * 2, sprites.readDataNumber(tower, "range") * 2), shader.ShadeLevel.One)
    spriteutils.fillCircle(
    sprite_shader.image,
    sprites.readDataNumber(tower, "range") * 1,
    sprites.readDataNumber(tower, "range") * 1,
    sprites.readDataNumber(tower, "range") * 1,
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
            pause(500)
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
            pause(500)
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
function finish_dark_dungeons () {
    land_tiles = [
    sprites.dungeon.darkGroundWest,
    sprites.dungeon.darkGroundNorthWest0,
    sprites.dungeon.darkGroundSouthWest0,
    sprites.dungeon.darkGroundNorthEast0,
    sprites.dungeon.darkGroundSouthEast0,
    sprites.dungeon.darkGroundEast,
    sprites.dungeon.darkGroundSouthWest1,
    sprites.dungeon.darkGroundNorth,
    sprites.dungeon.darkGroundSouthEast1,
    sprites.dungeon.darkGroundNorthEast1,
    sprites.dungeon.darkGroundSouth,
    sprites.dungeon.darkGroundNorthWest1
    ]
    water_tiles = [sprites.dungeon.hazardLava0, sprites.dungeon.hazardLava1]
    spawn_locations = [tiles.getTileLocation(8, 7), tiles.getTileLocation(11, 7)]
    bloon_paths = []
    bloon_paths.push(TilemapPath.create_path([
    tiles.getTileLocation(8, 7),
    tiles.getTileLocation(2, 7),
    tiles.getTileLocation(2, 2),
    tiles.getTileLocation(17, 2),
    tiles.getTileLocation(17, 7),
    tiles.getTileLocation(12, 7),
    tiles.getTileLocation(12, 5),
    tiles.getTileLocation(7, 5),
    tiles.getTileLocation(7, 7),
    tiles.getTileLocation(1, 7)
    ]))
    bloon_paths.push(TilemapPath.create_path([
    tiles.getTileLocation(11, 7),
    tiles.getTileLocation(17, 7),
    tiles.getTileLocation(17, 12),
    tiles.getTileLocation(2, 12),
    tiles.getTileLocation(2, 7),
    tiles.getTileLocation(7, 7),
    tiles.getTileLocation(7, 9),
    tiles.getTileLocation(12, 9),
    tiles.getTileLocation(12, 7),
    tiles.getTileLocation(18, 7)
    ]))
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
    return projectile_images[_type][Math.idiv(angle, 360 / dart_angle_precision) % dart_angle_precision]
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
                        sprite_tower.say("" + si_ify_number(sprites.readDataNumber(sprite_tower, "total_pops"), 2) + " pops")
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
    base_projectile_images = [assets.image`bullet`, assets.image`dart`, assets.image`tack`]
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
    } else if (hp == 4) {
        return assets.image`yellow_bloon`
    } else if (hp == 5) {
        return assets.image`pink_bloon`
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
    set_dart_data__tower_type_basic_inc_best_price_mul_speed(sprite_tower, 0, 2, 2, 10, 20, 1.5, 500)
    sprite_tower.setPosition(x, y)
    sprite_tower.z = 30
}
function summon_monkey_buccaneer (x: number, y: number) {
    sprite_tower = sprites.create(assets.image`monkey_buccaneer_left`, SpriteKind.Tower)
    sprites.setDataNumber(sprite_tower, "id", tower_id)
    tower_id += 1
    sprites.setDataString(sprite_tower, "type", "monkey_buccaneer")
    sprites.setDataBoolean(sprite_tower, "facing_left", true)
    sprites.setDataNumber(sprite_tower, "total_price", 50)
    sprites.setDataNumber(sprite_tower, "total_pops", 0)
    set_firing_data__tower_basic_inc_best_price_mul(sprite_tower, 1000, -200, 200, 50, 1.2)
    set_range_data__tower_basic_inc_best_price_mul(sprite_tower, 40, 8, 80, 60, 1.2)
    set_dart_data__tower_type_basic_inc_best_price_mul_speed(sprite_tower, 1, 1, 1, 4, 20, 1.4, 200)
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
            sprites.changeDataNumberBy(tower, "firing_speed", sprites.readDataNumber(tower, "firing_speed_inc"))
            sprites.setDataNumber(tower, "firing_speed_price", Math.round(sprites.readDataNumber(tower, "firing_speed_price") * sprites.readDataNumber(tower, "firing_speed_price_mul")))
            info.changeScoreBy(sprites.readDataNumber(tower, "firing_speed_price") * -1)
            sprites.changeDataNumberBy(tower, "total_price", sprites.readDataNumber(tower, "firing_speed_price"))
        } else {
            game.showLongText("Not enough money!", DialogLayout.Bottom)
        }
    } else if (blockMenu.selectedMenuOption().includes("range")) {
        if (info.score() >= Math.round(sprites.readDataNumber(tower, "range_price") * sprites.readDataNumber(tower, "range_price_mul"))) {
            tower.startEffect(effects.halo, 500)
            sprites.changeDataNumberBy(tower, "range", sprites.readDataNumber(tower, "range_inc"))
            sprites.setDataNumber(tower, "range_price", Math.round(sprites.readDataNumber(tower, "range_price") * sprites.readDataNumber(tower, "range_price_mul")))
            info.changeScoreBy(sprites.readDataNumber(tower, "range_price") * -1)
            sprites.changeDataNumberBy(tower, "total_price", sprites.readDataNumber(tower, "range_price"))
        } else {
            game.showLongText("Not enough money!", DialogLayout.Bottom)
        }
    } else if (blockMenu.selectedMenuOption().includes("piercing")) {
        if (info.score() >= Math.round(sprites.readDataNumber(tower, "dart_health_price") * sprites.readDataNumber(tower, "dart_health_price_mul"))) {
            tower.startEffect(effects.halo, 500)
            sprites.changeDataNumberBy(tower, "dart_health", sprites.readDataNumber(tower, "dart_health_inc"))
            sprites.setDataNumber(tower, "dart_health_price", Math.round(sprites.readDataNumber(tower, "dart_health_price") * sprites.readDataNumber(tower, "dart_health_price_mul")))
            info.changeScoreBy(sprites.readDataNumber(tower, "dart_health_price") * -1)
            sprites.changeDataNumberBy(tower, "total_price", sprites.readDataNumber(tower, "dart_health_price"))
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
        if (!(farthest_along_bloon)) {
            farthest_along_bloon = sprite_bloon
        } else if (sprites.readDataNumber(sprite_bloon, "_tilemap_path_curr_segment") > sprites.readDataNumber(farthest_along_bloon, "_tilemap_path_curr_segment")) {
            farthest_along_bloon = sprite_bloon
        } else if (sprites.readDataNumber(sprite_bloon, "_tilemap_path_curr_segment") < sprites.readDataNumber(farthest_along_bloon, "_tilemap_path_curr_segment")) {
        	
        } else if (scene.spritePercentPathCompleted(sprite_bloon) > scene.spritePercentPathCompleted(farthest_along_bloon)) {
            farthest_along_bloon = sprite_bloon
        }
    }
    return farthest_along_bloon
}
function select_map () {
    current_map = 0
    map_names = ["Walk in the Park", "Beautiful Beach", "Dark Dungeons"]
    set_map(current_map)
    sprite_map_title = sprites.create(assets.image`map_title_template`, SpriteKind.Player)
    sprite_map_title.left = 0
    sprite_map_title.bottom = scene.screenHeight()
    sprite_map_title.setFlag(SpriteFlag.AutoDestroy, true)
    sprite_map_title.setFlag(SpriteFlag.RelativeToCamera, true)
    sprite_map_title.setFlag(SpriteFlag.Ghost, true)
    update_map = true
    sprite_map_sel_title = sprites.create(assets.image`map_select_title_template`, SpriteKind.Player)
    sprite_map_sel_title.left = 0
    sprite_map_sel_title.top = 0
    sprite_map_sel_title.setFlag(SpriteFlag.AutoDestroy, true)
    sprite_map_sel_title.setFlag(SpriteFlag.RelativeToCamera, true)
    sprite_map_sel_title.setFlag(SpriteFlag.Ghost, true)
    images.print(sprite_map_sel_title.image, "Please select a map:", 4, 4, 1)
    sprite_map_sel_cam = sprites.create(assets.image`blank`, SpriteKind.Player)
    scene.cameraFollowSprite(sprite_map_sel_cam)
    map_sel_anim_path = TilemapPath.create_path([
    tiles.getTileLocation(5, 5),
    tiles.getTileLocation(14, 5),
    tiles.getTileLocation(14, 9),
    tiles.getTileLocation(5, 9),
    tiles.getTileLocation(5, 5)
    ])
    while (!(controller.A.isPressed())) {
        if (!(controller.anyButton.isPressed()) && !(update_map)) {
            pause(20)
            continue;
        }
        if (controller.left.isPressed()) {
            if (current_map > 0) {
                current_map += -1
                update_map = true
            }
        } else if (controller.right.isPressed()) {
            if (current_map < max_map) {
                current_map += 1
                update_map = true
            }
        }
        if (!(update_map)) {
            pause(100)
            continue;
        }
        set_map(current_map)
        update_map = false
        sprite_map_title.setImage(assets.image`map_title_template`)
        if (current_map == 0) {
            sprite_map_title.image.fillRect(3, 4, 4, 8, 15)
        } else if (current_map == max_map) {
            sprite_map_title.image.fillRect(153, 4, 4, 8, 15)
        }
        images.print(sprite_map_title.image, map_names[current_map], 10, 4, 1)
        TilemapPath.stop_follow_path(sprite_map_sel_cam)
        tiles.placeOnTile(sprite_map_sel_cam, TilemapPath.get_path(map_sel_anim_path)[0])
        timer.background(function () {
            TilemapPath.follow_path(sprite_map_sel_cam, map_sel_anim_path, 50)
        })
        pause(100)
    }
    sprite_map_title.ay = 500
    sprite_map_sel_title.ay = -500
    pause(300)
    TilemapPath.stop_follow_path(sprite_map_sel_cam)
    sprite_map_sel_cam.destroy()
}
function set_beautiful_beach_map () {
    scene.setBackgroundColor(13)
    tiles.setTilemap(tilemap`beautiful_beach_map`)
}
function enable_cursor_movement (en: boolean) {
    if (en) {
        controller.moveSprite(sprite_cursor_pointer, 100, 100)
    } else {
        controller.moveSprite(sprite_cursor_pointer, 0, 0)
    }
}
function set_dark_dungeons () {
    scene.setBackgroundColor(12)
    tiles.setTilemap(tilemap`dark_dungeons`)
}
// round_number = 0
// round_code = ""
// 
// if round_number % 5 == 0:
//     first_to_spawn = 20
//     second_to_spawn = 0
//     gap = "   "
// if round_number % 5 == 1:
//     first_to_spawn = 30
//     second_to_spawn = 0
//     gap = "  "
// if round_number % 5 == 2:
//     first_to_spawn = 40
//     second_to_spawn = 10
//     gap = "  "
// if round_number % 5 == 3:
//     first_to_spawn = 80
//     second_to_spawn = 20
//     gap = " "
// if round_number % 5 == 4:
//     first_to_spawn = 90
//     second_to_spawn = 50
//     gap = " "
// 
// all_bloons = ["a", "b", "c"]
// 
// first_bloon = all_bloons[min(round_number // 5, len(all_bloons) - 1)]
// second_bloon = all_bloons[min((round_number // 5) + 1, len(all_bloons) - 1)]
// 
// while True:
//     if first_to_spawn > 0:
//         round_code += first_bloon + gap
//         first_to_spawn -= 1
//         continue
//     elif second_to_spawn > 0:
//         round_code += second_bloon + gap
//         second_to_spawn -= 1
//         continue
//     else:
//         break
// 
// return round_code
// 
function round_number_to_round_code (number: number) {
    round_code = ""
    if (number % 5 == 0) {
        round_first_to_spawn = 20
        round_second_to_spawn = 0
        round_gap = "   "
    } else if (number % 5 == 1) {
        round_first_to_spawn = 30
        round_second_to_spawn = 0
        round_gap = "  "
    } else if (number % 5 == 2) {
        round_first_to_spawn = 40
        round_second_to_spawn = 10
        round_gap = "  "
    } else if (number % 5 == 3) {
        round_first_to_spawn = 80
        round_second_to_spawn = 20
        round_gap = " "
    } else if (number % 5 == 4) {
        round_first_to_spawn = 90
        round_second_to_spawn = 50
        round_gap = " "
    }
    round_first_to_spawn = round_first_to_spawn * (Math.idiv(number, 10) + 1)
    round_second_to_spawn = round_second_to_spawn * (Math.idiv(number, 10) + 1)
    all_bloons = [
    "a",
    "b",
    "c",
    "d",
    "e"
    ]
    round_first_bloon = all_bloons[Math.min(Math.idiv(number, 5), all_bloons.length - 1)]
    round_second_bloon = all_bloons[Math.min(Math.idiv(number, 5) + 1, all_bloons.length - 1)]
    for (let index = 0; index < round_first_to_spawn; index++) {
        round_code = "" + round_code + round_first_bloon + round_gap
    }
    for (let index = 0; index < round_second_to_spawn; index++) {
        round_code = "" + round_code + round_second_bloon + round_gap
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
    for (let tile of [
    sprites.builtin.forestTiles0,
    sprites.castle.rock0,
    sprites.castle.rock1,
    sprites.castle.rock2,
    sprites.swamp.swampTile2,
    sprites.swamp.swampTile3,
    sprites.swamp.swampTile0,
    sprites.dungeon.greenOuterNorthWest,
    sprites.dungeon.greenOuterNorth0,
    sprites.dungeon.greenOuterNorthEast,
    sprites.dungeon.greenOuterEast0,
    sprites.dungeon.greenOuterSouthWest,
    sprites.dungeon.greenOuterSouth1,
    sprites.dungeon.greenOuterSouthEast,
    sprites.dungeon.greenOuterWest0,
    sprites.dungeon.doorOpenWest,
    sprites.dungeon.doorOpenEast,
    sprites.dungeon.greenOuterNorth1,
    sprites.dungeon.greenOuterEast1,
    sprites.dungeon.greenOuterSouth0,
    sprites.dungeon.greenOuterWest1,
    sprites.dungeon.greenOuterNorth2,
    sprites.dungeon.greenOuterEast2,
    sprites.dungeon.greenOuterSouth2,
    sprites.dungeon.greenOuterWest2,
    assets.tile`dungeon_bloon_spawner`
    ]) {
        for (let location of tiles.getTilesByType(tile)) {
            tiles.setWallAt(location, true)
            pause(0)
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
    land_tiles = [
    assets.tile`grass`,
    sprites.castle.tileGrass1,
    sprites.castle.tileGrass3,
    sprites.castle.tileGrass2
    ]
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
    blockMenu.showMenu(["Cancel", "Monkey Buccaneer ($50)"], MenuStyle.List, MenuLocation.BottomHalf)
    wait_for_menu_select(true)
    if (blockMenu.selectedMenuIndex() == 0) {
        return
    } else if (blockMenu.selectedMenuIndex() == 1 && info.score() >= 50) {
        info.changeScoreBy(-50)
        summon_monkey_buccaneer(sprite_cursor_pointer.x, sprite_cursor_pointer.y)
    } else {
        game.showLongText("Not enough money!", DialogLayout.Bottom)
    }
}
function set_map (index: number) {
    if (index == 0) {
        set_walk_in_the_park_map()
    } else if (index == 1) {
        set_beautiful_beach_map()
    } else if (index == 2) {
        set_dark_dungeons()
    }
}
function bloon_hp_to_speed (hp: number) {
    if (hp == 1) {
        return 50 * 1
    } else if (hp == 2) {
        return 50 * 1.4
    } else if (hp == 3) {
        return 50 * 1.8
    } else if (hp == 4) {
        return 50 * 3.2
    } else if (hp == 5) {
        return 50 * 3.5
    } else {
        return 50 * 1
    }
}
function update_monkey_buccaneer (tower: Sprite) {
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
    sprite_projectile = sprites.create(get_projectile_image(sprites.readDataNumber(tower, "dart_type"), spriteutils.radiansToDegrees(target_angle) + 360), SpriteKind.Projectile)
    sprite_projectile.setPosition(tower.x, tower.y)
    sprite_projectile.z = 20
    sprite_projectile.setFlag(SpriteFlag.DestroyOnWall, true)
    sprites.setDataNumber(sprite_projectile, "health", sprites.readDataNumber(tower, "dart_health"))
    sprites.setDataSprite(sprite_projectile, "parent", tower)
    spriteutils.setVelocityAtAngle(sprite_projectile, target_angle + 3.14159, sprites.readDataNumber(tower, "dart_speed"))
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
        } else if (round_code.charAt(index) == "d") {
            summon_bloon(4)
        } else if (round_code.charAt(index) == "e") {
            summon_bloon(5)
        } else {
            pause(delay)
        }
        pause(delay)
    }
}
function update_tack_shooter (tower: Sprite) {
    if (spriteutils.getSpritesWithin(SpriteKind.Enemy, sprites.readDataNumber(tower, "range"), tower).length == 0) {
        return
    }
    target_angle = 0
    for (let index = 0; index < 8; index++) {
        sprite_projectile = sprites.create(get_projectile_image(sprites.readDataNumber(tower, "dart_type"), spriteutils.radiansToDegrees(target_angle) + 180), SpriteKind.Projectile)
        sprite_projectile.setPosition(tower.x, tower.y)
        sprite_projectile.z = 20
        sprite_projectile.lifespan = sprites.readDataNumber(tower, "range") / sprites.readDataNumber(tower, "dart_speed") * 1000
        sprite_projectile.setFlag(SpriteFlag.DestroyOnWall, true)
        sprites.setDataNumber(sprite_projectile, "health", sprites.readDataNumber(tower, "dart_health"))
        sprites.setDataSprite(sprite_projectile, "parent", tower)
        spriteutils.setVelocityAtAngle(sprite_projectile, target_angle, sprites.readDataNumber(tower, "dart_speed"))
        target_angle += spriteutils.degreesToRadians(360 / 8)
    }
}
TilemapPath.on_sprite_finishes_path(function (sprite) {
    if (sprite.kind() == SpriteKind.Player) {
        timer.background(function () {
            TilemapPath.follow_path(sprite, map_sel_anim_path, 50)
        })
    } else {
        info.changeLifeBy(sprites.readDataNumber(sprite, "health") * -1)
        sprite.destroy()
    }
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
function animate_start_screen () {
    summon_dart_monkey(130, 0)
    sprite_tower.bottom = 112
    sprite_tower.setKind(SpriteKind.Player)
    timer.after(1500, function () {
        timer.background(function () {
            while (!(spriteutils.isDestroyed(sprite_tower))) {
                sprite_projectile = sprites.create(assets.image`dart`, SpriteKind.Projectile)
                sprite_projectile.setPosition(sprite_tower.x, sprite_tower.y)
                sprite_projectile.z = 20
                sprites.setDataNumber(sprite_projectile, "health", sprites.readDataNumber(sprite_tower, "dart_health"))
                sprites.setDataSprite(sprite_projectile, "parent", sprite_tower)
                sprite_projectile.vx = -100
                pause(500)
            }
        })
    })
    timer.background(function () {
        while (!(spriteutils.isDestroyed(sprite_tower))) {
            sprite_bloon = sprites.create(bloon_hp_to_image(1), SpriteKind.Enemy)
            sprite_bloon.right = 0
            sprite_bloon.bottom = 112
            sprite_bloon.z = 10
            sprite_bloon.vx = 50
            sprites.setDataNumber(sprite_bloon, "health", 1)
            pause(500)
        }
    })
}
function summon_tack_shooter (x: number, y: number) {
    sprite_tower = sprites.create(assets.image`tack_shooter`, SpriteKind.Tower)
    sprites.setDataNumber(sprite_tower, "id", tower_id)
    tower_id += 1
    sprites.setDataString(sprite_tower, "type", "tack_shooter")
    sprites.setDataBoolean(sprite_tower, "facing_left", true)
    sprites.setDataNumber(sprite_tower, "total_price", 30)
    sprites.setDataNumber(sprite_tower, "total_pops", 0)
    set_firing_data__tower_basic_inc_best_price_mul(sprite_tower, 500, -100, 100, 25, 1.5)
    set_range_data__tower_basic_inc_best_price_mul(sprite_tower, 24, 8, 64, 40, 1.4)
    set_dart_data__tower_type_basic_inc_best_price_mul_speed(sprite_tower, 2, 1, 1, 5, 25, 1.4, 500)
    sprite_tower.setPosition(x, y)
    sprite_tower.z = 30
}
function finish_map_loading (index: number) {
    if (index == 0) {
        finish_walk_in_the_park_map()
    } else if (index == 1) {
        finish_beautiful_beach_map()
    } else if (index == 2) {
        finish_dark_dungeons()
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
    if (!(sprite_cursor)) {
        return
    }
    if (!(sprite_water_icon) || !(sprite_land_icon)) {
        return
    }
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
    blockMenu.showMenu([
    "Cancel",
    "Dart monkey ($25)",
    "Tack shooter ($30)",
    "Sniper monkey ($40)"
    ], MenuStyle.List, MenuLocation.BottomHalf)
    wait_for_menu_select(true)
    if (blockMenu.selectedMenuIndex() == 0) {
        return
    } else if (blockMenu.selectedMenuIndex() == 1 && info.score() >= 25) {
        info.changeScoreBy(-25)
        summon_dart_monkey(sprite_cursor_pointer.x, sprite_cursor_pointer.y)
    } else if (blockMenu.selectedMenuIndex() == 2 && info.score() >= 30) {
        info.changeScoreBy(-30)
        summon_tack_shooter(sprite_cursor_pointer.x, sprite_cursor_pointer.y)
    } else if (blockMenu.selectedMenuIndex() == 3 && info.score() >= 40) {
        info.changeScoreBy(-40)
        summon_sniper_monkey(sprite_cursor_pointer.x, sprite_cursor_pointer.y)
    } else {
        game.showLongText("Not enough money!", DialogLayout.Bottom)
    }
}
function stop_animate_start_screen () {
    sprite_tower.destroy()
    tiles.destroySpritesOfKind(SpriteKind.Projectile)
    tiles.destroySpritesOfKind(SpriteKind.Enemy)
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
function finish_beautiful_beach_map () {
    land_tiles = [assets.tile`sand_left`, sprites.castle.tilePath5]
    water_tiles = [assets.tile`water`]
    spawn_locations = [tiles.getTileLocation(0, 1)]
    bloon_paths = [TilemapPath.create_path([
    tiles.getTileLocation(18, 1),
    tiles.getTileLocation(18, 4),
    tiles.getTileLocation(15, 4),
    tiles.getTileLocation(15, 1),
    tiles.getTileLocation(18, 1),
    tiles.getTileLocation(18, 8),
    tiles.getTileLocation(11, 8),
    tiles.getTileLocation(11, 1),
    tiles.getTileLocation(18, 1),
    tiles.getTileLocation(18, 13),
    tiles.getTileLocation(6, 13),
    tiles.getTileLocation(6, 1),
    tiles.getTileLocation(19, 1)
    ])]
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprites.changeDataNumberBy(sprite, "health", -1)
    sprites.changeDataNumberBy(otherSprite, "health", -1)
    if (sprites.readDataNumber(sprite, "health") <= 0) {
        sprite.destroy()
    }
    if (sprites.readDataNumber(otherSprite, "health") <= 0) {
        otherSprite.destroy()
        if (in_game) {
            info.changeScoreBy(1)
        }
        sprites.changeDataNumberBy(sprites.readDataSprite(sprite, "parent"), "total_pops", 1)
    } else {
        otherSprite.setImage(bloon_hp_to_image(sprites.readDataNumber(otherSprite, "health")))
    }
})
let path_index = 0
let sprite_bloon: Sprite = null
let menu_selected = false
let round_second_bloon = ""
let round_first_bloon = ""
let all_bloons: string[] = []
let round_gap = ""
let round_second_to_spawn = 0
let round_first_to_spawn = 0
let round_code = ""
let map_sel_anim_path: TilemapPath.TilemapPath = null
let sprite_map_sel_cam: Sprite = null
let sprite_map_sel_title: Sprite = null
let update_map = false
let sprite_map_title: Sprite = null
let map_names: string[] = []
let farthest_along_bloon: Sprite = null
let menu_options: string[] = []
let base_projectile_images: Image[] = []
let sprite_water_icon: Sprite = null
let sprite_land_icon: Sprite = null
let sprite_tower: Sprite = null
let projectile_images: Image[][] = []
let bloon_paths: TilemapPath.TilemapPath[] = []
let spawn_locations: tiles.Location[] = []
let water_tiles: Image[] = []
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
let max_map = 0
let in_round = false
let sprite_cursor: Sprite = null
let sprite_projectile: Sprite = null
let target_angle = 0
let sprite_target: Sprite = null
let sprite_cut_screen: Sprite = null
let sprite_cursor_pointer: Sprite = null
let land_tiles: Image[] = []
let in_game = false
let current_map = 0
stats.turnStats(true)
set_variables()
timer.background(function () {
    // "Bloons TD3" font is "Luckiest Guy"
    // "Play" button font is "Aclonica"
    scene.setBackgroundImage(assets.image`start_screen`)
    scene.backgroundImage().fillRect(0, 0, 160, 46, 15)
    images.print(scene.backgroundImage(), "Bloons Tower Defense v3", 4, 4, 1)
    images.print(scene.backgroundImage(), "By Unsigned_Arduino", 4, 14, 1)
    images.print(scene.backgroundImage(), "Press [A] to begin", 4, 34, 1)
    animate_start_screen()
    while (!(controller.A.isPressed())) {
        pause(20)
    }
    start_cut()
    pause(100)
    scene.setBackgroundImage(assets.image`blank_background`)
    stop_animate_start_screen()
    pause(100)
    timer.background(function () {
        stop_cut()
    })
    select_map()
    set_map(current_map)
    pause(0)
    start_loading()
    pause(0)
    finish_map_loading(current_map)
    pause(0)
    game_init()
    pause(0)
    in_game = true
    timer.background(function () {
        stop_loading()
        Notification.cancelNotification()
        Notification.waitForNotificationFinish()
        Notification.notify("Press menu to start the round")
    })
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
        } else if (sprites.readDataString(sprite_tower, "type") == "tack_shooter") {
            timer.throttle("update_tack_shooter" + sprites.readDataNumber(sprite_tower, "id"), sprites.readDataNumber(sprite_tower, "firing_speed"), function () {
                update_tack_shooter(sprite_tower)
            })
        } else if (sprites.readDataString(sprite_tower, "type") == "monkey_buccaneer") {
            timer.throttle("update_monkey_buccaneer" + sprites.readDataNumber(sprite_tower, "id"), sprites.readDataNumber(sprite_tower, "firing_speed"), function () {
                update_monkey_buccaneer(sprite_tower)
            })
        }
    }
})
