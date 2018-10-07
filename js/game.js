/* Game namespace */
var game = {

    // an object where to store game information
    data: {
        // score
        score: 0
    },


    // Run on page load.
    "onload": function () {
        // Initialize the video.
        if (!me.video.init(640, 480, {wrapper: "screen", scale: "flex", scaleMethod: "flex-width"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Initialize the audio.
        me.audio.init("ogg");

        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);

        // Load the resources.
        me.loader.preload(game.resources);

        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);
    },

    // Run on game resources loaded.
    "loaded": function () {
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());

        // add our player entity in the entity pool
        me.pool.register("jessica", game.PlayerEntity);
        me.pool.register("whitey", game.NPCEntity);
        me.pool.register("coin_gold", game.CoinEntity);
        me.pool.register("doors", game.DoorsEntity);
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP, "up");
        me.input.bindKey(me.input.KEY.DOWN, "down");
        //me.input.bindKey(me.input.KEY.X, "jump", true);
        me.input.bindKey(me.input.KEY.SPACE, "action", true);
        // enable the keyboard


        // Start the game.
        me.state.change(me.state.PLAY);
    }
};
