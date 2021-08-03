function update_cursor () {
    sprite_cursor.top = sprite_cursor_pointer.top
    sprite_cursor.left = sprite_cursor_pointer.left
}
function enable_cursor_movement (en: boolean) {
    if (en) {
        controller.moveSprite(sprite_cursor_pointer, 75, 75)
    } else {
        controller.moveSprite(sprite_cursor_pointer, 0, 0)
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
    sprite_cursor_pointer.setFlag(SpriteFlag.StayInScreen, true)
    sprite_cursor_pointer.setFlag(SpriteFlag.GhostThroughWalls, true)
    sprite_cursor.setFlag(SpriteFlag.Ghost, true)
    update_cursor()
    scene.cameraFollowSprite(sprite_cursor_pointer)
}
function game_init () {
    make_cursor()
}
function set_map (index: number) {
    if (index == 0) {
        set_walk_in_the_park_map()
    }
}
function finish_map_loading (index: number) {
    if (index == 0) {
        finish_walk_in_the_park_map()
    }
}
let bloon_paths: TilemapPath.TilemapPath[] = []
let spawn_locations: tiles.Location[] = []
let water_tiles: Image[] = []
let land_tiles: Image[] = []
let sprite_cursor_pointer: Sprite = null
let sprite_cursor: Sprite = null
set_map(0)
finish_map_loading(0)
game_init()
game.onUpdate(function () {
    update_cursor()
})
