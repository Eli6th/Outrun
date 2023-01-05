export class World {
    constructor (
        id_num,
        world_name, 
        primary_color_1, 
        primary_color_2, 
        primary_color_3, 
        text_color, 
        background_color,

        types_of_enemies,

        player_color
        ) {
        this.id_num = id_num;
        this.name = world_name;

        this.primary_color_1 = primary_color_1;
        this.primary_color_2 = primary_color_2;
        this.primary_color_3 = primary_color_3;
        this.text_color = text_color;
        this.background_color = background_color;

        this.types_of_enemies = types_of_enemies;

        this.player_color = player_color;
    }

    create_enemies(index) {
        this.types_of_enemies[index].starting_positions();
        console.log(this.types_of_enemies[index].position);
        return this.types_of_enemies[index];
    }
}