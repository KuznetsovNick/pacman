export default class Controller{
    handling(event, field, player){
        switch (event.keyCode){
            case keys["LEFT"]:
                player.wanted_direction = directions.left
                break
            case keys["RIGHT"]:
                player.wanted_direction = directions.right
                break
            case keys["DOWN"]:
                player.wanted_direction = directions.down
                break
            case keys["UP"]:
                player.wanted_direction = directions.up
                break
            default:
                return
        }
    }
}